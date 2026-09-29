import { api } from '../lib/api';

export interface Aula {
  id: number;
  titulo: string;
  moduloId: number;
  tipoConteudo: 'Video' | 'Texto' | 'Quiz';
  urlConteudo: string;
  duracaoMinutos: number;
  ordem: number;
}

interface AulaApi {
  idAula: number;
  titulo: string;
  idModulo: number;
  tipoConteudo: 'VIDEO' | 'TEXTO' | 'QUIZ';
  urlConteudo: string | null;
  duracaoMinutos: number;
  ordem: number;
}

const tipoParaApi = { Video: 'VIDEO', Texto: 'TEXTO', Quiz: 'QUIZ' } as const;
const tipoParaTela = { VIDEO: 'Video', TEXTO: 'Texto', QUIZ: 'Quiz' } as const;
const mapAula = (item: AulaApi): Aula => ({ id: item.idAula, titulo: item.titulo, moduloId: item.idModulo, tipoConteudo: tipoParaTela[item.tipoConteudo], urlConteudo: item.urlConteudo ?? '', duracaoMinutos: item.duracaoMinutos, ordem: item.ordem });
const payload = (data: Partial<Omit<Aula, 'id'>>) => ({
  ...(data.titulo !== undefined ? { titulo: data.titulo } : {}),
  ...(data.moduloId !== undefined ? { idModulo: data.moduloId } : {}),
  ...(data.tipoConteudo !== undefined ? { tipoConteudo: tipoParaApi[data.tipoConteudo] } : {}),
  ...(data.urlConteudo ? { urlConteudo: data.urlConteudo } : {}),
  ...(data.duracaoMinutos !== undefined ? { duracaoMinutos: data.duracaoMinutos } : {}),
  ...(data.ordem !== undefined ? { ordem: data.ordem } : {}),
});

export const aulaService = {
  getAll: (): Promise<Aula[]> =>
    api<AulaApi[]>('/aulas').then(items => items.map(mapAula)),
  getByModulo: (moduloId: number): Promise<Aula[]> =>
    api<AulaApi[]>(`/aulas?idModulo=${moduloId}`).then(items => items.map(mapAula)),
  getById: (id: number): Promise<Aula> =>
    api<AulaApi[]>('/aulas').then(items => {
      const item = items.find(value => value.idAula === id);
      if (!item) throw new Error('Aula não encontrada');
      return mapAula(item);
    }),
  create: (data: Omit<Aula, 'id'>): Promise<Aula> =>
    api<AulaApi>('/aulas', { method: 'POST', body: JSON.stringify(payload(data)) }).then(mapAula),
  update: (id: number, data: Partial<Omit<Aula, 'id'>>): Promise<Aula> =>
    api<AulaApi>(`/aulas/${id}`, { method: 'PATCH', body: JSON.stringify(payload(data)) }).then(mapAula),
  remove: (id: number): Promise<void> =>
    api(`/aulas/${id}`, { method: 'DELETE' }).then(() => undefined),
};
