import { useEffect, useState } from 'react';
import type { Avaliacao } from '../../services/avaliacaoService';
import { avaliacaoService } from '../../services/avaliacaoService';
import { usuarioService } from '../../services/usuarioService';
import type { Usuario } from '../../services/usuarioService';
import { cursoService } from '../../services/cursoService';
import type { Curso } from '../../services/cursoService';
import { SearchBox } from '../../components/SearchBox';

export function Avaliacoes() {
  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([]);
  const [usuarios, setUsuarios]     = useState<Usuario[]>([]);
  const [cursos, setCursos]         = useState<Curso[]>([]);
  const [form, setForm] = useState<Omit<Avaliacao, 'id'>>({
    usuarioId: 0, cursoId: 0, nota: 5, comentario: null,
    dataAvaliacao: new Date().toISOString().split('T')[0],
  });
  const [editId, setEditId]   = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    Promise.all([avaliacaoService.getAll(), usuarioService.getAll(), cursoService.getAll()])
      .then(([av, u, c]) => { setAvaliacoes(av); setUsuarios(u); setCursos(c); setLoading(false); });
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editId !== null) { await avaliacaoService.update(editId, form); }
    else { await avaliacaoService.create(form); }
    setForm({ usuarioId: 0, cursoId: 0, nota: 5, comentario: null, dataAvaliacao: new Date().toISOString().split('T')[0] });
    setEditId(null); load();
  };

  const handleEdit = (a: Avaliacao) => {
    setForm({ usuarioId: a.usuarioId, cursoId: a.cursoId, nota: a.nota, comentario: a.comentario, dataAvaliacao: a.dataAvaliacao });
    setEditId(a.id);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Excluir esta avaliação?')) return;
    await avaliacaoService.remove(id); load();
  };

  const nomeUsuario = (id: number) => usuarios.find(u => u.id === id)?.nomeCompleto ?? `#${id}`;
  const nomeCurso   = (id: number) => cursos.find(c => c.id === id)?.titulo ?? `#${id}`;
  const estrelas    = (n: number) => '★'.repeat(n) + '☆'.repeat(5 - n);

  return (
    <div className="page-container">
      <div className="page-header"><h2>Avaliações</h2></div>

      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title mb-3">{editId ? 'Editar Avaliação' : 'Nova Avaliação'}</h5>
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-3">
                <SearchBox
                  label="Usuário"
                  placeholder="Buscar usuário..."
                  options={usuarios.map(u => ({ id: u.id!, label: u.nomeCompleto }))}
                  value={form.usuarioId}
                  onChange={id => setForm(f => ({ ...f, usuarioId: id }))}
                  required
                />
              </div>
              <div className="col-md-3">
                <label className="form-label">Curso</label>
                <select className="form-select" value={form.cursoId} onChange={e => setForm(f => ({ ...f, cursoId: +e.target.value }))} required>
                  <option value={0}>Selecione...</option>
                  {cursos.map(c => <option key={c.id} value={c.id}>{c.titulo}</option>)}
                </select>
              </div>
              <div className="col-md-2">
                <label className="form-label">Nota (1–5)</label>
                <input type="number" min={1} max={5} className="form-control" value={form.nota}
                  onChange={e => setForm(f => ({ ...f, nota: +e.target.value }))} required />
              </div>
              <div className="col-md-2">
                <label className="form-label">Data</label>
                <input type="date" className="form-control" value={form.dataAvaliacao}
                  onChange={e => setForm(f => ({ ...f, dataAvaliacao: e.target.value }))} required />
              </div>
              <div className="col-md-2">
                <label className="form-label">Comentário</label>
                <input className="form-control" value={form.comentario ?? ''}
                  onChange={e => setForm(f => ({ ...f, comentario: e.target.value || null }))} />
              </div>
            </div>
            <div className="d-flex gap-2 mt-3">
              <button type="submit" className="btn btn-primary">{editId ? 'Salvar' : 'Avaliar'}</button>
              {editId && <button type="button" className="btn btn-secondary"
                onClick={() => { setForm({ usuarioId: 0, cursoId: 0, nota: 5, comentario: null, dataAvaliacao: new Date().toISOString().split('T')[0] }); setEditId(null); }}>Cancelar</button>}
            </div>
          </form>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-4"><div className="spinner-border text-primary" /></div>
      ) : (
        <div className="card">
          <div className="card-body p-0">
            <table className="table table-hover mb-0">
              <thead>
                <tr><th>#</th><th>Usuário</th><th>Curso</th><th>Nota</th><th>Comentário</th><th>Data</th><th style={{ width: 100 }}>Ações</th></tr>
              </thead>
              <tbody>
                {avaliacoes.map(a => (
                  <tr key={a.id}>
                    <td>{a.id}</td><td>{nomeUsuario(a.usuarioId)}</td><td>{nomeCurso(a.cursoId)}</td>
                    <td><span style={{ color: '#f59e0b', letterSpacing: 1 }}>{estrelas(a.nota)}</span></td>
                    <td><span className="text-muted">{a.comentario ?? '—'}</span></td>
                    <td>{a.dataAvaliacao}</td>
                    <td>
                      <button className="btn btn-sm btn-outline-primary me-1" onClick={() => handleEdit(a)}><i className="bi bi-pencil" /></button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(a.id)}><i className="bi bi-trash" /></button>
                    </td>
                  </tr>
                ))}
                {avaliacoes.length === 0 && <tr><td colSpan={7} className="text-center text-muted py-4">Nenhuma avaliação registrada.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
