import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { AuthService } from 'src/auth/auth.service';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {}

  async create(createUserDto: CreateUserDto, userOrigin: User): Promise<User> {
    const user = this.userRepository.create({
      ...createUserDto,
      userCreated: userOrigin.iduser,
      password: bcrypt.hashSync(createUserDto.password, +this.configService.get('SALT')),
    });

    return await this.userRepository.save(user);
  }

  findAll(): Promise<User[]> {
    return this.userRepository.find({
      where: { status: true }
    });
  }

  private adminFindAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOneByUuid(iduser: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { iduser, status: true}
    });

    if (!user)
      throw new NotFoundException(`User with id ${iduser} not found`);

    return user;
  }

  async findOneByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { email, status: true }
    });

    if (!user)
      throw new NotFoundException(`User with email ${email} not found`);

    return user;
  }

  private async adminFindOneByUuid(iduser: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { iduser }
    });

    if (!user)
      throw new NotFoundException(`User with id ${iduser} not found`);

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<string> {
    const user = await this.adminFindOneByUuid(id);

    const updatedUser = this.userRepository.create({
      ...user,
      ...updateUserDto
    });

    await this.userRepository.save(updatedUser);

    return 'User updated successfully';
  }

  async findLoansAmount() {
    const users = await this.userRepository.find({
      where: { status: true, loans: { status: true }},
      relations: {
        loans: true
      }
    });
    
    return users.map(user => ({
      name: user.name,
      loansAmount: user.loans.length
    })).filter(i => i.loansAmount > 0);

  }

}
