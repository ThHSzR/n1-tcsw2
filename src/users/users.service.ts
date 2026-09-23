import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

const usuarioPublico = {
  idUsuario: true,
  nomeCompleto: true,
  email: true,
  dataCadastro: true,
} as const;

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const existente = await this.findByEmail(createUserDto.email);
    if (existente) {
      throw new ConflictException('E-mail já cadastrado');
    }

    const senhaHash = await bcrypt.hash(createUserDto.senha, 12);
    return this.prisma.usuario.create({
      data: {
        nomeCompleto: createUserDto.nomeCompleto,
        email: createUserDto.email,
        senhaHash,
      },
      select: usuarioPublico,
    });
  }

  findAll() {
    return this.prisma.usuario.findMany({
      select: usuarioPublico,
      orderBy: { nomeCompleto: 'asc' },
    });
  }

  async findOne(id: number) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { idUsuario: id },
      select: usuarioPublico,
    });
    if (!usuario) throw new NotFoundException('Usuário não encontrado');
    return usuario;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    await this.findOne(id);
    const { senha, ...dados } = updateUserDto;
    return this.prisma.usuario.update({
      where: { idUsuario: id },
      data: {
        ...dados,
        ...(senha ? { senhaHash: await bcrypt.hash(senha, 12) } : {}),
      },
      select: usuarioPublico,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.usuario.delete({
      where: { idUsuario: id },
      select: usuarioPublico,
    });
  }

  findByEmail(email: string) {
    return this.prisma.usuario.findUnique({ where: { email } });
  }
}
