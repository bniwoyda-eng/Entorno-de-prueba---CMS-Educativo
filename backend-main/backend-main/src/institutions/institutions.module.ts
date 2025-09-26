import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { USER_AUTHENTICATION_PORT } from 'src/auth/ports/user-authentication.port';
import { PostgresUserAuthenticationAdapter } from 'src/auth/adapters/postgres-user-authentication.adapter';
import { User } from 'src/auth/entities/user.entity';
import { AuthService } from 'src/auth/auth.service';
import { EmailModule } from 'src/email/email.module';
import { CacheModule } from '@nestjs/cache-manager';
import { InstitutionService } from './institutions.service';
import { InstitutionController } from './institutions.controller';
import { Institution, InstitutionEmployees } from './entities';
import { Student } from 'src/exports/entities';

@Module({
    imports: [
        HttpModule,
        AuthModule,
        EmailModule,
        CacheModule.register(),
        TypeOrmModule.forFeature([User, Institution, InstitutionEmployees, Student]),
    ],
    controllers: [InstitutionController],
    providers: [
        {
            provide: USER_AUTHENTICATION_PORT,
            useClass: PostgresUserAuthenticationAdapter,
        },
        InstitutionService,
        AuthService,
    ],
    exports: [InstitutionService],
})
export class InstitutionModule {}
