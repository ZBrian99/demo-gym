import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  ParseUUIDPipe,
  Query,
} from '@nestjs/common';
import { AccessControlService } from './access-control.service';
import { Public } from '../auth/decorators/auth.decorator';
import { Auth } from '../auth/decorators/auth.decorator';
import { Role } from '@prisma/client';
import { FindAccessDto } from './dto/find-access.dto';
@Public()
@Controller('access-control')
export class AccessControlController {
  constructor(private readonly accessControlService: AccessControlService) {}

  @Post('validate')
  validateAccess(@Body('dni') dni: string) {
    return this.accessControlService.validateAccess(dni);
  }

  @Post('register')
  registerAccess(@Body('dni') dni: string) {
    return this.accessControlService.registerAccess(dni);
  }

  @Auth(Role.ADMIN, Role.STAFF)
  @Get('user/:userId')
  getAccessHistory(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Query() queryDto: FindAccessDto,
  ) {
    return this.accessControlService.getAccessHistory(userId, queryDto);
  }

  @Auth(Role.ADMIN, Role.STAFF)
  @Get()
  findAll(@Query() queryDto: FindAccessDto) {
    return this.accessControlService.findAll(queryDto);
  }
}
