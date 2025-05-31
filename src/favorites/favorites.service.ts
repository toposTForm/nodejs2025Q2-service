import { Injectable } from '@nestjs/common';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { UpdateFavoriteDto } from './dto/update-favorite.dto';
import { randomUUID } from 'crypto';
import { validate } from 'uuid';
import { Favorite } from './entities/favorite.entity';
import { Track } from 'src/tracks/entities/track.entity';
import { CreateTrackDto } from 'src/tracks/dto/create-track.dto';
import { Artist } from 'src/artists/entities/artist.entity';
import { CreateArtistDto } from 'src/artists/dto/create-artist.dto';
import { CreateAlbumDto } from 'src/albums/dto/create-album.dto';
import { Album } from 'src/albums/entities/album.entity';

export enum STATUS {
  BADREQUEST = 400,
  NOTFOUND = 404,
  WRONGDTO = 403,
  DELETED = 204,
  OBJECTONERROR = 422,
}

@Injectable()
export class FavoritesService {

  addTrack(id: string) {
    let trackIndex = Track.usersDb.findIndex(track => track.id == id);
    if (trackIndex == -1){
      return STATUS.OBJECTONERROR;
    }
    let track: CreateTrackDto = Track.usersDb[trackIndex];
    let newFav = new Favorite(undefined, undefined, track);
    console.log(`new favorite track added! ${JSON.stringify(track)}`);
    return newFav;
  }

  addArtist(id: string) {
    let artistIndex = Artist.usersDb.findIndex(artist => artist.id == id);
    if (artistIndex == -1){
      return STATUS.OBJECTONERROR;
    }
    let artist: CreateArtistDto = Artist.usersDb[artistIndex];
    let newFav = new Favorite(artist, undefined, undefined);
    console.log(`new favorite artist added! ${JSON.stringify(artist)}`);
    return newFav;
  }

  addAlbum(id: string) {
    let albumIndex = Album.usersDb.findIndex(album => album.id == id);
    if (albumIndex == -1){
      return STATUS.OBJECTONERROR;
    }
    let album: CreateAlbumDto = Album.usersDb[albumIndex];
    let newFav = new Favorite(undefined, album, undefined);
    console.log(`new favorite album added! ${JSON.stringify(album)}`);
    return newFav;
  }
  
  findAll() {
    console.log( `This action returns all favorites`);
    return {
      artists: Favorite.artists,
      albums: Favorite.albums,
      tracks: Favorite.tracks,
    };
  }

  removeFavTrack(id: string) {
    let trackIndex = Favorite.tracks.findIndex(track => track.id == id);
    if (trackIndex == -1){
      return STATUS.NOTFOUND
    }
    Favorite.tracks.splice(trackIndex, 1);
    console.log( `This action removes a #${id} track from favorites`);
    return STATUS.DELETED;
   }

  removeFavArtist(id: string) {
    let artistIndex = Favorite.artists.findIndex(artist => artist.id == id);
    if (artistIndex == -1){
      return STATUS.NOTFOUND
    }
    Favorite.artists.splice(artistIndex, 1);
    console.log( `This action removes a #${id} artist from favorites`);
    return STATUS.DELETED;
  }

  removeFavAlbum(id: string) {
    let albumIndex = Favorite.albums.findIndex(album => album.id == id);
    if (albumIndex == -1){
      return STATUS.NOTFOUND
    }
    Favorite.albums.splice(albumIndex, 1);
    console.log( `This action removes a #${id} album from favorites`);
    return STATUS.DELETED;
  }
}
