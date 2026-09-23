import { randomUUID } from 'node:crypto';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CheckoutDto,
  CreateAssinaturaDto,
  CreatePagamentoDto,
  CreatePlanoDto,
  UpdatePlanoDto,
} from './dto/platform.dto';

@Injectable()
export class NegocioService {
  constructor(private readonly prisma: PrismaService) {}

  criarPlano(dto: CreatePlanoDto) {
    return this.prisma.plano.create({ data: dto });
  }

  listarPlanos() {
    return this.prisma.plano.findMany({
      include: { _count: { select: { assinaturas: true } } },
      orderBy: { preco: 'asc' },
    });
  }

  async atualizarPlano(id: number, dto: UpdatePlanoDto) {
    await this.buscarPlano(id);
    return this.prisma.plano.update({ where: { idPlano: id }, data: dto });
  }

  async removerPlano(id: number) {
    await this.buscarPlano(id);
    return this.prisma.plano.delete({ where: { idPlano: id } });
  }

  async criarAssinatura(dto: CreateAssinaturaDto) {
    const plano = await this.buscarPlano(dto.idPlano);
    const dataInicio = dto.dataInicio ? new Date(dto.dataInicio) : new Date();
    return this.prisma.assinatura.create({
      data: {
        idUsuario: dto.idUsuario,
        idPlano: dto.idPlano,
        dataInicio,
        dataFim: this.adicionarMeses(dataInicio, plano.duracaoMeses),
      },
      include: { plano: true, usuario: { select: { nomeCompleto: true } } },
    });
  }

  listarAssinaturas(idUsuario?: number) {
    return this.prisma.assinatura.findMany({
      where: idUsuario ? { idUsuario } : undefined,
      include: {
        plano: true,
        usuario: {
          select: { idUsuario: true, nomeCompleto: true, email: true },
        },
        pagamentos: true,
      },
      orderBy: { dataInicio: 'desc' },
    });
  }

  async cancelarAssinatura(id: number) {
    const assinatura = await this.prisma.assinatura.findUnique({
      where: { idAssinatura: id },
    });
    if (!assinatura) throw new NotFoundException('Assinatura não encontrada');
    return this.prisma.assinatura.update({
      where: { idAssinatura: id },
      data: { dataFim: new Date() },
    });
  }

  criarPagamento(dto: CreatePagamentoDto) {
    return this.prisma.pagamento.create({
      data: {
        ...dto,
        idTransacaoGateway: dto.idTransacaoGateway ?? randomUUID(),
      },
      include: { assinatura: { include: { plano: true } } },
    });
  }

  listarPagamentos(idAssinatura?: number) {
    return this.prisma.pagamento.findMany({
      where: idAssinatura ? { idAssinatura } : undefined,
      include: {
        assinatura: {
          include: {
            plano: true,
            usuario: { select: { nomeCompleto: true, email: true } },
          },
        },
      },
      orderBy: { dataPagamento: 'desc' },
    });
  }

  async checkout(dto: CheckoutDto) {
    const plano = await this.buscarPlano(dto.idPlano);
    const dataInicio = new Date();
    return this.prisma.$transaction(async (tx) => {
      const assinatura = await tx.assinatura.create({
        data: {
          idUsuario: dto.idUsuario,
          idPlano: dto.idPlano,
          dataInicio,
          dataFim: this.adicionarMeses(dataInicio, plano.duracaoMeses),
        },
      });
      const pagamento = await tx.pagamento.create({
        data: {
          idAssinatura: assinatura.idAssinatura,
          valorPago: plano.preco,
          metodoPagamento: dto.metodoPagamento,
          idTransacaoGateway: randomUUID(),
        },
      });
      return { assinatura, pagamento };
    });
  }

  private async buscarPlano(id: number) {
    const plano = await this.prisma.plano.findUnique({
      where: { idPlano: id },
    });
    if (!plano) throw new NotFoundException('Plano não encontrado');
    return plano;
  }

  private adicionarMeses(data: Date, meses: number) {
    const fim = new Date(data);
    fim.setMonth(fim.getMonth() + meses);
    return fim;
  }
}
