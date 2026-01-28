import { Controller, Post, Get, Body, Param, UseGuards, Request } from '@nestjs/common';
import { KycService } from './kyc.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('kyc')
@UseGuards(JwtAuthGuard)
export class KycController {
  constructor(private readonly kycService: KycService) {}

  @Post('business-owner')
  submitBusinessOwnerKyc(@Request() req, @Body() body: { kycData: any; financialData: any }) {
    return this.kycService.submitBusinessOwnerKyc(req.user.id, body.kycData, body.financialData);
  }

  @Post('lender')
  submitLenderKyc(@Request() req, @Body() body: { kycData: any; financialData: any }) {
    return this.kycService.submitLenderKyc(req.user.id, body.kycData, body.financialData);
  }

  @Get('status')
  getKycStatus(@Request() req) {
    return this.kycService.getKycStatus(req.user.id);
  }

  @Get('rdn-account')
  getRdnAccount(@Request() req) {
    return this.kycService.getRdnAccount(req.user.id);
  }

  @Post('approve/:userId')
  approveKyc(@Param('userId') userId: string, @Request() req) {
    return this.kycService.approveKyc(userId, req.user.id);
  }

  @Post('reject/:userId')
  rejectKyc(@Param('userId') userId: string, @Body() body: { reason: string }, @Request() req) {
    return this.kycService.rejectKyc(userId, req.user.id, body.reason);
  }
}
