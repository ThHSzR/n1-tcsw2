import { api } from '../lib/api';

export interface Categoria {
  id?: number;
  nome: string;
  descricao: string;
}

export const categoriaService = {
  getAll: (): Promise<Categoria[]> =>
    api<Array<{ idCategoria: number; nome: string; descricao: string | null }>>('/categorias')
      .then(items => items.map(item => ({ id: item.idCategoria, nome: item.nome, descricao: item.descricao ?? '' }))),
  create: (data: Omit<Categoria, 'id'>): Promise<Categoria> =>
    api<{ idCategoria: number; nome: string; descricao: string | null }>('/categorias', { method: 'POST', body: JSON.stringify(data) })
      .then(item => ({ id: item.idCategoria, nome: item.nome, descricao: item.descricao ?? '' })),
  update: (id: number, data: Partial<Categoria>): Promise<Categoria> =>
    api<{ idCategoria: number; nome: string; descricao: string | null }>(`/categorias/${id}`, { method: 'PATCH', body: JSON.stringify(data) })
      .then(item => ({ id: item.idCategoria, nome: item.nome, descricao: item.descricao ?? '' })),
  remove: (id: number): Promise<void> =>
    api(`/categorias/${id}`, { method: 'DELETE' }).then(() => undefined),
};
