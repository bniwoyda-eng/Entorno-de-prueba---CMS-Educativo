import { Module } from '@nestjs/common';
import { EntityValidatorService } from './services/entity-validator.service';

@Module({
    providers: [EntityValidatorService],
    exports: [EntityValidatorService],
})
export class CommonModule { }
