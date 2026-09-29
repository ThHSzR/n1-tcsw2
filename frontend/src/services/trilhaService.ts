import { api } from '../lib/api';

export interface Trilha {
  id: number;
  titulo: string;
  descricao: string;
  categoriaId: number;
}

export const trilhaService = {
  getAll: (): Promise<Trilha[]> =>
    api<Array<{ idTrilha: number; titulo: string; descricao: string | null; idCategoria: number }>>('/trilhas?limite=100')
      .then(items => items.map(item => ({ id: item.idTrilha, titulo: item.titulo, descricao: item.descricao ?? '', categoriaId: item.idCategoria }))),
  getById: (id: number): Promise<Trilha> =>
    api<{ idTrilha: number; titulo: string; descricao: string | null; idCategoria: number }>(`/trilhas/${id}`)
      .then(item => ({ id: item.idTrilha, titulo: item.titulo, descricao: item.descricao ?? '', categoriaId: item.idCategoria })),
  create: (data: Omit<Trilha, 'id'>): Promise<Trilha> =>
    api<{ idTrilha: number; titulo: string; descricao: string | null; idCategoria: number }>('/trilhas', { method: 'POST', body: JSON.stringify({ titulo: data.titulo, descricao: data.descricao, idCategoria: data.categoriaId }) })
      .then(item => ({ id: item.idTrilha, titulo: item.titulo, descricao: item.descricao ?? '', categoriaId: item.idCategoria })),
  update: (id: number, data: Partial<Omit<Trilha, 'id'>>): Promise<Trilha> =>
    api<{ idTrilha: number; titulo: string; descricao: string | null; idCategoria: number }>(`/trilhas/${id}`, { method: 'PATCH', body: JSON.stringify({ ...(data.titulo !== undefined ? { titulo: data.titulo } : {}), ...(data.descricao !== undefined ? { descricao: data.descricao } : {}), ...(data.categoriaId !== undefined ? { idCategoria: data.categoriaId } : {}) }) })
      .then(item => ({ id: item.idTrilha, titulo: item.titulo, descricao: item.descricao ?? '', categoriaId: item.idCategoria })),
  remove: (id: number): Promise<void> =>
    api(`/trilhas/${id}`, { method: 'DELETE' }).then(() => undefined),
};
