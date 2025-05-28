import { Controller, Get, Post, Put, Body, Patch, Param, Delete, BadRequestException, NotFoundException, BadGatewayException, ForbiddenException } from '@nestjs/common';
import { STATUS, UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto  } from './dto/update-user.dto';
import { validate } from 'uuid';
import { User } from './entities/user.entity';

@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    if (!(typeof createUserDto.login == 'string') || !(typeof createUserDto.password == 'string')) {
        throw new BadRequestException(`body does not contain required fields!`)
    }
    console.log(createUserDto.login)
    return this.usersService.create(createUserDto);
  }

  @Put(':id')
    update(@Param('id') id: string, @Body() updatePasswordDto : UpdatePasswordDto ) {
      id = id.slice(1,id.length);
      if (!validate(id)){
        throw new BadRequestException(`id ${id} is not UUID type!`);
      }
      let serviceAnswer: STATUS | unknown = this.usersService.update(id, updatePasswordDto);
      if (serviceAnswer == STATUS.NOTFOUND){
        throw new NotFoundException(`user with id ${id} no found!`);
      } else if (serviceAnswer as STATUS == STATUS.WRONGDTO){
        throw new ForbiddenException(`oldPassword is wrong!`)
      }else {
        return serviceAnswer;
      }
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    id = id.slice(1,id.length);
    if (!validate(id)){
      throw new BadRequestException(`id ${id} is not UUID type!`);
    }
    let data: string | unknown = this.usersService.findOne(id);
    if (data == null) return new NotFoundException(`user with id ${id} no found!`);
    return data;
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    id = id.slice(1,id.length);
    if (!validate(id)){
      throw new BadRequestException(`id ${id} is not UUID type!`);
    }
    let serviceAnswer: STATUS | unknown = this.usersService.remove(id);
    if (serviceAnswer == STATUS.NOTFOUND){
      throw new NotFoundException(`user with id ${id} no found!`);
    }else {
      return serviceAnswer;
    }
  }
}
