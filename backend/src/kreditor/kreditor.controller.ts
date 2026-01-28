import { Controller, Get, Post, Delete, Param, Query, Body } from '@nestjs/common';
import { KreditorService } from './investor.service';
import { UmkmFilterDto } from './dto/umkm-filter.dto';

@Controller('investor')
export class KreditorController {
  constructor(private readonly KreditorService: KreditorService) {}

  @Get('umkm')
  async findUmkms(@Query() filterDto: UmkmFilterDto) {
    return this.KreditorService.findUmkms(filterDto);
  }

  @Get('umkm/:id')
  async findUmkmById(@Param('id') id: string) {
    return this.KreditorService.findUmkmById(id);
  }

  @Post('umkm/:id/view')
  async trackView(
    @Param('id') umkmId: string,
    @Body() body: { kreditorId?: string; sessionId?: string }
  ) {
    await this.KreditorService.trackProfileView(
      umkmId,
      body.kreditorId,
      body.sessionId
    );
    return { message: 'View tracked successfully' };
  }

  @Post('bookmarks')
  async addBookmark(
    @Body() body: { kreditorId: string; umkmId: string; notes?: string }
  ) {
    await this.KreditorService.addBookmark(
      body.kreditorId,
      body.umkmId,
      body.notes
    );
    return { message: 'Bookmark added successfully' };
  }

  @Delete('bookmarks/:umkmId')
  async removeBookmark(
    @Param('umkmId') umkmId: string,
    @Query('kreditorId') kreditorId: string
  ) {
    await this.KreditorService.removeBookmark(kreditorId, umkmId);
    return { message: 'Bookmark removed successfully' };
  }

  @Get('bookmarks')
  async getBookmarks(@Query('kreditorId') kreditorId: string) {
    return this.KreditorService.getBookmarks(kreditorId);
  }
}

