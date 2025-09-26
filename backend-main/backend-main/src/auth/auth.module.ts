import { Module } from '@nestjs/common';
import { envs } from 'src/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { User } from './entities/user.entity';
import { JwtStrategy } from './strategies/jwt.strategy';
import { USER_AUTHENTICATION_PORT } from './ports/user-authentication.port';
import { PostgresUserAuthenticationAdapter } from './adapters/postgres-user-authentication.adapter';
import { EmailModule } from 'src/email/email.module';
import { InstitutionEmployees } from 'src/institutions/entities';
import { Student } from 'src/exports/entities';

@Module({
    controllers: [AuthController],
    providers: [
        AuthService,
        JwtStrategy,
        {
            provide: USER_AUTHENTICATION_PORT,
            useClass: PostgresUserAuthenticationAdapter,
        },
    ],
    imports: [
        EmailModule,
        TypeOrmModule.forFeature([User, InstitutionEmployees, Student]),
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.registerAsync({
            imports: [],
            inject: [],
            useFactory: () => {
                return {
                    secret: envs.jwt_secret,
                    signOptions: {
                        expiresIn: '1h',
                    },
                };
            },
        }),
    ],
    exports: [TypeOrmModule, JwtStrategy, PassportModule, JwtModule],
})
export class AuthModule {}
