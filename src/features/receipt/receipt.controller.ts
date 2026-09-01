import { Controller, Get, Post, Body, UploadedFile, Patch, Param, Delete, UseInterceptors } from '@nestjs/common';
import { ReceiptService } from './receipt.service.js';
import { CreateReceiptDto } from './dto/create-receipt.dto.js';
import { UpdateReceiptDto } from './dto/update-receipt.dto.js';
import { FileInterceptor } from '@nestjs/platform-express';
import 'multer';

@Controller('receipt')
export class ReceiptController {
  constructor(private readonly receiptService: ReceiptService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file:  Express.Multer.File) {
    return { fileName:file.originalname };
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
