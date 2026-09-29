import { useCallback, useEffect, useState } from 'react';
import { ApiError } from '../../lib/api';
import { assinaturaService, planoService, type Assinatura, type Plano } from '../../services/assinaturaService';
import { usuarioService, type Usuario } from '../../services/usuarioService';

export function Assinaturas() {
  const [items, setItems] = useState<Assinatura[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [planos, setPlanos] = useState<Plano[]>([]);
  const [form, setForm] = useState({ usuarioId: 0, planoId: 0, dataInicio: new Date().toISOString().slice(0, 10) });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [subscriptions, users, plans] = await Promise.all([assinaturaService.getAll(), usuarioService.getAll(), planoService.getAll()]);
      setItems(subscriptions); setUsuarios(users); setPlanos(plans);
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { void load(); }, [load]);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault(); setMessage('');
    try {
      await assinaturaService.create({ ...form, dataFim: '' });
      setMessage('Assinatura criada com sucesso.');
      await load();
    } catch (error) { setMessage(error instanceof ApiError ? error.message : 'Não foi possível criar a assinatura.'); }
  };

  const cancel = async (id: number) => {
    if (!confirm('Cancelar esta assinatura agora?')) return;
    await assinaturaService.remove(id); await load();
  };

  const userName = (id: number) => usuarios.find(item => item.id === id)?.nomeCompleto ?? `#${id}`;
  const planName = (id: number) => planos.find(item => item.id === id)?.nome ?? `#${id}`;
  const active = (date: string) => new Date(`${date}T23:59:59`) >= new Date();

  return (
    <div className="page-container">
      <div className="page-header"><h2>Assinaturas</h2></div>
      <div className="card mb-4"><div className="card-body"><h5 className="card-title">Nova assinatura</h5>
        <form onSubmit={submit}><div className="row g-3">
          <div className="col-md-4"><label className="form-label">Usuário</label><select className="form-select" value={form.usuarioId} onChange={e => setForm(current => ({ ...current, usuarioId: Number(e.target.value) }))} required><option value={0}>Selecione...</option>{usuarios.map(item => <option key={item.id} value={item.id}>{item.nomeCompleto}</option>)}</select></div>
          <div className="col-md-4"><label className="form-label">Plano</label><select className="form-select" value={form.planoId} onChange={e => setForm(current => ({ ...current, planoId: Number(e.target.value) }))} required><option value={0}>Selecione...</option>{planos.map(item => <option key={item.id} value={item.id}>{item.nome} — R$ {item.preco.toFixed(2)}</option>)}</select></div>
          <div className="col-md-4"><label className="form-label">Data de início</label><input className="form-control" type="date" value={form.dataInicio} onChange={e => setForm(current => ({ ...current, dataInicio: e.target.value }))} required /></div>
        </div>{message && <p className="form-message">{message}</p>}<button className="btn btn-primary mt-3" type="submit">Criar assinatura</button></form>
      </div></div>
      <div className="table-wrapper"><div className="table-toolbar"><span className="table-toolbar-title">Assinaturas registradas</span></div>
        <table><thead><tr><th>#</th><th>Usuário</th><th>Plano</th><th>Período</th><th>Status</th><th>Ações</th></tr></thead>
          <tbody>{loading ? <tr><td colSpan={6} className="table-empty"><p>Carregando...</p></td></tr> : items.length === 0 ? <tr><td colSpan={6} className="table-empty"><p>Nenhuma assinatura registrada</p></td></tr> : items.map(item => <tr key={item.id}><td className="td-muted">{item.id}</td><td>{userName(item.usuarioId)}</td><td>{planName(item.planoId)}</td><td className="td-muted">{item.dataInicio} — {item.dataFim}</td><td><span className={`badge ${active(item.dataFim) ? 'badge-success' : 'badge-muted'}`}>{active(item.dataFim) ? 'Ativa' : 'Encerrada'}</span></td><td><button className="btn btn-danger btn-sm" type="button" onClick={() => void cancel(item.id)} disabled={!active(item.dataFim)}>Cancelar</button></td></tr>)}</tbody>
        </table>
      </div>
    </div>
  );
}
