import { api } from '../lib/api';
import { dateOnly, unsupported } from './helpers';

export interface Pagamento {
  id: number;
  assinaturaId: number;
  valorPago: number;
  dataPagamento: string;
  metodoPagamento: string;
  idTransacaoGateway: string;
}

interface PagamentoApi { idPagamento: number; idAssinatura: number; valorPago: number | string; dataPagamento: string; metodoPagamento: 'CARTAO_CREDITO' | 'CARTAO_DEBITO' | 'PIX' | 'BOLETO'; idTransacaoGateway: string }
const metodoParaApi: Record<string, PagamentoApi['metodoPagamento']> = { 'Cartão de Crédito': 'CARTAO_CREDITO', 'Cartão de Débito': 'CARTAO_DEBITO', PIX: 'PIX', Boleto: 'BOLETO' };
const metodoParaTela: Record<PagamentoApi['metodoPagamento'], string> = { CARTAO_CREDITO: 'Cartão de Crédito', CARTAO_DEBITO: 'Cartão de Débito', PIX: 'PIX', BOLETO: 'Boleto' };
const mapPagamento = (item: PagamentoApi): Pagamento => ({ id: item.idPagamento, assinaturaId: item.idAssinatura, valorPago: Number(item.valorPago), dataPagamento: dateOnly(item.dataPagamento), metodoPagamento: metodoParaTela[item.metodoPagamento], idTransacaoGateway: item.idTransacaoGateway });

export const pagamentoService = {
  getAll: (): Promise<Pagamento[]> =>
    api<PagamentoApi[]>('/pagamentos').then(items => items.map(mapPagamento)),
  getById: (id: number): Promise<Pagamento> =>
    api<PagamentoApi[]>('/pagamentos').then(items => {
      const item = items.find(value => value.idPagamento === id);
      if (!item) throw new Error('Pagamento não encontrado');
      return mapPagamento(item);
    }),
  getByAssinatura: (assinaturaId: number): Promise<Pagamento[]> =>
    api<PagamentoApi[]>(`/pagamentos?idAssinatura=${assinaturaId}`).then(items => items.map(mapPagamento)),
  create: (data: Omit<Pagamento, 'id'>): Promise<Pagamento> =>
    api<PagamentoApi>('/pagamentos', { method: 'POST', body: JSON.stringify({ idAssinatura: data.assinaturaId, valorPago: data.valorPago, metodoPagamento: metodoParaApi[data.metodoPagamento], ...(data.idTransacaoGateway ? { idTransacaoGateway: data.idTransacaoGateway } : {}) }) }).then(mapPagamento),
  update: async (_id: number, _data: Partial<Omit<Pagamento, 'id'>>): Promise<Pagamento> => unsupported('Edição de pagamentos'),
  remove: async (_id: number): Promise<void> => unsupported('Exclusão de pagamentos'),
};
