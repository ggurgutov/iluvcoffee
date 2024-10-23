import { Injectable } from "@nestjs/common";

@Injectable()
export class CoffeeCompaniesFactory {
    create() {
        return ['Davidoff', 'Tshibo', 'Jacobs']
    }
}