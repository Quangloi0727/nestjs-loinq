import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AuthenticateService } from './authenticate.service';

@Controller('authenticate')
export class AuthenticateController {
  constructor(private readonly authenticateService: AuthenticateService) {}

  @Get('/facebook')
  authenticateFacebook() {
    return this.authenticateService.authenticateFacebook();
  }
}
