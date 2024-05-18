import { PartialType } from '@nestjs/swagger';
import { CreateReadTimeDto } from './create-read-time.dto';

export class UpdateReadTimeDto extends PartialType(CreateReadTimeDto) {}
