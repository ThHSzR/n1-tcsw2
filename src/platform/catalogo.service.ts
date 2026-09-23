import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateAulaDto,
  CreateCategoriaDto,
  CreateCursoDto,
  CreateModuloDto,
  CreateTrilhaDto,
  ListCursosQueryDto,
  PaginationQueryDto,
  UpdateAulaDto,
  UpdateCategoriaDto,
  UpdateCursoDto,
  UpdateModuloDto,
  UpdateTrilhaDto,
  VincularCursoTrilhaDto,
} from './dto/platform.dto';

@Injectable()
export class CatalogoService {
  constructor(private readonly prisma: PrismaService) {}

  criarCategoria(dto: CreateCategoriaDto) {
    return this.prisma.categoria.create({ data: dto });
  }

  listarCategorias() {
    return this.prisma.categoria.findMany({
      include: { _count: { select: { cursos: true, trilhas: true } } },
      orderBy: { nome: 'asc' },
    });
  }

  async buscarCategoria(id: number) {
    const categoria = await this.prisma.categoria.findUnique({
      where: { idCategoria: id },
      include: { cursos: true, trilhas: true },
    });
    if (!categoria) throw new NotFoundException('Categoria não encontrada');
    return categoria;
  }

  async atualizarCategoria(id: number, dto: UpdateCategoriaDto) {
    await this.buscarCategoria(id);
    return this.prisma.categoria.update({
      where: { idCategoria: id },
      data: dto,
    });
  }

  async removerCategoria(id: number) {
    await this.buscarCategoria(id);
    return this.prisma.categoria.delete({ where: { idCategoria: id } });
  }

  criarCurso(dto: CreateCursoDto) {
    return this.prisma.curso.create({
      data: {
        ...dto,
        dataPublicacao: dto.dataPublicacao
          ? new Date(dto.dataPublicacao)
          : undefined,
      },
      include: {
        categoria: true,
        instrutor: {
          select: { idUsuario: true, nomeCompleto: true, email: true },
        },
      },
    });
  }

  async listarCursos(query: ListCursosQueryDto) {
    const where = {
      ...(query.idCategoria ? { idCategoria: query.idCategoria } : {}),
      ...(query.idInstrutor ? { idInstrutor: query.idInstrutor } : {}),
      ...(query.nivel ? { nivel: query.nivel } : {}),
      ...(query.busca
        ? {
            OR: [
              {
                titulo: { contains: query.busca, mode: 'insensitive' as const },
              },
              {
                descricao: {
                  contains: query.busca,
                  mode: 'insensitive' as const,
                },
              },
            ],
          }
        : {}),
    };
    const skip = (query.pagina - 1) * query.limite;
    const [dados, total] = await this.prisma.$transaction([
      this.prisma.curso.findMany({
        where,
        skip,
        take: query.limite,
        include: {
          categoria: true,
          instrutor: {
            select: { idUsuario: true, nomeCompleto: true, email: true },
          },
          _count: { select: { modulos: true, matriculas: true } },
        },
        orderBy: { titulo: 'asc' },
      }),
      this.prisma.curso.count({ where }),
    ]);
    return { dados, total, pagina: query.pagina, limite: query.limite };
  }

  async buscarCurso(id: number) {
    const curso = await this.prisma.curso.findUnique({
      where: { idCurso: id },
      include: {
        categoria: true,
        instrutor: {
          select: { idUsuario: true, nomeCompleto: true, email: true },
        },
        modulos: {
          include: { aulas: { orderBy: { ordem: 'asc' } } },
          orderBy: { ordem: 'asc' },
        },
      },
    });
    if (!curso) throw new NotFoundException('Curso não encontrado');
    return curso;
  }

  async atualizarCurso(id: number, dto: UpdateCursoDto) {
    await this.buscarCurso(id);
    return this.prisma.curso.update({
      where: { idCurso: id },
      data: {
        ...dto,
        dataPublicacao: dto.dataPublicacao
          ? new Date(dto.dataPublicacao)
          : undefined,
      },
      include: {
        categoria: true,
        instrutor: {
          select: { idUsuario: true, nomeCompleto: true, email: true },
        },
      },
    });
  }

  async removerCurso(id: number) {
    await this.buscarCurso(id);
    return this.prisma.curso.delete({ where: { idCurso: id } });
  }

  async criarModulo(dto: CreateModuloDto) {
    await this.buscarCurso(dto.idCurso);
    return this.prisma.modulo.create({ data: dto });
  }

  listarModulos(idCurso?: number) {
    return this.prisma.modulo.findMany({
      where: idCurso ? { idCurso } : undefined,
      include: { aulas: { orderBy: { ordem: 'asc' } } },
      orderBy: [{ idCurso: 'asc' }, { ordem: 'asc' }],
    });
  }

