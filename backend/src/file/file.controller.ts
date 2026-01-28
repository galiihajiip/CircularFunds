import {
  Controller,
  Post,
  Delete,
  Param,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  UseGuards,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileService } from './file.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('files')
@UseGuards(JwtAuthGuard)
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: any) {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    const validation = this.fileService.validateFile(file);
    if (!validation.valid) {
      throw new BadRequestException(validation.error);
    }

    const fileUrl = await this.fileService.uploadFile(file);

    return {
      url: fileUrl,
      fileName: file.originalname,
      fileSize: file.size,
      fileType: file.mimetype,
    };
  }

  @Delete(':fileUrl')
  async deleteFile(@Param('fileUrl') fileUrl: string) {
    await this.fileService.deleteFile(fileUrl);
    return { message: 'File deleted successfully' };
  }
}
