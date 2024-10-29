import { Test, TestingModule } from '@nestjs/testing';
import { CoffeesService } from './coffees.service';
import { Connection, DataSource, Repository } from 'typeorm';
import { Flavor } from './entities/flavor.entity';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';
import { Coffee } from './entities/coffee.entity';
import { COFFEE_BRANDS, COFFEE_COMPANIES_ONE, COFFEE_COMPANIES_TWO, CONNECTION } from './coffees.constants';
import { NotFoundException, Scope } from '@nestjs/common';
import { CoffeeCompaniesFactory } from './coffee-companies.factory';
import { ConfigModule, ConfigService } from '@nestjs/config';
import coffeesConfig from './config/coffees.config';


type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

const createMockRepository = <T = any>(): MockRepository<T> => ({
  findOne: jest.fn(),
  create: jest.fn(),
});

describe('CoffeesService', () => {
  let service: CoffeesService;
  let coffeeRepository: MockRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forFeature(coffeesConfig),
      ],
      providers: [
        CoffeesService,
        {
          provide: DataSource,
          useValue: {}
        },
        {
          provide: getRepositoryToken(Flavor),
          useValue: createMockRepository()
        },
        {
          provide: getRepositoryToken(Coffee),
          useValue: createMockRepository()
        },
        {
          provide: COFFEE_BRANDS,
          useValue: []
        },
        {
          provide: COFFEE_COMPANIES_ONE,
          useValue: {}
        },
        {
          provide: COFFEE_COMPANIES_TWO,
          useValue: {}
        },
        {
          provide: ConfigService,
          useValue: { get() { } }
        },
        CoffeeCompaniesFactory,
        {
          provide: CONNECTION,
          useValue: {}
        },
      ],
    }).compile();

    service = module.get<CoffeesService>(CoffeesService);
    coffeeRepository = module.get<MockRepository>(getRepositoryToken(Coffee));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    it('should return the coffee object', async () => {
      const coffeeId = '1';
      const expectedCoffee = {};

      coffeeRepository.findOne.mockReturnValue(expectedCoffee);

      const coffee = await service.findOne(coffeeId);
      expect(coffee).toEqual(expectedCoffee);
    });

    it('should throw the "NotFoundException"', async () => {
      const coffeeId = '1';
      coffeeRepository.findOne.mockReturnValue(undefined);

      try {
        await service.findOne(coffeeId);
        expect(false).toBeTruthy(); // we should never hit this line
      } catch (err) {
        expect(err).toBeInstanceOf(NotFoundException);
        expect(err.message).toEqual(`Coffee with id: ${coffeeId} not found`);
      }
    });
  });
});

