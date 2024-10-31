import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { Coffee } from './entities/coffee.entity';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';

@Injectable()
export class CoffeesService {

    constructor(
        @InjectModel(Coffee.name)
        private readonly coffeeModel: Model<Coffee>,
        @InjectConnection()
        private readonly connection: Connection,
        @InjectModel(Event.name)
        private readonly eventModel: Model<Event>
    ) { }

    findAll(paginationQuery: PaginationQueryDto) {
        const { limit, offset } = paginationQuery;
        return this.coffeeModel.find().skip(offset).limit(limit).exec();
    }

    async findOne(id: string) {
        const coffee = await this.coffeeModel.findOne({ _id: id }).exec();
        if (!coffee) {
            throw new NotFoundException(`Coffee with id: ${id} not found`);
        }
        return coffee;
    }

    async create(createCoffeeDto: CreateCoffeeDto) {
        const coffee = new this.coffeeModel(createCoffeeDto);
        await coffee.save();
    }

    async update(id: string, updateCoffeeDto: UpdateCoffeeDto) {
        const existingCoffee = this.coffeeModel.findOneAndUpdate(
            { _id: id },
            { $set: updateCoffeeDto },
            { new: true }
        ).exec();

        if (!existingCoffee) {
            throw new NotFoundException(`Coffee #${id} not found`);
        }
        return existingCoffee;
    }

    async remove(id: string) {
        // await this.coffeeModel.findByIdAndDelete(id);

        const coffee = await this.findOne(id);
        await coffee.deleteOne();
    }

    async recommendCoffee(coffee: Coffee) {
        const session = await this.connection.startSession();
        session.startTransaction();

        try {
            coffee.recommendations++;

            const recommendEvent = new this.eventModel({
                name: 'recommend_coffee',
                type: 'coffee',
                payload: { coffeeId: coffee.id },
            });
            await recommendEvent.save({ session });
            await coffee.save({ session });

            await session.commitTransaction();
        } catch (err) {
            await session.abortTransaction();
        } finally {
            session.endSession();
        }
    }
}
