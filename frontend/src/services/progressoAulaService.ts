import { api } from '../lib/api';
import { dateOnly, unsupported } from './helpers';

export interface ProgressoAula {
  id: number;
  usuarioId: number;
  aulaId: number;
  dataConclusao: string;
  status: 'Concluído' | 'Em Andamento';
}

interface ProgressoApi { idUsuario: number; idAula: number; dataConclusao: string | null; status: 'CONCLUIDO' | 'EM_ANDAMENTO' }
const mapProgresso = (item: ProgressoApi): ProgressoAula => ({ id: item.idAula, usuarioId: item.idUsuario, aulaId: item.idAula, dataConclusao: dateOnly(item.dataConclusao), status: item.status === 'CONCLUIDO' ? 'Concluído' : 'Em Andamento' });

export const progressoAulaService = {
  getAll: async (): Promise<ProgressoAula[]> => unsupported('Listagem global de progresso'),
  getByUsuario: (usuarioId: number): Promise<ProgressoAula[]> =>
    api<ProgressoApi[]>(`/progresso/${usuarioId}`).then(items => items.map(mapProgresso)),
  getByAula: async (_aulaId: number): Promise<ProgressoAula[]> => unsupported('Filtro global de progresso por aula'),
  create: (data: Omit<ProgressoAula, 'id'>): Promise<ProgressoAula> =>
    api<ProgressoApi>('/progresso', { method: 'PUT', body: JSON.stringify({ idUsuario: data.usuarioId, idAula: data.aulaId, status: data.status === 'Concluído' ? 'CONCLUIDO' : 'EM_ANDAMENTO' }) }).then(mapProgresso),
  update: (_id: number, data: Partial<Omit<ProgressoAula, 'id'>>): Promise<ProgressoAula> => {
    if (!data.usuarioId || !data.aulaId || !data.status) return Promise.reject(new Error('Usuário, aula e status são obrigatórios'));
    return api<ProgressoApi>('/progresso', { method: 'PUT', body: JSON.stringify({ idUsuario: data.usuarioId, idAula: data.aulaId, status: data.status === 'Concluído' ? 'CONCLUIDO' : 'EM_ANDAMENTO' }) }).then(mapProgresso);
  },
  remove: async (_id: number): Promise<void> => unsupported('Exclusão de progresso'),
};
