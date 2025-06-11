import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { RolesGuard } from '../guards/roles.guard';
import { Role } from '@prisma/client';
import { AuthGuard } from '@nestjs/passport';

export function Auth(...roles: Role[]) {
  return applyDecorators(
    SetMetadata('roles', roles),
    UseGuards(AuthGuard('jwt'), RolesGuard),
  );
}

export function Public() {
  return SetMetadata('isPublic', true);
}
