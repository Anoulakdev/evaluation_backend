import { PartialType } from '@nestjs/mapped-types';
import { CreateTotalDto } from './create-total.dto';

export class UpdateTotalDto extends PartialType(CreateTotalDto) {}
