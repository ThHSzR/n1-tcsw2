import { api } from '../lib/api';
import { dateOnly, unsupported } from './helpers';

export interface Plano {
  id: number;
  nome: string;
  descricao: string;
  preco: number;
  duracaoMeses: number;
}

export interface Assinatura {
  id: number;
  usuarioId: number;
  planoId: number;
  dataInicio: string;
  dataFim: string;
}

interface PlanoApi { idPlano: number; nome: string; descricao: string | null; preco: number | string; duracaoMeses: number }
interface AssinaturaApi { idAssinatura: number; idUsuario: number; idPlano: number; dataInicio: string; dataFim: string }
const mapPlano = (item: PlanoApi): Plano => ({ id: item.idPlano, nome: item.nome, descricao: item.descricao ?? '', preco: Number(item.preco), duracaoMeses: item.duracaoMeses });
const mapAssinatura = (item: AssinaturaApi): Assinatura => ({ id: item.idAssinatura, usuarioId: item.idUsuario, planoId: item.idPlano, dataInicio: dateOnly(item.dataInicio), dataFim: dateOnly(item.dataFim) });

export const planoService = {
  getAll: (): Promise<Plano[]> =>
    api<PlanoApi[]>('/planos').then(items => items.map(mapPlano)),
  getById: (id: number): Promise<Plano> =>
    api<PlanoApi[]>('/planos').then(items => {
      const item = items.find(value => value.idPlano === id);
      if (!item) throw new Error('Plano não encontrado');
      return mapPlano(item);
    }),
  create: (data: Omit<Plano, 'id'>): Promise<Plano> =>
    api<PlanoApi>('/planos', { method: 'POST', body: JSON.stringify(data) }).then(mapPlano),
  update: (id: number, data: Partial<Omit<Plano, 'id'>>): Promise<Plano> =>
    api<PlanoApi>(`/planos/${id}`, { method: 'PATCH', body: JSON.stringify(data) }).then(mapPlano),
  remove: (id: number): Promise<void> =>
    api(`/planos/${id}`, { method: 'DELETE' }).then(() => undefined),
};

export const assinaturaService = {
  getAll: (): Promise<Assinatura[]> =>
    api<AssinaturaApi[]>('/assinaturas').then(items => items.map(mapAssinatura)),
  getById: (id: number): Promise<Assinatura> =>
    api<AssinaturaApi[]>('/assinaturas').then(items => {
      const item = items.find(value => value.idAssinatura === id);
      if (!item) throw new Error('Assinatura não encontrada');
      return mapAssinatura(item);
    }),
  create: (data: Omit<Assinatura, 'id'>): Promise<Assinatura> =>
    api<AssinaturaApi>('/assinaturas', { method: 'POST', body: JSON.stringify({ idUsuario: data.usuarioId, idPlano: data.planoId, ...(data.dataInicio ? { dataInicio: new Date(`${data.dataInicio}T12:00:00`).toISOString() } : {}) }) }).then(mapAssinatura),
  update: async (_id: number, _data: Partial<Omit<Assinatura, 'id'>>): Promise<Assinatura> => unsupported('Edição de assinaturas'),
  remove: (id: number): Promise<void> =>
    api(`/assinaturas/${id}/cancelar`, { method: 'PATCH' }).then(() => undefined),
};
