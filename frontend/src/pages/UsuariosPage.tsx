import { type FormEvent, useEffect, useState } from 'react';
import { EmptyState, ErrorAlert, LoadingState, PageHeader } from '../components/Feedback';
import { Modal } from '../components/Modal';
import { api, ApiError } from '../lib/api';
import type { Usuario } from '../types';

export function UsuariosPage() {
  const [users, setUsers] = useState<Usuario[] | null>(null);
  const [modal, setModal] = useState(false);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ nomeCompleto: '', email: '', senha: '' });

  const load = () => api<Usuario[]>('/usuarios').then(setUsers).catch((reason: Error) => setError(reason.message));
  useEffect(() => {
    void load();
  }, []);
  const filtered = users?.filter((user) => `${user.nomeCompleto} ${user.email}`.toLowerCase().includes(search.toLowerCase()));

  async function submit(event: FormEvent) {
    event.preventDefault(); setSaving(true); setError('');
    try { await api('/usuarios', { method: 'POST', body: JSON.stringify(form) }); setModal(false); setForm({ nomeCompleto: '', email: '', senha: '' }); await load(); }
    catch (reason) { setError(reason instanceof ApiError ? reason.message : 'Erro ao cadastrar pessoa'); }
    finally { setSaving(false); }
  }

  return <>
    <PageHeader eyebrow="Comunidade" title="Pessoas" description="Quem ensina e quem aprende se encontra aqui." action={<button className="btn btn-primary" onClick={() => setModal(true)}><i className="bi bi-person-plus me-2" />Nova pessoa</button>} />
    {error && <ErrorAlert message={error} />}
    <div className="toolbar"><div className="search-box"><i className="bi bi-search" /><input placeholder="Buscar por nome ou e-mail" value={search} onChange={(e) => setSearch(e.target.value)} /></div><span className="result-count">{filtered?.length ?? 0} pessoas</span></div>
    {!users ? <LoadingState /> : filtered?.length === 0 ? <EmptyState icon="bi-people" title="Ninguém por aqui" description="Cadastre a primeira pessoa da comunidade." /> : <div className="panel table-panel"><div className="table-responsive"><table className="table align-middle"><thead><tr><th>Pessoa</th><th>E-mail</th><th>Desde</th><th>Status</th></tr></thead><tbody>{filtered?.map((user) => <tr key={user.idUsuario}><td><div className="person-cell"><div className="avatar">{user.nomeCompleto.charAt(0)}</div><div><strong>{user.nomeCompleto}</strong><small>#{String(user.idUsuario).padStart(4, '0')}</small></div></div></td><td>{user.email}</td><td>{new Date(user.dataCadastro).toLocaleDateString('pt-BR')}</td><td><span className="status-pill"><i />Ativo</span></td></tr>)}</tbody></table></div></div>}
    {modal && <Modal title="Nova pessoa" subtitle="Cadastre um novo acesso à plataforma." onClose={() => setModal(false)}><form className="modal-form" onSubmit={submit}><label className="form-label">Nome completo</label><input className="form-control" value={form.nomeCompleto} onChange={(e) => setForm({ ...form, nomeCompleto: e.target.value })} required /><label className="form-label">E-mail</label><input className="form-control" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required /><label className="form-label">Senha inicial</label><input className="form-control" type="password" minLength={6} value={form.senha} onChange={(e) => setForm({ ...form, senha: e.target.value })} required /><button className="btn btn-primary w-100" disabled={saving}>{saving ? 'Cadastrando...' : 'Cadastrar pessoa'}</button></form></Modal>}
  </>;
}
