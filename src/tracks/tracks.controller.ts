import { Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException, NotFoundException, Put, ForbiddenException} from '@nestjs/common';
import { TracksService, STATUS } from './tracks.service';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { validate } from 'uuid';


@Controller('/track')
export class TracksController {
  constructor(private readonly tracksService: TracksService) {}

  @Post()
  create(@Body() createTrackDto: CreateTrackDto) {
    // return this.tracksService.create(createTrackDto);
    if (createTrackDto.name !== undefined && createTrackDto.duration !== undefined && createTrackDto.artistId !== undefined && createTrackDto.albumId){
      if (!(createTrackDto.name.length > 0 || createTrackDto.duration) || !(createTrackDto.name.length > 0)) {
        throw new BadRequestException(`body does not contain required fields!`);
      }
      return this.tracksService.create(createTrackDto);
    }else {
      throw new BadRequestException(`body does not contain required fields!`);
    }
  }

  @Get()
  findAll() {
    return this.tracksService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    if (id[0] == ':') id = id.slice(1,id.length);
    if (!validate(id)){
      throw new BadRequestException(`id ${id} is not UUID type!`);
    }
    let data: string | unknown = this.tracksService.findOne(id);
    if (data == STATUS.NOTFOUND){
      return new NotFoundException(`track with id ${id} no found!`)
    } else {
      return data;
    }
  }

@Put(':id')
    update(@Param('id') id: string, @Body() UpdateTrackDto : UpdateTrackDto ) {
      if (id[0] == ':') id = id.slice(1,id.length);
      if (!validate(id)){
        throw new BadRequestException(`id ${id} is not UUID type!`);
      }
      let serviceAnswer: STATUS | unknown = this.tracksService.update(id, UpdateTrackDto);
      if (serviceAnswer == STATUS.NOTFOUND){
        throw new NotFoundException(`track with id ${id} no found!`);
      } else {
        return serviceAnswer;
      }
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    if (id[0] == ':') id = id.slice(1,id.length);
    if (!validate(id)){
      throw new BadRequestException(`id ${id} is not UUID type!`);
    }
    let serviceAnswer: STATUS | unknown = this.tracksService.remove(id);
    if (serviceAnswer == STATUS.NOTFOUND){
      throw new NotFoundException(`track with id ${id} no found!`);
    }else {
      return serviceAnswer;
    }
  }
}
