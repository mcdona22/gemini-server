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
import { receiptContract } from '../gemini/receipt.schema.js';

import { FileInterceptor } from '@nestjs/platform-express';
import 'multer';
import {
  ApiConsumes,
  ApiCreatedResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Receipts')
@Controller('receipt')
export class ReceiptController {
  private readonly logger = new Logger(ReceiptController.name);
  private receiptContract: any;

  constructor(private readonly receiptService: ReceiptService) {}

  @Post('analyse')
  @ApiOperation({
    summary: 'Convert an image of a receipt to a structured JSON document',
  })
  @ApiConsumes('multipart/form-data')
  @ApiCreatedResponse({ schema: receiptContract as any })
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

  @Get('schema')
  @ApiOperation({
    summary: 'Get the JSON Schema contract for receipt responses',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns raw JSON Schema Draft-07 contract',
  })
  getReceiptSchema() {
    return this.receiptContract;
  }

  // @Get()
  // findAll() {
  //   return this.receiptService.findAll();
  // }

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
