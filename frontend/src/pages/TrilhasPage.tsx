import { type FormEvent, useEffect, useState } from 'react';
import { EmptyState, ErrorAlert, LoadingState, PageHeader } from '../components/Feedback';
import { Modal } from '../components/Modal';
import { api, ApiError } from '../lib/api';
import type { Categoria, Trilha } from '../types';

export function TrilhasPage() {
  const [tracks, setTracks] = useState<Trilha[] | null>(null);
  const [categories, setCategories] = useState<Categoria[]>([]);
  const [modal, setModal] = useState(false);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ titulo: '', descricao: '', idCategoria: '' });
  const load = async () => { try { const [items, cats] = await Promise.all([api<Trilha[]>('/trilhas?limite=100'), api<Categoria[]>('/categorias')]); setTracks(items); setCategories(cats); } catch (reason) { setError(reason instanceof Error ? reason.message : 'Erro ao carregar trilhas'); } };
  useEffect(() => { void load(); }, []);
  async function submit(event: FormEvent) { event.preventDefault(); setSaving(true); try { await api('/trilhas', { method: 'POST', body: JSON.stringify({ ...form, idCategoria: Number(form.idCategoria) }) }); setModal(false); setForm({ titulo: '', descricao: '', idCategoria: '' }); await load(); } catch (reason) { setError(reason instanceof ApiError ? reason.message : 'Erro ao criar trilha'); } finally { setSaving(false); } }
  return <>
    <PageHeader eyebrow="Curadoria" title="Trilhas de conhecimento" description="Combine cursos em percursos claros, progressivos e cheios de intenção." action={<button className="btn btn-primary" onClick={() => setModal(true)}><i className="bi bi-signpost-2 me-2" />Nova trilha</button>} />
    {error && <ErrorAlert message={error} />}
    {!tracks ? <LoadingState /> : tracks.length === 0 ? <EmptyState icon="bi-signpost-split" title="Nenhuma trilha criada" description="Organize cursos em uma jornada guiada de conhecimento." action={<button className="btn btn-primary" onClick={() => setModal(true)}>Criar trilha</button>} /> : <div className="track-grid">{tracks.map((track, index) => <article className="track-card" key={track.idTrilha}><div className={`track-number track-number--${index % 4}`}>{String(index + 1).padStart(2, '0')}</div><span className="eyebrow">{track.categoria.nome}</span><h3>{track.titulo}</h3><p>{track.descricao || 'Uma sequência pensada para acelerar a aprendizagem.'}</p><div className="track-path">{track.cursos.slice(0, 4).map((item) => <span key={item.curso.idCurso} title={item.curso.titulo}>{item.ordem}</span>)}{track.cursos.length === 0 && <small>Adicione cursos à trilha</small>}</div><div className="track-footer"><span><i className="bi bi-collection-play" />{track.cursos.length} cursos</span><button className="icon-button"><i className="bi bi-arrow-up-right" /></button></div></article>)}</div>}
    {modal && <Modal title="Nova trilha" subtitle="Crie o ponto de partida de uma jornada." onClose={() => setModal(false)}><form className="modal-form" onSubmit={submit}><label className="form-label">Título</label><input className="form-control" value={form.titulo} onChange={(e) => setForm({ ...form, titulo: e.target.value })} required /><label className="form-label">Descrição</label><textarea className="form-control" rows={3} value={form.descricao} onChange={(e) => setForm({ ...form, descricao: e.target.value })} /><label className="form-label">Categoria</label><select className="form-select" value={form.idCategoria} onChange={(e) => setForm({ ...form, idCategoria: e.target.value })} required><option value="">Selecione</option>{categories.map((cat) => <option value={cat.idCategoria} key={cat.idCategoria}>{cat.nome}</option>)}</select><button className="btn btn-primary w-100" disabled={saving}>{saving ? 'Criando...' : 'Criar trilha'}</button></form></Modal>}
  </>;
}
