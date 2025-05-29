import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto  } from './dto/update-user.dto';
import { randomUUID, UUID } from 'crypto';
import { User } from './entities/user.entity';

export enum STATUS {
  BADREQUEST = 400,
  NOTFOUND = 404,
  WRONGDTO = 403,
  DELETED = 204
}

@Injectable()
export class UsersService {
  create(createUserDto: CreateUserDto) {
    let genuuid = randomUUID();
    let version = 1.0;
    let createdAt = Date.now();
    let updatedAt = Date.now();
    const user = new User(createUserDto, genuuid, version, createdAt, updatedAt);
    console.log('new user added!')
    return user;
  }

  findAll() {
    console.log( `This action returns all users`);
    return User.usersDb;
  }

  findOne(id: string) {
    let user = User.usersDb.find(user => user.id == id);
    if (user == undefined){
      return STATUS.NOTFOUND
    } 
    console.log(`This action returns a #${id} user`);
    return user;
  }

  update(id: string, updatePasswordDto: UpdatePasswordDto ) {
    let newPassword = updatePasswordDto.newPassword;
    let oldPassword = updatePasswordDto.oldPassword;
    let user = User.usersDb.find(user => user.id == id);
    if (user == undefined){
      return STATUS.NOTFOUND
    } else if (user.password !== oldPassword) return STATUS.WRONGDTO;
    user.password = newPassword;
    return `Password of #${id} user updated`;
  }

  remove(id: string) {
    let userIdex = User.usersDb.findIndex(user => user.id == id);
     if (userIdex == null){
      return STATUS.NOTFOUND
    }
    User.usersDb.splice(userIdex, 1);
    console.log(`This action removes a #${id} user`)
    return STATUS.DELETED;
  }
}
