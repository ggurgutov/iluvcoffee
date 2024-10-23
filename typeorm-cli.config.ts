import { Coffee } from "src/coffees/entities/coffee.entity";
import { Flavor } from "src/coffees/entities/flavor.entity";
import { CoffeeRefactor1728249633217 } from "src/migrations/1728249633217-CoffeeRefactor";
// import { SchemaSync1729102838180 } from "src/migrations/1729102838180-SchemaSync";
import { DataSource } from "typeorm";

export default new DataSource({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'pass123',
    database: 'postgres',
    entities: [Coffee, Flavor],
    migrations: [CoffeeRefactor1728249633217]
});