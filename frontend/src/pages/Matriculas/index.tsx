import { useEffect, useState } from 'react';
import type { Matricula } from '../../services/matriculaService';
import { matriculaService } from '../../services/matriculaService';
import { usuarioService } from '../../services/usuarioService';
import type { Usuario } from '../../services/usuarioService';
import { cursoService } from '../../services/cursoService';
import type { Curso } from '../../services/cursoService';
import { SearchBox } from '../../components/SearchBox';

export function Matriculas() {
  const [matriculas, setMatriculas] = useState<Matricula[]>([]);
  const [usuarios, setUsuarios]     = useState<Usuario[]>([]);
  const [cursos, setCursos]         = useState<Curso[]>([]);
  const [form, setForm] = useState<Omit<Matricula, 'id'>>({
    usuarioId: 0, cursoId: 0,
    dataMatricula: new Date().toISOString().split('T')[0],
    dataConclusao: null,
  });
  const [editId, setEditId]   = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    Promise.all([matriculaService.getAll(), usuarioService.getAll(), cursoService.getAll()])
      .then(([m, u, c]) => { setMatriculas(m); setUsuarios(u); setCursos(c); setLoading(false); });
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editId !== null) { await matriculaService.update(editId, form); }
    else { await matriculaService.create(form); }
    setForm({ usuarioId: 0, cursoId: 0, dataMatricula: new Date().toISOString().split('T')[0], dataConclusao: null });
    setEditId(null); load();
  };

  const handleEdit = (m: Matricula) => {
    setForm({ usuarioId: m.usuarioId, cursoId: m.cursoId, dataMatricula: m.dataMatricula, dataConclusao: m.dataConclusao });
    setEditId(m.id);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Excluir esta matrícula?')) return;
    await matriculaService.remove(id); load();
  };

  const nomeUsuario = (id: number) => usuarios.find(u => u.id === id)?.nomeCompleto ?? `#${id}`;
  const nomeCurso   = (id: number) => cursos.find(c => c.id === id)?.titulo ?? `#${id}`;

  return (
    <div className="page-container">
      <div className="page-header"><h2>Matrículas</h2></div>

      <div className="card mb-4">
        <div className="card-body">
          <h5 className="card-title mb-3">{editId ? 'Editar Matrícula' : 'Nova Matrícula'}</h5>
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
              <div className="col-md-3">
                <label className="form-label">Data de Matrícula</label>
                <input type="date" className="form-control" value={form.dataMatricula}
                  onChange={e => setForm(f => ({ ...f, dataMatricula: e.target.value }))} required />
              </div>
              <div className="col-md-3">
                <label className="form-label">Data de Conclusão</label>
                <input type="date" className="form-control" value={form.dataConclusao ?? ''}
                  onChange={e => setForm(f => ({ ...f, dataConclusao: e.target.value || null }))} />
              </div>
            </div>
            <div className="d-flex gap-2 mt-3">
              <button type="submit" className="btn btn-primary">{editId ? 'Salvar' : 'Matricular'}</button>
              {editId && <button type="button" className="btn btn-secondary"
                onClick={() => { setForm({ usuarioId: 0, cursoId: 0, dataMatricula: new Date().toISOString().split('T')[0], dataConclusao: null }); setEditId(null); }}>Cancelar</button>}
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
                <tr><th>#</th><th>Usuário</th><th>Curso</th><th>Data Matrícula</th><th>Data Conclusão</th><th style={{ width: 100 }}>Ações</th></tr>
              </thead>
              <tbody>
                {matriculas.map(m => (
                  <tr key={m.id}>
                    <td>{m.id}</td><td>{nomeUsuario(m.usuarioId)}</td><td>{nomeCurso(m.cursoId)}</td>
                    <td>{m.dataMatricula}</td>
                    <td>{m.dataConclusao ?? <span className="badge bg-secondary">Em andamento</span>}</td>
                    <td>
                      <button className="btn btn-sm btn-outline-primary me-1" onClick={() => handleEdit(m)}><i className="bi bi-pencil" /></button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(m.id)}><i className="bi bi-trash" /></button>
                    </td>
                  </tr>
                ))}
                {matriculas.length === 0 && <tr><td colSpan={6} className="text-center text-muted py-4">Nenhuma matrícula registrada.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
