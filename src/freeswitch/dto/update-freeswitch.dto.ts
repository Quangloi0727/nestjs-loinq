import { PartialType } from '@nestjs/mapped-types';
import { CreateFreeswitchDto } from './create-freeswitch.dto';

export class UpdateFreeswitchDto extends PartialType(CreateFreeswitchDto) {}
