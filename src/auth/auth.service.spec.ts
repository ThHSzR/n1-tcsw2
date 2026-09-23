import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: { findByEmail: jest.Mock };

  beforeEach(async () => {
    usersService = { findByEmail: jest.fn() };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersService },
        {
          provide: JwtService,
          useValue: { signAsync: jest.fn().mockResolvedValue('token-jwt') },
        },
      ],
    }).compile();
    service = module.get(AuthService);
  });

  it('gera um token para credenciais válidas', async () => {
    usersService.findByEmail.mockResolvedValue({
      idUsuario: 1,
      email: 'teste@example.com',
      senhaHash: await bcrypt.hash('senha123', 4),
    });

    await expect(
      service.login({ email: 'teste@example.com', senha: 'senha123' }),
    ).resolves.toMatchObject({ accessToken: 'token-jwt', tokenType: 'Bearer' });
  });

  it('rejeita credenciais inválidas', async () => {
    usersService.findByEmail.mockResolvedValue(null);
    await expect(
      service.login({ email: 'teste@example.com', senha: 'senha123' }),
    ).rejects.toBeInstanceOf(UnauthorizedException);
  });
});
