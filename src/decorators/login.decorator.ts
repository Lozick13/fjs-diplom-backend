import { CanActivate, UseGuards, applyDecorators } from '@nestjs/common';
import { ApiUnauthorizedResponse } from '@nestjs/swagger';
import { LocalAuthGuard } from 'src/guards/auth.guard';
import { IsNotAuthenticatedGuard } from 'src/guards/is-not-authenticated.guard';

export function Login() {
  return applyDecorators(
    UseGuards(
      IsNotAuthenticatedGuard,
      LocalAuthGuard as new (...args: unknown[]) => CanActivate,
    ),
    ApiUnauthorizedResponse({ description: 'Вы уже авторизованы' }),
  );
}
