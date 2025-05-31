import { Injectable } from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { randomUUID } from 'crypto';
import { Album } from './entities/album.entity';
import { validate } from 'uuid';
import { Track } from 'src/tracks/entities/track.entity';

export enum STATUS {
  BADREQUEST = 400,
  NOTFOUND = 404,
  WRONGDTO = 403,
  DELETED = 204
}

@Injectable()
export class AlbumsService {
create(CreateAlbumDto: CreateAlbumDto) {
    let id = randomUUID();
    CreateAlbumDto.id = id;
    const album = new Album(CreateAlbumDto);
    console.log(`new album added!`)
    return album;
  }

  findAll() {
    console.log( `This action returns all albums`);
    return Album.usersDb;
  }

  findOne(id: string) {
    let album = Album.usersDb.find(user => user.id == id);
    if (album == undefined){
      return STATUS.NOTFOUND
    } 
    console.log(`This action returns a #${id} album`);
    return album;
  }

  update(id: string, UpdateAlbumDto: UpdateAlbumDto) {
    if (UpdateAlbumDto.artistId !== null){
      if (!validate(UpdateAlbumDto.artistId)) return STATUS.BADREQUEST;
    }
    let name = UpdateAlbumDto.name;
    let artistId = UpdateAlbumDto.artistId;
    let year = UpdateAlbumDto.year
    if (name == undefined || year == undefined || typeof name == 'number') return STATUS.BADREQUEST;
    let album = Album.usersDb.find(user => user.id == id);
    if (album == undefined){
      return STATUS.NOTFOUND
    }
    album.name = name;
    album.year = year;
    album.artistId = artistId;
    return `Artist #${id} updated`;
  }

  remove(id: string) {
    let albumIndex = Album.usersDb.findIndex(user => user.id == id);
      if (albumIndex == -1){
      return STATUS.NOTFOUND
    }
    let albumId = Album.usersDb[albumIndex].id;
    Album.usersDb.splice(albumIndex, 1);
    Track.usersDb.forEach(track => {
      if (track.albumId == albumId) track.albumId = null;
    })
    console.log( `This action removes a #${id} artist`);
    return STATUS.DELETED;
  }
}
