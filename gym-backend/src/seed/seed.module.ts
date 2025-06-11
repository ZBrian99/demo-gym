import { Module } from '@nestjs/common';
import { SeedController } from './seed.controller';
import { SeedService } from './seed.service';
import { PrismaModule } from '@/prisma/prisma.module';

@Module({
  controllers: [SeedController],
  providers: [SeedService],
  imports: [PrismaModule],
})
export class SeedModule {}
