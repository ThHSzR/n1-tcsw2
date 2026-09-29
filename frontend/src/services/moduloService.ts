import { api } from '../lib/api';

export interface Modulo {
  id: number;
  titulo: string;
  cursoId: number;
  ordem: number;
}

export const moduloService = {
  getAll: (): Promise<Modulo[]> =>
    api<Array<{ idModulo: number; titulo: string; idCurso: number; ordem: number }>>('/modulos')
      .then(items => items.map(item => ({ id: item.idModulo, titulo: item.titulo, cursoId: item.idCurso, ordem: item.ordem }))),
  getByCurso: (cursoId: number): Promise<Modulo[]> =>
    api<Array<{ idModulo: number; titulo: string; idCurso: number; ordem: number }>>(`/modulos?idCurso=${cursoId}`)
      .then(items => items.map(item => ({ id: item.idModulo, titulo: item.titulo, cursoId: item.idCurso, ordem: item.ordem }))),
  getById: (id: number): Promise<Modulo> =>
    api<Array<{ idModulo: number; titulo: string; idCurso: number; ordem: number }>>('/modulos')
      .then(items => {
        const item = items.find(value => value.idModulo === id);
        if (!item) throw new Error('Módulo não encontrado');
        return { id: item.idModulo, titulo: item.titulo, cursoId: item.idCurso, ordem: item.ordem };
      }),
  create: (data: Omit<Modulo, 'id'>): Promise<Modulo> =>
    api<{ idModulo: number; titulo: string; idCurso: number; ordem: number }>('/modulos', { method: 'POST', body: JSON.stringify({ idCurso: data.cursoId, titulo: data.titulo, ordem: data.ordem }) })
      .then(item => ({ id: item.idModulo, titulo: item.titulo, cursoId: item.idCurso, ordem: item.ordem })),
  update: (id: number, data: Partial<Omit<Modulo, 'id'>>): Promise<Modulo> =>
    api<{ idModulo: number; titulo: string; idCurso: number; ordem: number }>(`/modulos/${id}`, { method: 'PATCH', body: JSON.stringify({ ...(data.cursoId !== undefined ? { idCurso: data.cursoId } : {}), ...(data.titulo !== undefined ? { titulo: data.titulo } : {}), ...(data.ordem !== undefined ? { ordem: data.ordem } : {}) }) })
      .then(item => ({ id: item.idModulo, titulo: item.titulo, cursoId: item.idCurso, ordem: item.ordem })),
  remove: (id: number): Promise<void> =>
    api(`/modulos/${id}`, { method: 'DELETE' }).then(() => undefined),
};
