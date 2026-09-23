import { randomUUID } from 'node:crypto';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { StatusAula } from '../generated/prisma/enums';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateAvaliacaoDto,
  CreateCertificadoDto,
  CreateMatriculaDto,
  UpdateAvaliacaoDto,
  UpdateMatriculaDto,
  UpsertProgressoDto,
} from './dto/platform.dto';

@Injectable()
export class AprendizagemService {
  constructor(private readonly prisma: PrismaService) {}

  criarMatricula(dto: CreateMatriculaDto) {
    return this.prisma.matricula.create({
      data: dto,
      include: {
        usuario: {
          select: { idUsuario: true, nomeCompleto: true, email: true },
        },
        curso: true,
      },
    });
  }

  listarMatriculas(idUsuario?: number, idCurso?: number) {
    return this.prisma.matricula.findMany({
      where: {
        ...(idUsuario ? { idUsuario } : {}),
        ...(idCurso ? { idCurso } : {}),
      },
      include: {
        usuario: {
          select: { idUsuario: true, nomeCompleto: true, email: true },
        },
        curso: true,
      },
      orderBy: { dataMatricula: 'desc' },
    });
  }

  async atualizarMatricula(id: number, dto: UpdateMatriculaDto) {
    const matricula = await this.prisma.matricula.findUnique({
      where: { idMatricula: id },
    });
    if (!matricula) throw new NotFoundException('Matrícula não encontrada');
    return this.prisma.matricula.update({
      where: { idMatricula: id },
      data: {
        dataConclusao: dto.dataConclusao
          ? new Date(dto.dataConclusao)
          : undefined,
      },
    });
  }

  async cancelarMatricula(id: number) {
    const matricula = await this.prisma.matricula.findUnique({
      where: { idMatricula: id },
    });
    if (!matricula) throw new NotFoundException('Matrícula não encontrada');
    return this.prisma.matricula.delete({ where: { idMatricula: id } });
  }

  async registrarProgresso(dto: UpsertProgressoDto) {
    const progresso = await this.prisma.progressoAula.upsert({
      where: {
        idUsuario_idAula: {
          idUsuario: dto.idUsuario,
          idAula: dto.idAula,
        },
      },
      create: {
        ...dto,
        dataConclusao:
          dto.status === StatusAula.CONCLUIDO ? new Date() : undefined,
      },
      update: {
        status: dto.status,
        dataConclusao: dto.status === StatusAula.CONCLUIDO ? new Date() : null,
      },
      include: { aula: { include: { modulo: true } } },
    });

    await this.concluirMatriculaSeNecessario(
      dto.idUsuario,
      progresso.aula.modulo.idCurso,
    );
    return progresso;
  }

  listarProgresso(idUsuario: number, idCurso?: number) {
    return this.prisma.progressoAula.findMany({
      where: {
        idUsuario,
        ...(idCurso ? { aula: { modulo: { idCurso } } } : {}),
      },
      include: { aula: { include: { modulo: true } } },
      orderBy: { idAula: 'asc' },
    });
  }

  criarAvaliacao(dto: CreateAvaliacaoDto) {
    return this.prisma.avaliacao.create({
      data: dto,
      include: {
        usuario: { select: { idUsuario: true, nomeCompleto: true } },
        curso: { select: { idCurso: true, titulo: true } },
      },
    });
  }

  listarAvaliacoes(idCurso?: number) {
    return this.prisma.avaliacao.findMany({
      where: idCurso ? { idCurso } : undefined,
      include: {
        usuario: { select: { idUsuario: true, nomeCompleto: true } },
        curso: { select: { idCurso: true, titulo: true } },
      },
      orderBy: { dataAvaliacao: 'desc' },
    });
  }

  atualizarAvaliacao(id: number, dto: UpdateAvaliacaoDto) {
    return this.prisma.avaliacao.update({
      where: { idAvaliacao: id },
      data: dto,
    });
  }

  removerAvaliacao(id: number) {
    return this.prisma.avaliacao.delete({ where: { idAvaliacao: id } });
  }

  async emitirCertificado(dto: CreateCertificadoDto) {
    const matriculaConcluida = await this.prisma.matricula.findFirst({
      where: {
        idUsuario: dto.idUsuario,
        idCurso: dto.idCurso,
        dataConclusao: { not: null },
      },
    });
    if (!matriculaConcluida) {
      throw new BadRequestException(
        'O curso deve estar concluído antes da emissão do certificado',
      );
    }
    return this.prisma.certificado.create({
      data: { ...dto, codigoVerificacao: randomUUID() },
      include: {
        usuario: { select: { nomeCompleto: true, email: true } },
        curso: { select: { titulo: true } },
        trilha: { select: { titulo: true } },
      },
    });
  }

  listarCertificados(idUsuario?: number) {
    return this.prisma.certificado.findMany({
      where: idUsuario ? { idUsuario } : undefined,
      include: {
        usuario: { select: { nomeCompleto: true, email: true } },
        curso: { select: { titulo: true } },
        trilha: { select: { titulo: true } },
      },
      orderBy: { dataEmissao: 'desc' },
    });
  }

  async verificarCertificado(codigo: string) {
    const certificado = await this.prisma.certificado.findUnique({
      where: { codigoVerificacao: codigo },
      include: {
        usuario: { select: { nomeCompleto: true } },
        curso: { select: { titulo: true } },
        trilha: { select: { titulo: true } },
      },
    });
    if (!certificado) {
      throw new NotFoundException('Certificado não encontrado');
    }
    return { valido: true, certificado };
  }

  private async concluirMatriculaSeNecessario(
    idUsuario: number,
    idCurso: number,
  ) {
    const totalAulas = await this.prisma.aula.count({
      where: { modulo: { idCurso } },
    });
    if (totalAulas === 0) return;

    const concluidas = await this.prisma.progressoAula.count({
      where: {
        idUsuario,
        status: StatusAula.CONCLUIDO,
        aula: { modulo: { idCurso } },
      },
    });
    if (concluidas !== totalAulas) return;

    await this.prisma.matricula.updateMany({
      where: { idUsuario, idCurso, dataConclusao: null },
      data: { dataConclusao: new Date() },
    });
  }
}
