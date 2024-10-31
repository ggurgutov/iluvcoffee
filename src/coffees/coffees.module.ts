import { Module } from '@nestjs/common';
import { CoffeesController } from './coffees.controller';
import { CoffeesService } from './coffees.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Coffee, CoffeeSchema } from './entities/coffee.entity';
import { Event, EventSchema } from '../events/entities/event.entity';

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: Coffee.name, // name of the model
                schema: CoffeeSchema // schema to be used to compile the model
            },
            {
                name: Event.name,
                schema: EventSchema
            }
        ])
    ],
    controllers: [CoffeesController],
    providers: [CoffeesService],
})
export class CoffeesModule { }
