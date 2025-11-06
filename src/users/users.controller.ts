import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetUser } from 'src/auth/decorators';
import { User } from './entities/user.entity';
import { CreateUserResponse, FindAllUserResponse, FindOneByUserResponse } from './response';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UseGuards(AuthGuard())
  @ApiResponse(CreateUserResponse)
  async create(@Body() createUserDto: CreateUserDto, @GetUser() user: User) {
    return {error: false, response: await this.usersService.create(createUserDto, user)};
  }

  @Get('users-loans-amount')
  @UseGuards(AuthGuard())
  async findLoansAmount() {
    return {error: false, response: await this.usersService.findLoansAmount()};
  }

  @Get()
  @UseGuards(AuthGuard())
  @ApiResponse(FindAllUserResponse)
  async findAll() {
    return {error: false, response: await this.usersService.findAll()};
  }

  @Get(':id', )
  @UseGuards(AuthGuard())
  @ApiResponse(FindOneByUserResponse)
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return {error: false, response: await this.usersService.findOneByUuid(id)};
  }

  @Patch(':id')
  @UseGuards(AuthGuard())
  @ApiResponse({status: 200, example: { error: false, response: 'User updated successfully' }})
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() updateUserDto: UpdateUserDto) {
    return {error: false, response: await this.usersService.update(id, updateUserDto)};
  }

}
