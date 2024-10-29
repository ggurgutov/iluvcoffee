import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { CoffeesModule } from '../../src/coffees/coffees.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreateCoffeeDto } from 'src/coffees/dto/create-coffee.dto';
import { UpdateCoffeeDto } from 'src/coffees/dto/update-coffee.dto';

describe('[Feature] Coffees - /coffees', () => {
    let app: INestApplication;
    const coffee = {
        name: 'Shipwreck Roast',
        brand: 'Buddy Brew',
        flavors: ['chocolate', 'vanilla']
    };

    const expectedPartialCoffee = expect.objectContaining({
        ...coffee,
        flavors: expect.arrayContaining(
            coffee.flavors.map(name => expect.objectContaining({ name })),
        ),
    });

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [
                CoffeesModule,
                TypeOrmModule.forRoot({
                    type: 'postgres',
                    host: 'localhost',
                    port: 5433,
                    username: 'postgres',
                    password: 'pass123',
                    database: 'postgres',
                    autoLoadEntities: true,
                    synchronize: true,
                }),
            ],
        }).compile();

        app = moduleFixture.createNestApplication();
        app.useGlobalPipes(new ValidationPipe({
            whitelist: true,
            transform: true,
            forbidNonWhitelisted: true,
            transformOptions: {
                enableImplicitConversion: true
            }
        }));
        await app.init();
    });

    // it.todo('Create POST')
    it('Create [POST /]', async () => {
        return request(app.getHttpServer())
            .post('/coffees')
            .send(coffee as CreateCoffeeDto)
            .expect(HttpStatus.CREATED)
            .then(({ body }) => {
                expect(body).toEqual(expectedPartialCoffee);
            });
    })
    // it.todo('Get all')
    it('Get all [GET /]', async () => {
        return request(app.getHttpServer())
            .get('/coffees')
            .then((response) => {
                console.log(response.body);
                expect(response.body.length).toBeGreaterThan(0);
                expect(response.body[0]).toEqual(expectedPartialCoffee);
            });
    });

    it('Get one [GET /:id]', () => {
        return request(app.getHttpServer())
            .get('/coffees/1')
            .then(({ body }) => {
                expect(body).toEqual(expectedPartialCoffee);
            });
    });

    it('Update one [PATCH /:id]', async () => {
        const httpServer = app.getHttpServer();

        const updateCoffeeDto: UpdateCoffeeDto = {
            ...coffee,
            name: 'New and Improved Shipwreck Roast'
        }

        return request(httpServer)
            .patch('/coffees/1')
            .send(updateCoffeeDto)
            .then(({ body }) => {
                expect(body.name).toEqual(updateCoffeeDto.name);

                return request(httpServer)
                    .get('/coffees/1')
                    .then(({ body }) => {
                        expect(body.name).toEqual(updateCoffeeDto.name);
                    });
            });
    });

    it('Delete one [DELETE /:id]', () => {
        const httpServer = app.getHttpServer();

        return request(httpServer)
            .delete('/coffees/1')
            .expect(HttpStatus.OK)
            .then(() => {
                return request(httpServer)
                    .get('/coffees/1')
                    .expect(HttpStatus.NOT_FOUND);
            })
    });



    afterAll(async () => {
        await app.close();
    })
});