  async atualizarModulo(id: number, dto: UpdateModuloDto) {
    const existente = await this.prisma.modulo.findUnique({
      where: { idModulo: id },
    });
    if (!existente) throw new NotFoundException('Módulo não encontrado');
    return this.prisma.modulo.update({
      where: { idModulo: id },
      data: dto,
    });
  }

  async removerModulo(id: number) {
    const existente = await this.prisma.modulo.findUnique({
      where: { idModulo: id },
    });
    if (!existente) throw new NotFoundException('Módulo não encontrado');
    const removido = await this.prisma.modulo.delete({
      where: { idModulo: id },
    });
    await this.recalcularCurso(existente.idCurso);
    return removido;
  }

  async criarAula(dto: CreateAulaDto) {
    const modulo = await this.prisma.modulo.findUnique({
      where: { idModulo: dto.idModulo },
    });
    if (!modulo) throw new NotFoundException('Módulo não encontrado');
    const aula = await this.prisma.aula.create({ data: dto });
    await this.recalcularCurso(modulo.idCurso);
    return aula;
  }

  listarAulas(idModulo?: number) {
    return this.prisma.aula.findMany({
      where: idModulo ? { idModulo } : undefined,
      include: { modulo: { select: { idCurso: true, titulo: true } } },
      orderBy: [{ idModulo: 'asc' }, { ordem: 'asc' }],
    });
  }

  async atualizarAula(id: number, dto: UpdateAulaDto) {
    const existente = await this.prisma.aula.findUnique({
      where: { idAula: id },
      include: { modulo: true },
    });
    if (!existente) throw new NotFoundException('Aula não encontrada');
    const aula = await this.prisma.aula.update({
      where: { idAula: id },
      data: dto,
    });
    await this.recalcularCurso(existente.modulo.idCurso);
    if (dto.idModulo && dto.idModulo !== existente.idModulo) {
      const novoModulo = await this.prisma.modulo.findUnique({
        where: { idModulo: dto.idModulo },
      });
      if (novoModulo) await this.recalcularCurso(novoModulo.idCurso);
    }
    return aula;
  }

  async removerAula(id: number) {
    const existente = await this.prisma.aula.findUnique({
      where: { idAula: id },
      include: { modulo: true },
    });
    if (!existente) throw new NotFoundException('Aula não encontrada');
    const removida = await this.prisma.aula.delete({ where: { idAula: id } });
    await this.recalcularCurso(existente.modulo.idCurso);
    return removida;
  }

  criarTrilha(dto: CreateTrilhaDto) {
    return this.prisma.trilha.create({ data: dto });
  }

  listarTrilhas(query: PaginationQueryDto) {
    return this.prisma.trilha.findMany({
      where: query.busca
        ? { titulo: { contains: query.busca, mode: 'insensitive' } }
        : undefined,
      skip: (query.pagina - 1) * query.limite,
      take: query.limite,
      include: {
        categoria: true,
        cursos: {
          include: { curso: true },
          orderBy: { ordem: 'asc' },
        },
      },
      orderBy: { titulo: 'asc' },
    });
  }

  async atualizarTrilha(id: number, dto: UpdateTrilhaDto) {
    await this.buscarTrilha(id);
    return this.prisma.trilha.update({ where: { idTrilha: id }, data: dto });
  }

  async buscarTrilha(id: number) {
    const trilha = await this.prisma.trilha.findUnique({
      where: { idTrilha: id },
      include: {
        categoria: true,
        cursos: { include: { curso: true }, orderBy: { ordem: 'asc' } },
      },
    });
    if (!trilha) throw new NotFoundException('Trilha não encontrada');
    return trilha;
  }

  async removerTrilha(id: number) {
    await this.buscarTrilha(id);
    return this.prisma.trilha.delete({ where: { idTrilha: id } });
  }

  async vincularCurso(idTrilha: number, dto: VincularCursoTrilhaDto) {
    await this.buscarTrilha(idTrilha);
    await this.buscarCurso(dto.idCurso);
    return this.prisma.trilhaCurso.create({
      data: { idTrilha, idCurso: dto.idCurso, ordem: dto.ordem },
      include: { curso: true },
    });
  }

  removerCursoDaTrilha(idTrilha: number, idCurso: number) {
    return this.prisma.trilhaCurso.delete({
      where: { idTrilha_idCurso: { idTrilha, idCurso } },
    });
  }

  private async recalcularCurso(idCurso: number) {
    const aulas = await this.prisma.aula.aggregate({
      where: { modulo: { idCurso } },
      _count: { idAula: true },
      _sum: { duracaoMinutos: true },
    });
    return this.prisma.curso.update({
      where: { idCurso },
      data: {
        totalAulas: aulas._count.idAula,
        totalHoras: (aulas._sum.duracaoMinutos ?? 0) / 60,
      },
    });
  }
}
