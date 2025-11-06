import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { LoansService } from './loans.service';
import { CreateLoanDto } from './dto/create-loan.dto';
import { UpdateLoanDto } from './dto/update-loan.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/decorators';
import { User } from 'src/users/entities/user.entity';

@Controller('loans')
export class LoansController {
  constructor(private readonly loansService: LoansService) {}

  @Post()
  @UseGuards(AuthGuard())
  create(@Body() createLoanDto: CreateLoanDto, @GetUser() user: User) {
    return this.loansService.create(createLoanDto, user);
  }

  @Get('loans-by-user/:id')
  @UseGuards(AuthGuard())
  findAllByUser(@Param('id', ParseUUIDPipe) id: string) {
    return this.loansService.findAllByUser(id);
  }

  @Get('amount-loans-by-user/:id')
  @UseGuards(AuthGuard())
  findAmountByUser(@Param('id', ParseUUIDPipe) id: string) {
    return this.loansService.findAmountByUser(id);
  }

  @Get()
  @UseGuards(AuthGuard())
  findAll() {
    return this.loansService.findAll();
  }

  @Get(':id')
  @UseGuards(AuthGuard())
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.loansService.findOneById(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard())
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updateLoanDto: UpdateLoanDto) {
    return this.loansService.update(id, updateLoanDto);
  }

}
