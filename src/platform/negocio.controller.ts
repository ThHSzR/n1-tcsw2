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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  CheckoutDto,
  CreateAssinaturaDto,
  CreatePagamentoDto,
  CreatePlanoDto,
  UpdatePlanoDto,
} from './dto/platform.dto';
import { NegocioService } from './negocio.service';

@Controller()
@ApiTags('planos e pagamentos')
@ApiBearerAuth('token')
@UseGuards(AuthGuard('jwt'))
export class NegocioController {
  constructor(private readonly service: NegocioService) {}

  @Post('planos')
  criarPlano(@Body() dto: CreatePlanoDto) {
    return this.service.criarPlano(dto);
  }

  @Get('planos')
  listarPlanos() {
    return this.service.listarPlanos();
  }

  @Patch('planos/:id')
  atualizarPlano(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePlanoDto,
  ) {
    return this.service.atualizarPlano(id, dto);
  }

  @Delete('planos/:id')
  removerPlano(@Param('id', ParseIntPipe) id: number) {
    return this.service.removerPlano(id);
  }

  @Post('assinaturas')
  criarAssinatura(@Body() dto: CreateAssinaturaDto) {
    return this.service.criarAssinatura(dto);
  }

  @Get('assinaturas')
  listarAssinaturas(@Query('idUsuario') usuario?: string) {
    return this.service.listarAssinaturas(
      usuario ? Number(usuario) : undefined,
    );
  }

  @Patch('assinaturas/:id/cancelar')
  cancelarAssinatura(@Param('id', ParseIntPipe) id: number) {
    return this.service.cancelarAssinatura(id);
  }

  @Post('pagamentos')
  criarPagamento(@Body() dto: CreatePagamentoDto) {
    return this.service.criarPagamento(dto);
  }

  @Get('pagamentos')
  listarPagamentos(@Query('idAssinatura') assinatura?: string) {
    return this.service.listarPagamentos(
      assinatura ? Number(assinatura) : undefined,
    );
  }

  @Post('checkout')
  checkout(@Body() dto: CheckoutDto) {
    return this.service.checkout(dto);
  }
}
