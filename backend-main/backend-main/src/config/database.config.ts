import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource, DataSourceOptions } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { envs } from './envs';
import { EventEmitterModule } from '@nestjs/event-emitter';

const databaseConfig: DataSourceOptions = {
    type: 'postgres',
    username: envs.db.user,
    password: envs.db.password,
    host: envs.db.host,
    port: envs.db.port,
    database: envs.stage === 'test' ? `${envs.db.name}_test` : envs.db.name,
    useUTC: true,
    synchronize: true,
    namingStrategy: new SnakeNamingStrategy(),
    ssl: envs.stage === 'production' ? true : false,
    extra:
        envs.stage === 'production'
            ? {
                  ssl: {
                      rejectUnauthorized: false,
                  },
              }
            : {},
    // logging: envs.stage === 'dev' ? true : false,
    // logging: ['error'],
    entities: [__dirname + '/../**/entity/**/*.entity.*(ts|js)', __dirname + '/../**/*.entity.*(ts|js)'],
};

export const DatabaseConfig = [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({ useFactory: () => databaseConfig }),
    EventEmitterModule.forRoot(),
];

export default new DataSource(databaseConfig);
