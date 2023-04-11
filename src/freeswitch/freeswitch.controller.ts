import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FreeswitchService } from './freeswitch.service';
import { CreateFreeswitchDto } from './dto/create-freeswitch.dto';
import { UpdateFreeswitchDto } from './dto/update-freeswitch.dto';

@Controller('freeswitch')
export class FreeswitchController {
  constructor(private readonly freeswitchService: FreeswitchService) {}

  @Post('recording/upload')
  create(@Body() createFreeswitchDto: CreateFreeswitchDto) {
    return this.freeswitchService.create(createFreeswitchDto);
  }

  @Get()
  findAll() {
    return this.freeswitchService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.freeswitchService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFreeswitchDto: UpdateFreeswitchDto) {
    return this.freeswitchService.update(+id, updateFreeswitchDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.freeswitchService.remove(+id);
  }
}
