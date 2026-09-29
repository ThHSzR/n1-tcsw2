import { useCallback, useEffect, useState } from 'react';
import { ApiError } from '../../lib/api';
import { assinaturaService, type Assinatura } from '../../services/assinaturaService';
import { pagamentoService, type Pagamento } from '../../services/pagamentoService';

const methods = ['PIX', 'Cartão de Crédito', 'Cartão de Débito', 'Boleto'];

export function Pagamentos() {
  const [items, setItems] = useState<Pagamento[]>([]);
  const [assinaturas, setAssinaturas] = useState<Assinatura[]>([]);
  const [form, setForm] = useState({ assinaturaId: 0, valorPago: 0, metodoPagamento: 'PIX' });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try { const [payments, subscriptions] = await Promise.all([pagamentoService.getAll(), assinaturaService.getAll()]); setItems(payments); setAssinaturas(subscriptions); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { void load(); }, [load]);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault(); setMessage('');
    try {
      await pagamentoService.create({ ...form, dataPagamento: '', idTransacaoGateway: '' });
      setMessage('Pagamento registrado com sucesso.'); await load();
    } catch (error) { setMessage(error instanceof ApiError ? error.message : 'Não foi possível registrar o pagamento.'); }
  };

  return (
    <div className="page-container">
      <div className="page-header"><h2>Pagamentos</h2></div>
      <div className="card mb-4"><div className="card-body"><h5 className="card-title">Registrar pagamento</h5>
        <form onSubmit={submit}><div className="row g-3">
          <div className="col-md-4"><label className="form-label">Assinatura</label><select className="form-select" value={form.assinaturaId} onChange={e => setForm(current => ({ ...current, assinaturaId: Number(e.target.value) }))} required><option value={0}>Selecione...</option>{assinaturas.map(item => <option key={item.id} value={item.id}>Assinatura #{item.id} — usuário {item.usuarioId}</option>)}</select></div>
          <div className="col-md-4"><label className="form-label">Valor pago</label><input className="form-control" type="number" min="0.01" step="0.01" value={form.valorPago} onChange={e => setForm(current => ({ ...current, valorPago: Number(e.target.value) }))} required /></div>
          <div className="col-md-4"><label className="form-label">Método</label><select className="form-select" value={form.metodoPagamento} onChange={e => setForm(current => ({ ...current, metodoPagamento: e.target.value }))}>{methods.map(method => <option key={method}>{method}</option>)}</select></div>
        </div>{message && <p className="form-message">{message}</p>}<button className="btn btn-primary mt-3" type="submit">Registrar pagamento</button></form>
      </div></div>
      <div className="table-wrapper"><div className="table-toolbar"><span className="table-toolbar-title">Histórico de pagamentos</span></div>
        <table><thead><tr><th>#</th><th>Assinatura</th><th>Valor</th><th>Método</th><th>Data</th><th>Transação</th></tr></thead>
          <tbody>{loading ? <tr><td colSpan={6} className="table-empty"><p>Carregando...</p></td></tr> : items.length === 0 ? <tr><td colSpan={6} className="table-empty"><p>Nenhum pagamento registrado</p></td></tr> : items.map(item => <tr key={item.id}><td className="td-muted">{item.id}</td><td>#{item.assinaturaId}</td><td>R$ {item.valorPago.toFixed(2)}</td><td>{item.metodoPagamento}</td><td className="td-muted">{item.dataPagamento}</td><td><code>{item.idTransacaoGateway}</code></td></tr>)}</tbody>
        </table>
      </div>
    </div>
  );
}
