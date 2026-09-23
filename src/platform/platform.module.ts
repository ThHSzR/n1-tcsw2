import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import {
  AprendizagemController,
  CertificadosPublicController,
} from './aprendizagem.controller';
import { AprendizagemService } from './aprendizagem.service';
import { CatalogoController } from './catalogo.controller';
import { CatalogoService } from './catalogo.service';
import { NegocioController } from './negocio.controller';
import { NegocioService } from './negocio.service';

@Module({
  imports: [PrismaModule],
  controllers: [
    CatalogoController,
    AprendizagemController,
    CertificadosPublicController,
    NegocioController,
  ],
  providers: [CatalogoService, AprendizagemService, NegocioService],
})
export class PlatformModule {}
