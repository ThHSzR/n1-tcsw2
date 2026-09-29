import { api } from '../lib/api';
import { unsupported } from './helpers';

export interface Instrutor {
  id: number;
  nome: string;
  email: string;
  bio: string;
}

export const instrutorService = {
  getAll: (): Promise<Instrutor[]> =>
    api<Array<{ idUsuario: number; nomeCompleto: string; email: string }>>('/usuarios')
      .then(items => items.map(item => ({ id: item.idUsuario, nome: item.nomeCompleto, email: item.email, bio: 'Usuário habilitado como instrutor' }))),
  getById: (id: number): Promise<Instrutor> =>
    api<{ idUsuario: number; nomeCompleto: string; email: string }>(`/usuarios/${id}`)
      .then(item => ({ id: item.idUsuario, nome: item.nomeCompleto, email: item.email, bio: 'Usuário habilitado como instrutor' })),
  create: async (_data: Omit<Instrutor, 'id'>): Promise<Instrutor> => unsupported('Cadastro separado de instrutores'),
  update: async (_id: number, _data: Partial<Omit<Instrutor, 'id'>>): Promise<Instrutor> => unsupported('Edição separada de instrutores'),
  remove: async (_id: number): Promise<void> => unsupported('Exclusão separada de instrutores'),
};
