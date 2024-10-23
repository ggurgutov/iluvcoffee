import { DynamicModule, Module } from '@nestjs/common';
import { DataSource, DataSourceOptions } from 'typeorm';

@Module({})
export class DatabaseModule {
    static register(options: DataSourceOptions): DynamicModule {
        return {
            module: DatabaseModule,
            providers: [
                {
                    provide: 'DB_CONNECTION',
                    useValue: new DataSource(options).initialize()
                }
            ],
            exports: ['DB_CONNECTION']
        }
    }
}
