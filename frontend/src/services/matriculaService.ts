import { api } from '../lib/api';
import { dateOnly } from './helpers';

export interface Matricula {
  id: number;
  usuarioId: number;
  cursoId: number;
  dataMatricula: string;
  dataConclusao: string | null;
}

interface MatriculaApi { idMatricula: number; idUsuario: number; idCurso: number; dataMatricula: string; dataConclusao: string | null }
const mapMatricula = (item: MatriculaApi): Matricula => ({ id: item.idMatricula, usuarioId: item.idUsuario, cursoId: item.idCurso, dataMatricula: dateOnly(item.dataMatricula), dataConclusao: item.dataConclusao ? dateOnly(item.dataConclusao) : null });

export const matriculaService = {
  getAll: (): Promise<Matricula[]> =>
    api<MatriculaApi[]>('/matriculas').then(items => items.map(mapMatricula)),
  getById: (id: number): Promise<Matricula> =>
    api<MatriculaApi[]>('/matriculas').then(items => {
      const item = items.find(value => value.idMatricula === id);
      if (!item) throw new Error('Matrícula não encontrada');
      return mapMatricula(item);
    }),
  create: (data: Omit<Matricula, 'id'>): Promise<Matricula> =>
    api<MatriculaApi>('/matriculas', { method: 'POST', body: JSON.stringify({ idUsuario: data.usuarioId, idCurso: data.cursoId }) }).then(mapMatricula),
  update: (id: number, data: Partial<Omit<Matricula, 'id'>>): Promise<Matricula> =>
    api<MatriculaApi>(`/matriculas/${id}`, { method: 'PATCH', body: JSON.stringify(data.dataConclusao ? { dataConclusao: new Date(`${data.dataConclusao}T12:00:00`).toISOString() } : {}) }).then(mapMatricula),
  remove: (id: number): Promise<void> =>
    api(`/matriculas/${id}`, { method: 'DELETE' }).then(() => undefined),
};
