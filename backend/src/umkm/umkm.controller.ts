import { Controller, Get, Post, Put, Body, Param } from '@nestjs/common';
import { UmkmService } from './umkm.service';

@Controller('umkm')
export class UmkmController {
  constructor(private readonly umkmService: UmkmService) {}

  @Get('profile/:userId')
  async getProfile(@Param('userId') userId: string) {
    return this.umkmService.getProfile(userId);
  }

  @Post('profile')
  async createProfile(@Body() profileData: any) {
    return this.umkmService.createProfile(profileData);
  }

  @Put('profile/:id')
  async updateProfile(@Param('id') id: string, @Body() profileData: any) {
    return this.umkmService.updateProfile(id, profileData);
  }

  @Get('dashboard/:userId')
  async getDashboard(@Param('userId') userId: string) {
    return this.umkmService.getDashboard(userId);
  }
}
