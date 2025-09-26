import { Controller, Post } from '@nestjs/common';
import { SeedService } from './seed.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('seed')
@ApiTags('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) { }

  @Post()
  async runSeed() {
    await this.seedService.run();
    return { message: 'Seed ejecutado correctamente' };
  }
}
