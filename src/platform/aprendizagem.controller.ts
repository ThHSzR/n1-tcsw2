import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AprendizagemService } from './aprendizagem.service';
import {
  CreateAvaliacaoDto,
  CreateCertificadoDto,
  CreateMatriculaDto,
  UpdateAvaliacaoDto,
  UpdateMatriculaDto,
  UpsertProgressoDto,
} from './dto/platform.dto';

@Controller()
@ApiTags('aprendizagem e progresso')
@ApiBearerAuth('token')
@UseGuards(AuthGuard('jwt'))
export class AprendizagemController {
  constructor(private readonly service: AprendizagemService) {}

  @Post('matriculas')
  criarMatricula(@Body() dto: CreateMatriculaDto) {
    return this.service.criarMatricula(dto);
  }

  @Get('matriculas')
  listarMatriculas(
    @Query('idUsuario') usuario?: string,
    @Query('idCurso') curso?: string,
  ) {
    return this.service.listarMatriculas(
      usuario ? Number(usuario) : undefined,
      curso ? Number(curso) : undefined,
    );
  }

  @Patch('matriculas/:id')
  atualizarMatricula(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateMatriculaDto,
  ) {
    return this.service.atualizarMatricula(id, dto);
  }

  @Delete('matriculas/:id')
  cancelarMatricula(@Param('id', ParseIntPipe) id: number) {
    return this.service.cancelarMatricula(id);
  }

  @Put('progresso')
  registrarProgresso(@Body() dto: UpsertProgressoDto) {
    return this.service.registrarProgresso(dto);
  }

  @Get('progresso/:idUsuario')
  listarProgresso(
    @Param('idUsuario', ParseIntPipe) idUsuario: number,
    @Query('idCurso') curso?: string,
  ) {
    return this.service.listarProgresso(
      idUsuario,
      curso ? Number(curso) : undefined,
    );
  }

  @Post('avaliacoes')
  criarAvaliacao(@Body() dto: CreateAvaliacaoDto) {
    return this.service.criarAvaliacao(dto);
  }

  @Get('avaliacoes')
  listarAvaliacoes(@Query('idCurso') curso?: string) {
    return this.service.listarAvaliacoes(curso ? Number(curso) : undefined);
  }

  @Patch('avaliacoes/:id')
  atualizarAvaliacao(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateAvaliacaoDto,
  ) {
    return this.service.atualizarAvaliacao(id, dto);
  }

  @Delete('avaliacoes/:id')
  removerAvaliacao(@Param('id', ParseIntPipe) id: number) {
    return this.service.removerAvaliacao(id);
  }

  @Post('certificados')
  emitirCertificado(@Body() dto: CreateCertificadoDto) {
    return this.service.emitirCertificado(dto);
  }

  @Get('certificados')
  listarCertificados(@Query('idUsuario') usuario?: string) {
    return this.service.listarCertificados(
      usuario ? Number(usuario) : undefined,
    );
  }
}

@Controller('certificados')
@ApiTags('certificados')
export class CertificadosPublicController {
  constructor(private readonly service: AprendizagemService) {}

  @Get('verificar/:codigo')
  verificar(@Param('codigo') codigo: string) {
    return this.service.verificarCertificado(codigo);
  }
}
