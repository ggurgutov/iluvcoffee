import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { Coffee } from './entities/coffee.entity';

@Injectable()
export class CoffeesService {
    private coffees: Coffee[] = [];

    findAll() {
        return this.coffees;
    }

    /* findOne(id: string) {
        const coffee = this.coffees.find(coffee => coffee.id === +id);
        if (!coffee) {
            throw new HttpException(`Coffee with id: ${id} not found`, HttpStatus.NOT_FOUND);
        }
        return coffee;
    } */

    findOne(id: string) {
        const coffee = this.coffees.find(coffee => coffee.id === +id);
        if (!coffee) {
            throw new NotFoundException(`Coffee with id: ${id} not found`);
        }
        return coffee;
    }

    create(createCoffeeDto: any) {
        this.coffees.push(createCoffeeDto);
    }

    update(id: string, updateCoffeeDto: any) {
        const existingCoffee = this.findOne(id);
        if (existingCoffee) {
            // update existing coffee;
        }
    }

    remove(id: string) {
        const coffeeIndex = this.coffees.findIndex(coffee => coffee.id === +id);
        if (coffeeIndex >= 0) {
            this.coffees.splice(coffeeIndex, 1);
        }
    }
}