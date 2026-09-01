import {
  BadRequestException,
  Controller,
  Get,
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

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async analyseFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('No file uploaded');

    return await this.receiptService.analyseReceipt(file.buffer, file.mimetype);
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
