import { useCallback, useEffect, useState } from 'react';
import { ApiError } from '../../lib/api';
import { certificadoService, type Certificado } from '../../services/certificadoService';
import { cursoService, type Curso } from '../../services/cursoService';
import { trilhaService, type Trilha } from '../../services/trilhaService';
import { usuarioService, type Usuario } from '../../services/usuarioService';

export function Certificados() {
  const [items, setItems] = useState<Certificado[]>([]);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [trilhas, setTrilhas] = useState<Trilha[]>([]);
  const [form, setForm] = useState({ usuarioId: 0, cursoId: 0, trilhaId: 0 });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [certificados, users, courseList, trackList] = await Promise.all([
        certificadoService.getAll(), usuarioService.getAll(), cursoService.getAll(), trilhaService.getAll(),
      ]);
      setItems(certificados); setUsuarios(users); setCursos(courseList); setTrilhas(trackList);
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { void load(); }, [load]);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault(); setMessage('');
    try {
      await certificadoService.create({
        ...form,
        trilhaId: form.trilhaId || null,
        codigoVerificacao: '',
        dataEmissao: '',
      });
      setForm({ usuarioId: 0, cursoId: 0, trilhaId: 0 });
      setMessage('Certificado emitido com sucesso.');
      await load();
    } catch (error) {
      setMessage(error instanceof ApiError ? error.message : 'Não foi possível emitir o certificado.');
    }
  };

  const userName = (id: number) => usuarios.find(item => item.id === id)?.nomeCompleto ?? `#${id}`;
  const courseName = (id: number) => cursos.find(item => item.id === id)?.titulo ?? `#${id}`;

  return (
    <div className="page-container">
      <div className="page-header"><h2>Certificados</h2></div>
      <div className="card mb-4"><div className="card-body">
        <h5 className="card-title">Emitir certificado</h5>
        <p className="page-subtitle mb-3">A API permite a emissão apenas quando a matrícula do curso estiver concluída.</p>
        <form onSubmit={submit}>
          <div className="row g-3">
            <div className="col-md-4"><label className="form-label">Usuário</label><select className="form-select" value={form.usuarioId} onChange={e => setForm(current => ({ ...current, usuarioId: Number(e.target.value) }))} required><option value={0}>Selecione...</option>{usuarios.map(item => <option key={item.id} value={item.id}>{item.nomeCompleto}</option>)}</select></div>
            <div className="col-md-4"><label className="form-label">Curso concluído</label><select className="form-select" value={form.cursoId} onChange={e => setForm(current => ({ ...current, cursoId: Number(e.target.value) }))} required><option value={0}>Selecione...</option>{cursos.map(item => <option key={item.id} value={item.id}>{item.titulo}</option>)}</select></div>
            <div className="col-md-4"><label className="form-label">Trilha (opcional)</label><select className="form-select" value={form.trilhaId} onChange={e => setForm(current => ({ ...current, trilhaId: Number(e.target.value) }))}><option value={0}>Nenhuma</option>{trilhas.map(item => <option key={item.id} value={item.id}>{item.titulo}</option>)}</select></div>
          </div>
          {message && <p className="form-message">{message}</p>}
          <button className="btn btn-primary mt-3" type="submit"><i className="bi bi-patch-check" /> Emitir certificado</button>
        </form>
      </div></div>
      <div className="table-wrapper">
        <div className="table-toolbar"><span className="table-toolbar-title">Certificados emitidos</span></div>
        <table><thead><tr><th>#</th><th>Usuário</th><th>Curso</th><th>Código</th><th>Emissão</th></tr></thead>
          <tbody>{loading ? <tr><td colSpan={5} className="table-empty"><p>Carregando...</p></td></tr> : items.length === 0 ? <tr><td colSpan={5} className="table-empty"><i className="bi bi-patch-check" /><p>Nenhum certificado emitido</p></td></tr> : items.map(item => <tr key={item.id}><td className="td-muted">{item.id}</td><td>{userName(item.usuarioId)}</td><td>{courseName(item.cursoId)}</td><td><code>{item.codigoVerificacao}</code></td><td className="td-muted">{item.dataEmissao}</td></tr>)}</tbody>
        </table>
      </div>
    </div>
  );
}
