import {
  BadRequestException,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Logger,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { ReceiptService } from './receipt.service.js';

import { FileInterceptor } from '@nestjs/platform-express';
import 'multer';

@Controller('receipt')
export class ReceiptController {
  private readonly logger = new Logger(ReceiptController.name);

  constructor(private readonly receiptService: ReceiptService) {}

  @Post('analyse')
  @UseInterceptors(FileInterceptor('file'))
  async analyseFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('No file uploaded');
    try {
      return await this.receiptService.analyseReceipt(
        file.buffer,
        file.mimetype,
      );
    } catch (error: unknown) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        {
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Receipt Analysis Failure',
          message: (error as Error).message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  findAll() {
    return this.receiptService.findAll();
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.receiptService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateReceiptDto: UpdateReceiptDto) {
  //   return this.receiptService.update(+id, updateReceiptDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.receiptService.remove(+id);
  // }
}
