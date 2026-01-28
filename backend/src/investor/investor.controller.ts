import { Controller, Get, Post, Delete, Param, Query, Body } from '@nestjs/common';
import { InvestorService } from './investor.service';
import { UmkmFilterDto } from './dto/umkm-filter.dto';

@Controller('investor')
export class InvestorController {
  constructor(private readonly investorService: InvestorService) {}

  @Get('umkm')
  async findUmkms(@Query() filterDto: UmkmFilterDto) {
    return this.investorService.findUmkms(filterDto);
  }

  @Get('umkm/:id')
  async findUmkmById(@Param('id') id: string) {
    return this.investorService.findUmkmById(id);
  }

  @Post('umkm/:id/view')
  async trackView(
    @Param('id') umkmId: string,
    @Body() body: { investorId?: string; sessionId?: string }
  ) {
    await this.investorService.trackProfileView(
      umkmId,
      body.investorId,
      body.sessionId
    );
    return { message: 'View tracked successfully' };
  }

  @Post('bookmarks')
  async addBookmark(
    @Body() body: { investorId: string; umkmId: string; notes?: string }
  ) {
    await this.investorService.addBookmark(
      body.investorId,
      body.umkmId,
      body.notes
    );
    return { message: 'Bookmark added successfully' };
  }

  @Delete('bookmarks/:umkmId')
  async removeBookmark(
    @Param('umkmId') umkmId: string,
    @Query('investorId') investorId: string
  ) {
    await this.investorService.removeBookmark(investorId, umkmId);
    return { message: 'Bookmark removed successfully' };
  }

  @Get('bookmarks')
  async getBookmarks(@Query('investorId') investorId: string) {
    return this.investorService.getBookmarks(investorId);
  }
}
