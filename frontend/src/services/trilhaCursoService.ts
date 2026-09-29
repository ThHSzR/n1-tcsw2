import { api } from '../lib/api';
import { unsupported } from './helpers';

export interface TrilhaCurso {
  id: number;
  trilhaId: number;
  cursoId: number;
  ordem: number;
}

export const trilhaCursoService = {
  getAll: async (): Promise<TrilhaCurso[]> => unsupported('Listagem global de cursos das trilhas'),
  getByTrilha: (trilhaId: number): Promise<TrilhaCurso[]> =>
    api<{ cursos: Array<{ idTrilha: number; idCurso: number; ordem: number }> }>(`/trilhas/${trilhaId}`).then(item => item.cursos.map((curso, index) => ({ id: index + 1, trilhaId: curso.idTrilha, cursoId: curso.idCurso, ordem: curso.ordem }))),
  create: (data: Omit<TrilhaCurso, 'id'>): Promise<TrilhaCurso> =>
    api<{ idTrilha: number; idCurso: number; ordem: number }>(`/trilhas/${data.trilhaId}/cursos`, { method: 'POST', body: JSON.stringify({ idCurso: data.cursoId, ordem: data.ordem }) }).then(item => ({ id: item.idCurso, trilhaId: item.idTrilha, cursoId: item.idCurso, ordem: item.ordem })),
  update: async (_id: number, _data: Partial<Omit<TrilhaCurso, 'id'>>): Promise<TrilhaCurso> => unsupported('Reordenação de cursos da trilha'),
  remove: async (_id: number): Promise<void> => unsupported('Remoção sem identificar trilha e curso'),
};
