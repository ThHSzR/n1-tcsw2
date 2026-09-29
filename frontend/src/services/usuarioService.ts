import { api } from '../lib/api';
import { dateOnly } from './helpers';

export interface Usuario {
  id: number;
  nomeCompleto: string;
  email: string;
  senhaHash: string;
  dataCadastro: string;
}

export const usuarioService = {
  getAll: (): Promise<Usuario[]> =>
    api<Array<{ idUsuario: number; nomeCompleto: string; email: string; dataCadastro: string }>>('/usuarios')
      .then(items => items.map(item => ({ id: item.idUsuario, nomeCompleto: item.nomeCompleto, email: item.email, senhaHash: '', dataCadastro: dateOnly(item.dataCadastro) }))),
  getById: (id: number): Promise<Usuario> =>
    api<{ idUsuario: number; nomeCompleto: string; email: string; dataCadastro: string }>(`/usuarios/${id}`)
      .then(item => ({ id: item.idUsuario, nomeCompleto: item.nomeCompleto, email: item.email, senhaHash: '', dataCadastro: dateOnly(item.dataCadastro) })),
  create: (data: Omit<Usuario, 'id'>): Promise<Usuario> =>
    api<{ idUsuario: number; nomeCompleto: string; email: string; dataCadastro: string }>('/usuarios', { method: 'POST', body: JSON.stringify({ nomeCompleto: data.nomeCompleto, email: data.email, senha: data.senhaHash }) })
      .then(item => ({ id: item.idUsuario, nomeCompleto: item.nomeCompleto, email: item.email, senhaHash: '', dataCadastro: dateOnly(item.dataCadastro) })),
  update: (id: number, data: Partial<Omit<Usuario, 'id'>>): Promise<Usuario> =>
    api<{ idUsuario: number; nomeCompleto: string; email: string; dataCadastro: string }>(`/usuarios/${id}`, { method: 'PATCH', body: JSON.stringify({ ...(data.nomeCompleto !== undefined ? { nomeCompleto: data.nomeCompleto } : {}), ...(data.email !== undefined ? { email: data.email } : {}), ...(data.senhaHash ? { senha: data.senhaHash } : {}) }) })
      .then(item => ({ id: item.idUsuario, nomeCompleto: item.nomeCompleto, email: item.email, senhaHash: '', dataCadastro: dateOnly(item.dataCadastro) })),
  remove: (id: number): Promise<void> =>
    api(`/usuarios/${id}`, { method: 'DELETE' }).then(() => undefined),
};
