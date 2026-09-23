import { Type } from 'class-transformer';
import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  IsUrl,
  Max,
  Min,
} from 'class-validator';
import { PartialType } from '@nestjs/swagger';
import {
  MetodoPagamento,
  NivelCurso,
  StatusAula,
  TipoConteudo,
} from '../../generated/prisma/enums';

export class PaginationQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  pagina = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limite = 20;

  @IsOptional()
  @IsString()
  busca?: string;
}

export class ListCursosQueryDto extends PaginationQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  idCategoria?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  idInstrutor?: number;

  @IsOptional()
  @IsEnum(NivelCurso)
  nivel?: NivelCurso;
}

export class CreateCategoriaDto {
  @IsString()
  @IsNotEmpty()
  nome: string;

  @IsOptional()
  @IsString()
  descricao?: string;
}

export class UpdateCategoriaDto extends PartialType(CreateCategoriaDto) {}

export class CreateCursoDto {
  @IsString()
  @IsNotEmpty()
  titulo: string;

  @IsOptional()
  @IsString()
  descricao?: string;

  @IsInt()
  @IsPositive()
  idInstrutor: number;

  @IsInt()
  @IsPositive()
  idCategoria: number;

  @IsEnum(NivelCurso)
  nivel: NivelCurso;

  @IsOptional()
  @IsDateString()
  dataPublicacao?: string;
}

export class UpdateCursoDto extends PartialType(CreateCursoDto) {}

export class CreateModuloDto {
  @IsInt()
  @IsPositive()
  idCurso: number;

  @IsString()
  @IsNotEmpty()
  titulo: string;

  @IsInt()
  @Min(1)
  ordem: number;
}

export class UpdateModuloDto extends PartialType(CreateModuloDto) {}

export class CreateAulaDto {
  @IsInt()
  @IsPositive()
  idModulo: number;

  @IsString()
  @IsNotEmpty()
  titulo: string;

  @IsEnum(TipoConteudo)
  tipoConteudo: TipoConteudo;

  @IsOptional()
  @IsUrl()
  urlConteudo?: string;

  @IsInt()
  @Min(0)
  duracaoMinutos: number;

  @IsInt()
  @Min(1)
  ordem: number;
}

export class UpdateAulaDto extends PartialType(CreateAulaDto) {}

export class CreateMatriculaDto {
  @IsInt()
  @IsPositive()
  idUsuario: number;

  @IsInt()
  @IsPositive()
  idCurso: number;
}

export class UpdateMatriculaDto {
  @IsOptional()
  @IsDateString()
  dataConclusao?: string;
}

export class UpsertProgressoDto {
  @IsInt()
  @IsPositive()
  idUsuario: number;

  @IsInt()
  @IsPositive()
  idAula: number;

  @IsEnum(StatusAula)
  status: StatusAula;
}

export class CreateAvaliacaoDto {
  @IsInt()
  @IsPositive()
  idUsuario: number;

  @IsInt()
  @IsPositive()
  idCurso: number;

  @IsInt()
  @Min(1)
  @Max(5)
  nota: number;

  @IsOptional()
  @IsString()
  comentario?: string;
}

export class UpdateAvaliacaoDto extends PartialType(CreateAvaliacaoDto) {}

export class CreateTrilhaDto {
  @IsString()
  @IsNotEmpty()
  titulo: string;

  @IsOptional()
  @IsString()
  descricao?: string;

  @IsInt()
  @IsPositive()
  idCategoria: number;
}

export class UpdateTrilhaDto extends PartialType(CreateTrilhaDto) {}

export class VincularCursoTrilhaDto {
  @IsInt()
  @IsPositive()
  idCurso: number;

  @IsInt()
  @Min(1)
  ordem: number;
}

export class CreateCertificadoDto {
  @IsInt()
  @IsPositive()
  idUsuario: number;

  @IsInt()
  @IsPositive()
  idCurso: number;

  @IsOptional()
  @IsInt()
  @IsPositive()
  idTrilha?: number;
}

export class CreatePlanoDto {
  @IsString()
  @IsNotEmpty()
  nome: string;

  @IsOptional()
  @IsString()
  descricao?: string;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  preco: number;

  @IsInt()
  @IsPositive()
  duracaoMeses: number;
}

export class UpdatePlanoDto extends PartialType(CreatePlanoDto) {}

export class CreateAssinaturaDto {
  @IsInt()
  @IsPositive()
  idUsuario: number;

  @IsInt()
  @IsPositive()
  idPlano: number;

  @IsOptional()
  @IsDateString()
  dataInicio?: string;
}

export class CreatePagamentoDto {
  @IsInt()
  @IsPositive()
  idAssinatura: number;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  valorPago: number;

  @IsEnum(MetodoPagamento)
  metodoPagamento: MetodoPagamento;

  @IsOptional()
  @IsString()
  idTransacaoGateway?: string;
}

export class CheckoutDto {
  @IsInt()
  @IsPositive()
  idUsuario: number;

  @IsInt()
  @IsPositive()
  idPlano: number;

  @IsEnum(MetodoPagamento)
  metodoPagamento: MetodoPagamento;
}

export class FindByEmailDto {
  @IsEmail()
  email: string;
}
