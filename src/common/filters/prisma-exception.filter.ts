import {
  ArgumentsHost,
  Catch,
  ConflictException,
  ExceptionFilter,
  HttpException,
  NotFoundException,
} from '@nestjs/common';
import { Response } from 'express';
import { Prisma } from '../../generated/prisma/client';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();
    const erro = this.toHttpException(exception);
    response.status(erro.getStatus()).json(erro.getResponse());
  }

  private toHttpException(
    exception: Prisma.PrismaClientKnownRequestError,
  ): HttpException {
    switch (exception.code) {
      case 'P2002':
        return new ConflictException('Registro duplicado');
      case 'P2003':
        return new ConflictException(
          'Operação bloqueada por um relacionamento existente',
        );
      case 'P2025':
        return new NotFoundException('Registro não encontrado');
      default:
        return new ConflictException('Não foi possível concluir a operação');
    }
  }
}
