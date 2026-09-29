import { useState, useEffect, useCallback, useRef } from 'react';
import { Modal } from '../../components/Modal';
import { Toast } from '../../components/Toast';
import { moduloService } from '../../services/moduloService';
import type { Modulo } from '../../services/moduloService';
import { cursoService } from '../../services/cursoService';
import type { Curso } from '../../services/cursoService';

export function Modulos() {
  const [items, setItems]       = useState<Modulo[]>([]);
  const [cursos, setCursos]     = useState<Curso[]>([]);
  const [search, setSearch]     = useState('');
  const [modal, setModal]       = useState<'add'|'edit'|'del'|null>(null);
  const [selected, setSelected] = useState<Modulo|null>(null);
  const [form, setForm]         = useState({ titulo:'', ordem:1, cursoId:0 });
  const [toast, setToast]       = useState<{msg:string;type:'success'|'error'}|null>(null);
  const [loading, setLoading]   = useState(true);

  // Searchbox de curso
  const [cursoQuery, setCursoQuery]   = useState('');
  const [cursoOpen, setCursoOpen]     = useState(false);
  const cursoRef                       = useRef<HTMLDivElement>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const [m, c] = await Promise.all([moduloService.getAll(), cursoService.getAll()]);
    setItems(m); setCursos(c); setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  // Fecha dropdown ao clicar fora
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (cursoRef.current && !cursoRef.current.contains(e.target as Node)) {
        setCursoOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const openAdd = () => {
    const primeiro = cursos[0];
    setForm({ titulo:'', ordem:1, cursoId: primeiro?.id ?? 0 });
    setCursoQuery(primeiro?.titulo ?? '');
    setModal('add');
  };

  const openEdit = (m: Modulo) => {
    setSelected(m);
    setForm({ titulo:m.titulo, ordem:m.ordem, cursoId:m.cursoId });
    setCursoQuery(cursos.find(c => c.id === m.cursoId)?.titulo ?? '');
    setModal('edit');
  };

  const openDel = (m: Modulo) => { setSelected(m); setModal('del'); };

  const save = async () => {
    try {
      if (modal==='add') await moduloService.create(form);
      else if (modal==='edit' && selected) await moduloService.update(selected.id!, form);
      await load(); setModal(null);
      setToast({ msg: modal==='add' ? 'Módulo criado!' : 'Módulo atualizado!', type:'success' });
    } catch { setToast({ msg:'Erro ao salvar', type:'error' }); }
  };

  const del = async () => {
    try {
      await moduloService.remove(selected!.id!);
      await load(); setModal(null);
      setToast({ msg:'Módulo removido', type:'success' });
    } catch { setToast({ msg:'Erro ao remover', type:'error' }); }
  };

  const filtered     = items.filter(i => i.titulo.toLowerCase().includes(search.toLowerCase()));
  const getCurso     = (id:number) => cursos.find(c => c.id === id)?.titulo ?? '-';
  const cursosFiltrados = cursos.filter(c =>
    c.titulo.toLowerCase().includes(cursoQuery.toLowerCase())
  );

  return (
    <div className="page">
      <div className="page-header">
        <div><h1 className="page-title">Módulos</h1><p className="page-subtitle">{items.length} módulos cadastrados</p></div>
        <button className="btn btn-primary" onClick={openAdd}><i className="bi bi-plus-lg"></i> Novo Módulo</button>
      </div>

      <div className="table-wrapper">
        <div className="table-toolbar">
          <span className="table-toolbar-title">Lista de módulos</span>
          <div className="table-toolbar-right">
            <div className="search-input">
              <i className="bi bi-search"></i>
              <input placeholder="Buscar..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
          </div>
        </div>
        <table>
          <thead><tr><th>#</th><th>Título</th><th>Curso</th><th>Ordem</th><th>Ações</th></tr></thead>
          <tbody>
            {loading
              ? <tr><td colSpan={5} className="table-empty"><i className="bi bi-arrow-repeat"></i><p>Carregando...</p></td></tr>
              : filtered.length === 0
                ? <tr><td colSpan={5} className="table-empty"><i className="bi bi-inbox"></i><p>Nenhum módulo</p></td></tr>
                : filtered.map(m => (
                  <tr key={m.id}>
                    <td className="td-muted">{m.id}</td>
                    <td style={{fontWeight:500}}>{m.titulo}</td>
                    <td className="td-muted">{getCurso(m.cursoId)}</td>
                    <td><span className="badge badge-muted">#{m.ordem}</span></td>
                    <td><div className="table-actions">
                      <button className="btn btn-ghost btn-icon btn-sm" onClick={() => openEdit(m)}><i className="bi bi-pencil"></i></button>
                      <button className="btn btn-danger btn-icon btn-sm" onClick={() => openDel(m)}><i className="bi bi-trash3"></i></button>
                    </div></td>
                  </tr>
                ))
            }
          </tbody>
        </table>
      </div>

      {(modal==='add' || modal==='edit') && (
        <Modal title={modal==='add' ? 'Novo Módulo' : 'Editar Módulo'} onClose={() => setModal(null)} onConfirm={save}>
          <div className="field">
            <label>Título</label>
            <input className="input" value={form.titulo} onChange={e => setForm(f => ({...f, titulo: e.target.value}))} />
          </div>

          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:12}}>
            <div className="field">
              <label>Ordem</label>
              <input className="input" type="number" min={1} value={form.ordem} onChange={e => setForm(f => ({...f, ordem: +e.target.value}))} />
            </div>

            {/* Searchbox de Curso */}
            <div className="field" ref={cursoRef} style={{position:'relative'}}>
              <label>Curso</label>
              <div style={{position:'relative'}}>
                <input
                  className="input"
                  placeholder="Buscar curso..."
                  value={cursoQuery}
                  onChange={e => { setCursoQuery(e.target.value); setCursoOpen(true); }}
                  onFocus={() => setCursoOpen(true)}
                  style={{paddingRight: 28}}
                />
                <i
                  className="bi bi-chevron-down"
                  style={{
                    position:'absolute', right:10, top:'50%',
                    transform:'translateY(-50%)',
                    fontSize:11, color:'var(--text-faint)',
                    pointerEvents:'none'
                  }}
                />
              </div>

              {cursoOpen && cursosFiltrados.length > 0 && (
                <ul style={{
                  position:'absolute', top:'100%', left:0, right:0,
                  background:'var(--surface-2)', border:'1px solid var(--border)',
                  borderRadius:'var(--radius-sm)', marginTop:4,
                  maxHeight:180, overflowY:'auto', zIndex:999,
                  listStyle:'none', padding:'4px 0', boxShadow:'var(--shadow)'
                }}>
                  {cursosFiltrados.map(c => (
                    <li
                      key={c.id}
                      onClick={() => {
                        setForm(f => ({...f, cursoId: c.id!}));
                        setCursoQuery(c.titulo);
                        setCursoOpen(false);
                      }}
                      style={{
                        padding:'8px 12px', fontSize:13,
                        cursor:'pointer',
                        background: form.cursoId === c.id ? 'var(--primary-light)' : 'transparent',
                        color: form.cursoId === c.id ? 'var(--primary-hover)' : 'var(--text)',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.background = 'var(--surface-3)')}
                      onMouseLeave={e => (e.currentTarget.style.background = form.cursoId === c.id ? 'var(--primary-light)' : 'transparent')}
                    >
                      {c.titulo}
                    </li>
                  ))}
                </ul>
              )}

              {cursoOpen && cursosFiltrados.length === 0 && (
                <div style={{
                  position:'absolute', top:'100%', left:0, right:0,
                  background:'var(--surface-2)', border:'1px solid var(--border)',
                  borderRadius:'var(--radius-sm)', marginTop:4,
                  padding:'10px 12px', fontSize:12,
                  color:'var(--text-faint)', zIndex:999,
                  boxShadow:'var(--shadow)'
                }}>
                  Nenhum curso encontrado
                </div>
              )}
            </div>
          </div>
        </Modal>
      )}

      {modal==='del' && (
        <Modal title="Confirmar exclusão" onClose={() => setModal(null)} onConfirm={del} confirmLabel="Excluir" confirmClass="btn btn-danger">
          <p style={{color:'var(--text-muted)'}}>Excluir o módulo <strong style={{color:'var(--text)'}}>{selected?.titulo}</strong>?</p>
        </Modal>
      )}

      <div className="toast-container">{toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)}/>}</div>
    </div>
  );
}
