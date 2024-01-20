import { NotFoundException } from '@nestjs/common';

export class NotFoundDataException extends NotFoundException {
  constructor(endpoint: string,id: number) {
    super(`${endpoint} with id ${id} not found`);
  }
}