import { Controller, Post, Query } from '@nestjs/common';
import { SeedService } from './seed.service';
import { Public } from '@/auth/decorators/auth.decorator';

@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}
  @Public()
  @Post('admin')
  createAdmin() {
    return this.seedService.createAdmin();
  }

  @Post('users')
  createRandomUsers(@Query('count') count?: number) {
    return this.seedService.createRandomUsers(count || 200);
  }
}
