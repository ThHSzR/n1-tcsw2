import { api } from '../lib/api';
import { dateOnly } from './helpers';

export interface Curso {
  id: number;
  titulo: string;
  descricao: string;
  instrutorId: number;
  categoriaId: number;
  nivel: string;
  dataPublicacao: string;
  totalAulas: number;
  totalHoras: number;
}

interface CursoApi {
  idCurso: number;
  titulo: string;
  descricao: string | null;
  idInstrutor: number;
  idCategoria: number;
  nivel: 'INICIANTE' | 'INTERMEDIARIO' | 'AVANCADO';
  dataPublicacao: string | null;
  totalAulas: number;
  totalHoras: number | string;
}

const nivelParaApi: Record<string, CursoApi['nivel']> = {
  Iniciante: 'INICIANTE',
  Intermediário: 'INTERMEDIARIO',
  Avançado: 'AVANCADO',
};

const nivelParaTela: Record<CursoApi['nivel'], string> = {
  INICIANTE: 'Iniciante',
  INTERMEDIARIO: 'Intermediário',
  AVANCADO: 'Avançado',
};

const mapCurso = (item: CursoApi): Curso => ({
  id: item.idCurso,
  titulo: item.titulo,
  descricao: item.descricao ?? '',
  instrutorId: item.idInstrutor,
  categoriaId: item.idCategoria,
  nivel: nivelParaTela[item.nivel],
  dataPublicacao: dateOnly(item.dataPublicacao),
  totalAulas: item.totalAulas,
  totalHoras: Number(item.totalHoras),
});

const payload = (data: Partial<Omit<Curso, 'id'>>) => ({
  ...(data.titulo !== undefined ? { titulo: data.titulo } : {}),
  ...(data.descricao !== undefined ? { descricao: data.descricao } : {}),
  ...(data.instrutorId !== undefined ? { idInstrutor: data.instrutorId } : {}),
  ...(data.categoriaId !== undefined ? { idCategoria: data.categoriaId } : {}),
  ...(data.nivel !== undefined ? { nivel: nivelParaApi[data.nivel] } : {}),
  ...(data.dataPublicacao ? { dataPublicacao: new Date(`${data.dataPublicacao}T12:00:00`).toISOString() } : {}),
});

export const cursoService = {
  getAll: (): Promise<Curso[]> =>
    api<{ dados: CursoApi[] }>('/cursos?limite=100').then(result => result.dados.map(mapCurso)),
  getById: (id: number): Promise<Curso> =>
    api<CursoApi>(`/cursos/${id}`).then(mapCurso),
  getByCategoria: (categoriaId: number): Promise<Curso[]> =>
    api<{ dados: CursoApi[] }>(`/cursos?idCategoria=${categoriaId}&limite=100`).then(result => result.dados.map(mapCurso)),
  create: (data: Omit<Curso, 'id'>): Promise<Curso> =>
    api<CursoApi>('/cursos', { method: 'POST', body: JSON.stringify(payload(data)) }).then(mapCurso),
  update: (id: number, data: Partial<Omit<Curso, 'id'>>): Promise<Curso> =>
    api<CursoApi>(`/cursos/${id}`, { method: 'PATCH', body: JSON.stringify(payload(data)) }).then(mapCurso),
  remove: (id: number): Promise<void> =>
    api(`/cursos/${id}`, { method: 'DELETE' }).then(() => undefined),
};
