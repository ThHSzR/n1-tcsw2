import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CatalogoService } from './catalogo.service';
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

@Controller()
@ApiTags('catálogo e conteúdo')
@ApiBearerAuth('token')
@UseGuards(AuthGuard('jwt'))
export class CatalogoController {
  constructor(private readonly service: CatalogoService) {}

  @Post('categorias')
  @ApiOperation({ summary: 'Criar categoria' })
  criarCategoria(@Body() dto: CreateCategoriaDto) {
    return this.service.criarCategoria(dto);
  }

  @Get('categorias')
  listarCategorias() {
    return this.service.listarCategorias();
  }

  @Get('categorias/:id')
  buscarCategoria(@Param('id', ParseIntPipe) id: number) {
    return this.service.buscarCategoria(id);
  }

  @Patch('categorias/:id')
  atualizarCategoria(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCategoriaDto,
  ) {
    return this.service.atualizarCategoria(id, dto);
  }

  @Delete('categorias/:id')
  removerCategoria(@Param('id', ParseIntPipe) id: number) {
    return this.service.removerCategoria(id);
  }

  @Post('cursos')
  criarCurso(@Body() dto: CreateCursoDto) {
    return this.service.criarCurso(dto);
  }

  @Get('cursos')
  listarCursos(@Query() query: ListCursosQueryDto) {
    return this.service.listarCursos(query);
  }

  @Get('cursos/:id')
  buscarCurso(@Param('id', ParseIntPipe) id: number) {
    return this.service.buscarCurso(id);
  }

  @Patch('cursos/:id')
  atualizarCurso(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCursoDto,
  ) {
    return this.service.atualizarCurso(id, dto);
  }

  @Delete('cursos/:id')
  removerCurso(@Param('id', ParseIntPipe) id: number) {
    return this.service.removerCurso(id);
  }

  @Post('modulos')
  criarModulo(@Body() dto: CreateModuloDto) {
    return this.service.criarModulo(dto);
  }

  @Get('modulos')
  listarModulos(@Query('idCurso') idCurso?: string) {
    return this.service.listarModulos(idCurso ? Number(idCurso) : undefined);
  }

  @Patch('modulos/:id')
  atualizarModulo(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateModuloDto,
  ) {
    return this.service.atualizarModulo(id, dto);
  }

  @Delete('modulos/:id')
  removerModulo(@Param('id', ParseIntPipe) id: number) {
    return this.service.removerModulo(id);
  }

  @Post('aulas')
  criarAula(@Body() dto: CreateAulaDto) {
    return this.service.criarAula(dto);
  }

  @Get('aulas')
  listarAulas(@Query('idModulo') idModulo?: string) {
    return this.service.listarAulas(idModulo ? Number(idModulo) : undefined);
  }

  @Patch('aulas/:id')
  atualizarAula(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateAulaDto,
  ) {
    return this.service.atualizarAula(id, dto);
  }

  @Delete('aulas/:id')
  removerAula(@Param('id', ParseIntPipe) id: number) {
    return this.service.removerAula(id);
  }

  @Post('trilhas')
  criarTrilha(@Body() dto: CreateTrilhaDto) {
    return this.service.criarTrilha(dto);
  }

  @Get('trilhas')
  listarTrilhas(@Query() query: PaginationQueryDto) {
    return this.service.listarTrilhas(query);
  }

  @Get('trilhas/:id')
  buscarTrilha(@Param('id', ParseIntPipe) id: number) {
    return this.service.buscarTrilha(id);
  }

  @Patch('trilhas/:id')
  atualizarTrilha(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTrilhaDto,
  ) {
    return this.service.atualizarTrilha(id, dto);
  }

  @Delete('trilhas/:id')
  removerTrilha(@Param('id', ParseIntPipe) id: number) {
    return this.service.removerTrilha(id);
  }

  @Post('trilhas/:id/cursos')
  vincularCurso(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: VincularCursoTrilhaDto,
  ) {
    return this.service.vincularCurso(id, dto);
  }

  @Delete('trilhas/:idTrilha/cursos/:idCurso')
  removerCursoDaTrilha(
    @Param('idTrilha', ParseIntPipe) idTrilha: number,
    @Param('idCurso', ParseIntPipe) idCurso: number,
  ) {
    return this.service.removerCursoDaTrilha(idTrilha, idCurso);
  }
}
