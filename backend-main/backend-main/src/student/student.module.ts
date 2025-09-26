import { Module } from '@nestjs/common';
import { StudentService } from './student.service';
import { StudentController } from './student.controller';
import { Student } from './entities/students.entity';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { User } from 'src/auth/entities';
import { EmailModule } from 'src/email/email.module';
import { Institution } from 'src/institutions/entities';
import { PostgresUserAuthenticationAdapter } from 'src/auth/adapters/postgres-user-authentication.adapter';
import { AuthService } from 'src/auth/auth.service';
import { USER_AUTHENTICATION_PORT } from 'src/auth/ports/user-authentication.port';
import { Course } from 'src/courses/entities';

@Module({
    imports: [
        HttpModule,
        AuthModule,
        EmailModule,
        TypeOrmModule.forFeature([User, Institution, Student, Course]),
    ],
    controllers: [StudentController],
    providers: [
        {
            provide: USER_AUTHENTICATION_PORT,
            useClass: PostgresUserAuthenticationAdapter,
        },
        StudentService,
        AuthService,
    ],
    exports: [StudentService],
})
export class StudentModule {}
