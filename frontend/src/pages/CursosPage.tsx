import { type FormEvent, useCallback, useEffect, useState } from 'react';
import { EmptyState, ErrorAlert, LoadingState, PageHeader } from '../components/Feedback';
import { Modal } from '../components/Modal';
import { api, ApiError } from '../lib/api';
import type { Categoria, Curso, Paginated, Usuario } from '../types';

const initialForm = { titulo: '', descricao: '', idInstrutor: '', idCategoria: '', nivel: 'INICIANTE' };

export function CursosPage() {
  const [courses, setCourses] = useState<Paginated<Curso> | null>(null);
  const [categories, setCategories] = useState<Categoria[]>([]);
  const [users, setUsers] = useState<Usuario[]>([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setError('');
    try {
      const params = new URLSearchParams({ limite: '100' });
      if (search) params.set('busca', search);
      if (category) params.set('idCategoria', category);
      const [courseData, categoryData, userData] = await Promise.all([
        api<Paginated<Curso>>(`/cursos?${params}`), api<Categoria[]>('/categorias'), api<Usuario[]>('/usuarios'),
      ]);
      setCourses(courseData); setCategories(categoryData); setUsers(userData);
    } catch (reason) { setError(reason instanceof Error ? reason.message : 'Erro ao carregar cursos'); }
  }, [search, category]);

  useEffect(() => { const timer = window.setTimeout(load, 250); return () => window.clearTimeout(timer); }, [load]);

  async function submit(event: FormEvent) {
    event.preventDefault(); setSaving(true); setError('');
    try {
      await api('/cursos', { method: 'POST', body: JSON.stringify({ ...form, idInstrutor: Number(form.idInstrutor), idCategoria: Number(form.idCategoria) }) });
      setModal(false); setForm(initialForm); await load();
    } catch (reason) { setError(reason instanceof ApiError ? reason.message : 'Erro ao criar curso'); }
    finally { setSaving(false); }
  }

  return (
    <>
      <PageHeader eyebrow="Catálogo" title="Cursos" description="Crie experiências que conectam conteúdo, pessoas e propósito." action={<button className="btn btn-primary" onClick={() => setModal(true)}><i className="bi bi-plus-lg me-2" />Novo curso</button>} />
      {error && <ErrorAlert message={error} />}
      <div className="toolbar"><div className="search-box"><i className="bi bi-search" /><input placeholder="Buscar por título ou descrição" value={search} onChange={(e) => setSearch(e.target.value)} /></div><select className="form-select" value={category} onChange={(e) => setCategory(e.target.value)}><option value="">Todas as categorias</option>{categories.map((item) => <option key={item.idCategoria} value={item.idCategoria}>{item.nome}</option>)}</select></div>
      {!courses ? <LoadingState label="Buscando cursos" /> : courses.dados.length === 0 ? <EmptyState icon="bi-journal-plus" title="Nenhum curso encontrado" description="Ajuste os filtros ou dê vida ao primeiro curso do catálogo." action={<button className="btn btn-primary" onClick={() => setModal(true)}>Criar curso</button>} /> : (
        <div className="course-grid">{courses.dados.map((course, index) => <CourseCard key={course.idCurso} course={course} index={index} />)}</div>
      )}
      {modal && <Modal title="Novo curso" subtitle="Defina a base da nova experiência de aprendizagem." onClose={() => setModal(false)}><form onSubmit={submit} className="modal-form"><label className="form-label">Título</label><input className="form-control" value={form.titulo} onChange={(e) => setForm({ ...form, titulo: e.target.value })} required /><label className="form-label">Descrição</label><textarea className="form-control" rows={3} value={form.descricao} onChange={(e) => setForm({ ...form, descricao: e.target.value })} /><div className="form-row"><div><label className="form-label">Categoria</label><select className="form-select" value={form.idCategoria} onChange={(e) => setForm({ ...form, idCategoria: e.target.value })} required><option value="">Selecione</option>{categories.map((item) => <option value={item.idCategoria} key={item.idCategoria}>{item.nome}</option>)}</select></div><div><label className="form-label">Instrutor</label><select className="form-select" value={form.idInstrutor} onChange={(e) => setForm({ ...form, idInstrutor: e.target.value })} required><option value="">Selecione</option>{users.map((item) => <option value={item.idUsuario} key={item.idUsuario}>{item.nomeCompleto}</option>)}</select></div></div><label className="form-label">Nível</label><select className="form-select" value={form.nivel} onChange={(e) => setForm({ ...form, nivel: e.target.value })}><option value="INICIANTE">Iniciante</option><option value="INTERMEDIARIO">Intermediário</option><option value="AVANCADO">Avançado</option></select><button className="btn btn-primary w-100" disabled={saving}>{saving ? 'Criando...' : 'Criar curso'}</button></form></Modal>}
    </>
  );
}

function CourseCard({ course, index }: { course: Curso; index: number }) {
  const colors = ['course-cover--green', 'course-cover--orange', 'course-cover--blue', 'course-cover--purple'];
  return <article className="course-card"><div className={`course-cover ${colors[index % colors.length]}`}><span>{course.categoria.nome}</span><i className={`bi ${index % 2 ? 'bi-braces' : 'bi-bezier2'}`} /><small>{course.nivel.toLowerCase()}</small></div><div className="course-card__body"><h3>{course.titulo}</h3><p>{course.descricao || 'Uma jornada de aprendizagem pronta para ganhar conteúdo.'}</p><div className="teacher-row"><div className="avatar avatar--small">{course.instrutor.nomeCompleto.charAt(0)}</div><span>{course.instrutor.nomeCompleto}</span></div><div className="course-meta"><span><i className="bi bi-play-circle" />{course.totalAulas} aulas</span><span><i className="bi bi-clock" />{Number(course.totalHoras).toFixed(1)}h</span><span><i className="bi bi-people" />{course._count?.matriculas ?? 0}</span></div></div></article>;
}
