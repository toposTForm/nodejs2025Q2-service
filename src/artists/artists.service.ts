import { Injectable } from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { Artist } from './entities/artist.entity';
import { randomUUID } from 'crypto';
import { Track } from 'src/tracks/entities/track.entity';
import { Album } from 'src/albums/entities/album.entity';

export enum STATUS {
  BADREQUEST = 400,
  NOTFOUND = 404,
  WRONGDTO = 403,
  DELETED = 204
}

@Injectable()
export class ArtistsService {
  create(createArtistDto: CreateArtistDto) {
    let id = randomUUID();
    createArtistDto.id = id;
    const artist = new Artist(createArtistDto);
    console.log(`new artist added!`)
    return artist;
  }

  findAll() {
    console.log( `This action returns all artists`);
    return Artist.usersDb;
  }

  findOne(id: string) {
    let artist = Artist.usersDb.find(user => user.id == id);
    if (artist == undefined){
      return STATUS.NOTFOUND
    } 
    console.log(`This action returns a #${id} artist`);
    return artist;
  }

  update(id: string, updateArtistDto: UpdateArtistDto) {
    let name = updateArtistDto.name;
    let grammy = updateArtistDto.grammy;
    if (name == undefined || grammy == undefined || typeof name == 'number') return STATUS.BADREQUEST;
    let artist = Artist.usersDb.find(user => user.id == id);
    if (artist == undefined){
      return STATUS.NOTFOUND
    }
    artist.name = name;
    artist.grammy = grammy;
    return `Artist #${id} updated`;
  }

  remove(id: string) {
    let artistIdex = Artist.usersDb.findIndex(user => user.id == id);
      if (artistIdex == -1){
      return STATUS.NOTFOUND
    }
    let artistId = Artist.usersDb[artistIdex].id;
    Track.usersDb.forEach(track => {
      if (track.artistId == artistId) track.artistId = null;
    });
    Album.usersDb.forEach(album => {
      if (album.artistId == artistId) album.artistId = null;
    })
    Artist.usersDb.splice(artistIdex, 1);
    console.log( `This action removes a #${id} artist`);
    return STATUS.DELETED;
  }
}
