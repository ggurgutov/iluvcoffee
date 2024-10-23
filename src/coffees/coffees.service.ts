import { HttpException, HttpStatus, Inject, Injectable, NotFoundException, Scope } from '@nestjs/common';
import { Coffee } from './entities/coffee.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';
import { Flavor } from './entities/flavor.entity';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { Event } from 'src/events/entities/event.entity';
import { COFFEE_BRANDS, COFFEE_COMPANIES_ONE, COFFEE_COMPANIES_TWO, CONNECTION } from './coffees.constants';
import { ConfigService, ConfigType } from '@nestjs/config';
import coffeesConfig from './config/coffees.config';

// @Injectable({scope: Scope.DEFAULT})
// export class CoffeesService {
@Injectable()
export class CoffeesService {
    constructor(
        @InjectRepository(Coffee)
        private readonly coffeeRepository: Repository<Coffee>,
        @InjectRepository(Flavor)
        private readonly flavorRepository: Repository<Flavor>,
        private readonly dataSource: DataSource,
        @Inject(COFFEE_BRANDS) coffeeBrands: string[],
        @Inject(COFFEE_COMPANIES_ONE) coffeeCompaniesOne: string[],
        @Inject(COFFEE_COMPANIES_TWO) coffeeCompaniesTwo: string[],
        @Inject(CONNECTION) connection: string[],

        private readonly configService: ConfigService,

        @Inject(coffeesConfig.KEY)
        private readonly coffeesConfiguration: ConfigType<typeof coffeesConfig>
    ) {
        console.log('coffee_brands', coffeeBrands);
        console.log('coffee_companies One', coffeeCompaniesOne);
        console.log('coffee_companies Two', coffeeCompaniesTwo);
        console.log('Connection', connection);

        const dbHost = configService.get<string>('database.host', 'default value, if key doesnt exist')
        console.log('DB Host - ', dbHost);

        const config = configService.get('coffees'); // .get('coffees.foo');
        console.log('Config', config);

        console.log('+++CoffeesConfig', coffeesConfiguration.foo);
    }

    findAll(paginatedQuery: PaginationQueryDto) {

        const { offset, limit } = paginatedQuery;
        return this.coffeeRepository.find({
            relations: {
                flavors: true
            },
            skip: offset,
            take: limit
        });
    }

    async findOne(id: string) {
        const coffee = await this.coffeeRepository.findOne({
            where: { id: +id },
            relations: {
                flavors: true
            }
        });
        if (!coffee) {
            throw new NotFoundException(`Coffee with id: ${id} not found`);
        }
        return coffee;
    }

    async create(createCoffeeDto: CreateCoffeeDto) {
        // insert cascading missing flavors
        const flavors = await Promise.all(
            createCoffeeDto.flavors.map(name => this.preloadFlavorByName(name))
        );

        const coffee = this.coffeeRepository.create({
            ...createCoffeeDto,
            flavors
        });
        return this.coffeeRepository.save(coffee);
    }

    async update(id: string, updateCoffeeDto: UpdateCoffeeDto) {
        const flavors = updateCoffeeDto.flavors &&
            (await Promise.all(
                updateCoffeeDto.flavors.map(name => this.preloadFlavorByName(name))
            ))

        const coffee = await this.coffeeRepository.preload({
            id: +id,
            ...updateCoffeeDto,
            flavors
        });
        if (!coffee) {
            throw new NotFoundException(`Coffee #${id} not found`);
        }
        return this.coffeeRepository.save(coffee);
    }

    async remove(id: string) {
        const coffee = await this.findOne(id);
        return this.coffeeRepository.remove(coffee);
    }

    async recommendCoffee(coffee: Coffee) {
        const queryRunner = this.dataSource.createQueryRunner();

        await queryRunner.connect();
        await queryRunner.startTransaction();

        try {
            coffee.recommendations++;
            const recommendEvent = new Event();
            recommendEvent.name = 'recomment_coffee';
            recommendEvent.type = 'coffee';
            recommendEvent.payload = { coffeeId: coffee.id };

            await queryRunner.manager.save(coffee);
            await queryRunner.manager.save(recommendEvent);

            await queryRunner.commitTransaction();
        } catch (error) {
            await queryRunner.rollbackTransaction();
        } finally {
            await queryRunner.release();
        }
    }

    private async preloadFlavorByName(name: string): Promise<Flavor> {
        const flavor = await this.flavorRepository.findOne({
            where: { name }
        });
        if (flavor) {
            return flavor;
        }
        return this.flavorRepository.create({ name });
    }
}
