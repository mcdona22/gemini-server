import { Injectable } from '@nestjs/common';
import { CreateReceiptDto } from './dto/create-receipt.dto.js';
import { UpdateReceiptDto } from './dto/update-receipt.dto.js';
import { GeminiService } from '../gemini/gemini.service.js';

@Injectable()
export class ReceiptService {
  constructor(private geminiService: GeminiService) {}

  create(createReceiptDto: CreateReceiptDto) {
    return 'This action adds a new receipt';
  }

  findAll() {
    return `This action returns all receipt`;
  }

  findOne(id: number) {
    return `This action returns a #${id} receipt`;
  }

  update(id: number, updateReceiptDto: UpdateReceiptDto) {
    return `This action updates a #${id} receipt`;
  }

  remove(id: number) {
    return `This action removes a #${id} receipt`;
  }

  async analyseReceipt(buffer: Buffer, mimetype: string) {
    return this.geminiService.analyseReceipt(buffer, mimetype);
  }
}
