import { Injectable } from '@nestjs/common';
import { CreateReceiptDto } from './dto/create-receipt.dto.js';
import { UpdateReceiptDto } from './dto/update-receipt.dto.js';

@Injectable()
export class ReceiptService {
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
}
