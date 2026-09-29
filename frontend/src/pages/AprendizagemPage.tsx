import { type FormEvent, useEffect, useState } from 'react';
import { EmptyState, ErrorAlert, LoadingState, PageHeader } from '../components/Feedback';
import { Modal } from '../components/Modal';
import { api, ApiError } from '../lib/api';
import type { Curso, Matricula, Paginated, Usuario } from '../types';

export function AprendizagemPage() {
  const [enrollments, setEnrollments] = useState<Matricula[] | null>(null);
  const [users, setUsers] = useState<Usuario[]>([]);
  const [courses, setCourses] = useState<Curso[]>([]);
  const [modal, setModal] = useState(false);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ idUsuario: '', idCurso: '' });

  const load = async () => {
    try { const [items, people, catalog] = await Promise.all([api<Matricula[]>('/matriculas'), api<Usuario[]>('/usuarios'), api<Paginated<Curso>>('/cursos?limite=100')]); setEnrollments(items); setUsers(people); setCourses(catalog.dados); }
    catch (reason) { setError(reason instanceof Error ? reason.message : 'Erro ao carregar dados'); }
  };
  useEffect(() => { void load(); }, []);

  async function submit(event: FormEvent) {
    event.preventDefault(); setSaving(true); setError('');
    try { await api('/matriculas', { method: 'POST', body: JSON.stringify({ idUsuario: Number(form.idUsuario), idCurso: Number(form.idCurso) }) }); setModal(false); setForm({ idUsuario: '', idCurso: '' }); await load(); }
    catch (reason) { setError(reason instanceof ApiError ? reason.message : 'Erro ao matricular'); }
    finally { setSaving(false); }
  }

  const completed = enrollments?.filter((item) => item.dataConclusao).length ?? 0;
  return <>
    <PageHeader eyebrow="Jornada" title="Aprendizagem" description="Acompanhe matrículas e transforme progresso em conquista." action={<button className="btn btn-primary" onClick={() => setModal(true)}><i className="bi bi-plus-lg me-2" />Nova matrícula</button>} />
    {error && <ErrorAlert message={error} />}
    <div className="summary-strip"><div><span>Matrículas totais</span><strong>{enrollments?.length ?? 0}</strong></div><div><span>Em andamento</span><strong>{(enrollments?.length ?? 0) - completed}</strong></div><div><span>Concluídas</span><strong>{completed}</strong></div><div><span>Taxa de conclusão</span><strong>{enrollments?.length ? Math.round((completed / enrollments.length) * 100) : 0}%</strong></div></div>
    {!enrollments ? <LoadingState /> : enrollments.length === 0 ? <EmptyState icon="bi-mortarboard" title="Nenhuma matrícula" description="Conecte uma pessoa a um curso para iniciar a jornada." /> : <div className="enrollment-list">{enrollments.map((item) => <article className="enrollment-card" key={item.idMatricula}><div className="avatar">{item.usuario.nomeCompleto.charAt(0)}</div><div className="enrollment-person"><strong>{item.usuario.nomeCompleto}</strong><small>{item.usuario.email}</small></div><div className="enrollment-course"><span>Curso</span><strong>{item.curso.titulo}</strong></div><div className="enrollment-date"><span>Matrícula</span><strong>{new Date(item.dataMatricula).toLocaleDateString('pt-BR')}</strong></div><span className={`badge-state ${item.dataConclusao ? 'completed' : ''}`}>{item.dataConclusao ? 'Concluído' : 'Em andamento'}</span></article>)}</div>}
    {modal && <Modal title="Nova matrícula" subtitle="Escolha a pessoa e o curso para começar." onClose={() => setModal(false)}><form className="modal-form" onSubmit={submit}><label className="form-label">Pessoa</label><select className="form-select" value={form.idUsuario} onChange={(e) => setForm({ ...form, idUsuario: e.target.value })} required><option value="">Selecione</option>{users.map((user) => <option value={user.idUsuario} key={user.idUsuario}>{user.nomeCompleto}</option>)}</select><label className="form-label">Curso</label><select className="form-select" value={form.idCurso} onChange={(e) => setForm({ ...form, idCurso: e.target.value })} required><option value="">Selecione</option>{courses.map((course) => <option value={course.idCurso} key={course.idCurso}>{course.titulo}</option>)}</select><button className="btn btn-primary w-100" disabled={saving}>{saving ? 'Matriculando...' : 'Confirmar matrícula'}</button></form></Modal>}
  </>;
}
