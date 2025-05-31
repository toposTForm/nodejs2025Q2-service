import { Injectable } from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { Track } from './entities/track.entity';
import { randomUUID } from 'crypto';

export enum STATUS {
  BADREQUEST = 400,
  NOTFOUND = 404,
  WRONGDTO = 403,
  DELETED = 204
}

@Injectable()
export class TracksService {
  create(CreateTrackDto: CreateTrackDto) {
      let id = randomUUID();
      CreateTrackDto.id = id;
      const track = new Track(CreateTrackDto);
      console.log(`new track added!`)
      return track;
    }

  findAll() {
    console.log( `This action returns all tracks`);
    return Track.usersDb;
  }

  findOne(id: string) {
    let user = Track.usersDb.find(user => user.id == id);
    if (user == undefined){
      return STATUS.NOTFOUND
    } 
    console.log(`This action returns a #${id} track`);
    return user;
  }

  update(id: string, updateTrackDto: UpdateTrackDto) {
    let name = updateTrackDto.name;
    let artistId = updateTrackDto.artistId;
    let albumId = updateTrackDto.albumId;
    let duration = updateTrackDto.duration;
    if (name == undefined || duration == undefined) return STATUS.BADREQUEST;
    let track = Track.usersDb.find(user => user.id == id);
    if (track == undefined){
      return STATUS.NOTFOUND
    }
    track.name = name;
    track.artistId = artistId;
    track.albumId = albumId;
    track.duration = duration;
    return `Track #${id} updated`;
  }

  remove(id: string) {
    let trackIdex = Track.usersDb.findIndex(user => user.id == id);
      if (trackIdex == -1){
      return STATUS.NOTFOUND
    }
    Track.usersDb.splice(trackIdex, 1);
    console.log( `This action removes a #${id} track`);
  
    return STATUS.DELETED;  
  }
}
