import { api } from '../lib/api';
import { dateOnly } from './helpers';

export interface Avaliacao {
  id: number;
  usuarioId: number;
  cursoId: number;
  nota: number;
  comentario: string | null;
  dataAvaliacao: string;
}

interface AvaliacaoApi { idAvaliacao: number; idUsuario: number; idCurso: number; nota: number; comentario: string | null; dataAvaliacao: string }
const mapAvaliacao = (item: AvaliacaoApi): Avaliacao => ({ id: item.idAvaliacao, usuarioId: item.idUsuario, cursoId: item.idCurso, nota: item.nota, comentario: item.comentario, dataAvaliacao: dateOnly(item.dataAvaliacao) });
const payload = (data: Partial<Omit<Avaliacao, 'id'>>) => ({
  ...(data.usuarioId !== undefined ? { idUsuario: data.usuarioId } : {}),
  ...(data.cursoId !== undefined ? { idCurso: data.cursoId } : {}),
  ...(data.nota !== undefined ? { nota: data.nota } : {}),
  ...(data.comentario !== undefined ? { comentario: data.comentario ?? undefined } : {}),
});

export const avaliacaoService = {
  getAll: (): Promise<Avaliacao[]> =>
    api<AvaliacaoApi[]>('/avaliacoes').then(items => items.map(mapAvaliacao)),
  getByCurso: (cursoId: number): Promise<Avaliacao[]> =>
    api<AvaliacaoApi[]>(`/avaliacoes?idCurso=${cursoId}`).then(items => items.map(mapAvaliacao)),
  create: (data: Omit<Avaliacao, 'id'>): Promise<Avaliacao> =>
    api<AvaliacaoApi>('/avaliacoes', { method: 'POST', body: JSON.stringify(payload(data)) }).then(mapAvaliacao),
  update: (id: number, data: Partial<Omit<Avaliacao, 'id'>>): Promise<Avaliacao> =>
    api<AvaliacaoApi>(`/avaliacoes/${id}`, { method: 'PATCH', body: JSON.stringify(payload(data)) }).then(mapAvaliacao),
  remove: (id: number): Promise<void> =>
    api(`/avaliacoes/${id}`, { method: 'DELETE' }).then(() => undefined),
};
