import { Module, Scope } from '@nestjs/common';
import { CoffeesController } from './coffees.controller';
import { CoffeesService } from './coffees.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Coffee } from './entities/coffee.entity';
import { Flavor } from './entities/flavor.entity';
import { Event } from 'src/events/entities/event.entity';
import { MockCoffeesService } from './mockcoffees.service';
import { COFFEE_BRANDS, COFFEE_COMPANIES_ONE, COFFEE_COMPANIES_TWO, CONNECTION } from './coffees.constants';
import { CoffeeCompaniesFactory } from './coffee-companies.factory';
import { Connection } from 'typeorm';
import { ConfigModule } from '@nestjs/config';
import coffeesConfig from './config/coffees.config';

class ConfigService { }
class DevelopmentConfigService { }
class ProductionConfigService { }


@Module({
    imports: [
        TypeOrmModule.forFeature([Coffee, Flavor, Event]),
        ConfigModule.forFeature(coffeesConfig)
    ],
    controllers: [CoffeesController],
    // providers: [{
    //     provide: CoffeesService,
    //     useClass: CoffeesService,
    // }],
    // providers: [{
    //     provide: CoffeesService,
    //     useValue: new MockCoffeesService(),
    // }],
    providers: [
        CoffeesService,
        {
            provide: COFFEE_BRANDS,
            useValue: ['buddy brew', 'nescafe']
        },
        {
            provide: COFFEE_COMPANIES_ONE,
            useFactory: () => ['Davidoff', 'Tshibo'],
            scope: Scope.TRANSIENT
        },
        {
            provide: COFFEE_COMPANIES_TWO,
            useFactory: (companiesFactory: CoffeeCompaniesFactory) => companiesFactory.create(),
            inject: [CoffeeCompaniesFactory]
        },
        {
            provide: ConfigService,
            useClass: process.env.NODE_ENV === 'development' ? DevelopmentConfigService : ProductionConfigService,
        },
        CoffeeCompaniesFactory,
        {
            provide: CONNECTION,
            useFactory: async (connection: Connection): Promise<string[]> => {
                // const coffeeBrands = await connection.query('SELECT * ...')
                const coffeeBrands = await Promise.resolve(['buddy brew', 'nescafe']);
                console.log('ASYNC')
                return coffeeBrands;
            }
        }
    ],
    exports: [CoffeesService]
})
export class CoffeesModule { }
