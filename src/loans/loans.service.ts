import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateLoanDto } from './dto/create-loan.dto';
import { UpdateLoanDto } from './dto/update-loan.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Loan } from './entities/loan.entity';
import { Repository } from 'typeorm';
import { UsersService } from 'src/users/users.service';
import { ClientsService } from 'src/clients/clients.service';
import { User } from 'src/users/entities/user.entity';
import { Client } from 'src/clients/entities/client.entity';

@Injectable()
export class LoansService {
  constructor(
    @InjectRepository(Loan)
    private readonly loanRepository: Repository<Loan>,
    private readonly userService: UsersService,
    private readonly clientService: ClientsService,
  ) {}

  async create(createLoanDto: CreateLoanDto, userOrigin: User): Promise<Loan> {
    const { lender, client, ...resLoan } = createLoanDto;

    const [clientFound, lenderFound] = await Promise.all([
      this.clientService.findOneById(client),
      this.userService.findOneByUuid(lender)
    ]);

    const loan = this.loanRepository.create({
      ...resLoan,
      lender: lenderFound,
      client: clientFound,
      userCreated: userOrigin.iduser
    });

    return await this.loanRepository.save(loan);
  }

  findAll(): Promise<Loan[]> {
    return this.loanRepository.find({
      where: {status: true}
    });
  }

  adminFindAll(): Promise<Loan[]> {
    return this.loanRepository.find();
  }

  async findOneById(idloan: string): Promise<Loan> {
    const loan = await this.loanRepository.findOne({
      where: { status: true, idloan },
      relations: {
        client: true,
        lender: true,
        contract: true,
        payments: true
      }
    });

    if (!loan)
      throw new NotFoundException(`Loan with id ${idloan} not found`);

    return loan;
  }

  private async adminFindOneById(idloan: string): Promise<Loan> {
    const loan = await this.loanRepository.findOne({
      where: { idloan }
    });

    if (!loan)
      throw new NotFoundException(`Loan with id ${idloan} not found`);

    return loan;
  }

  async update(id: string, updateLoanDto: UpdateLoanDto): Promise<string> {
    const loan = await this.adminFindOneById(id);

    const [clientFound, lenderFound]: [Client, User] = await Promise.all([
      (updateLoanDto?.client && (updateLoanDto?.client != loan.client.idclient)) 
        ? this.clientService.findOneById(updateLoanDto.client)
        : loan.client,
      (updateLoanDto?.lender && (updateLoanDto?.lender != loan.lender.iduser)) 
        ? this.userService.findOneByUuid(updateLoanDto.lender)
        : loan.lender
    ]);

    const updatedLoan = this.loanRepository.create({
      ...loan,
      ...updateLoanDto,
      client: clientFound,
      lender: lenderFound
    });

    await this.loanRepository.save(updatedLoan);

    return 'Loan updated';
  }

  findAllByUser(id: string): Promise<Loan[]> {
    return this.loanRepository.find({
      where: { status: true, lender: { iduser: id}}
    })
  }

  findAmountByUser(id: string): Promise<number> {
    return this.loanRepository.count({
      where: { status: true, lender: { iduser: id}}
    })
  }

}
