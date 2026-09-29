import { useState, useEffect, useCallback } from 'react';
import { Modal } from '../../components/Modal';
import { Toast } from '../../components/Toast';
import { aulaService } from '../../services/aulaService';
import type { Aula } from '../../services/aulaService';
import { moduloService } from '../../services/moduloService';
import type { Modulo } from '../../services/moduloService';

export function Aulas() {
  const [items, setItems]       = useState<Aula[]>([]);
  const [modulos, setModulos]   = useState<Modulo[]>([]);
  const [search, setSearch]     = useState('');
  const [modal, setModal]       = useState<'add'|'edit'|'del'|null>(null);
  const [selected, setSelected] = useState<Aula|null>(null);
  const [form, setForm]         = useState({ titulo:'', tipoConteudo:'Video' as Aula['tipoConteudo'], urlConteudo:'', duracaoMinutos:0, ordem:1, moduloId:0 });
  const [toast, setToast]       = useState<{msg:string;type:'success'|'error'}|null>(null);
  const [loading, setLoading]   = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const [a, m] = await Promise.all([aulaService.getAll(), moduloService.getAll()]);
    setItems(a); setModulos(m); setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const openAdd  = () => { setForm({ titulo:'', tipoConteudo:'Video', urlConteudo:'', duracaoMinutos:0, ordem:1, moduloId: modulos[0]?.id??0 }); setModal('add'); };
  const openEdit = (a: Aula) => { setSelected(a); setForm({ titulo:a.titulo, tipoConteudo:a.tipoConteudo, urlConteudo:a.urlConteudo, duracaoMinutos:a.duracaoMinutos, ordem:a.ordem, moduloId:a.moduloId }); setModal('edit'); };
  const openDel  = (a: Aula) => { setSelected(a); setModal('del'); };

  const save = async () => {
    try {
      if (modal==='add') await aulaService.create(form);
      else if (modal==='edit'&&selected) await aulaService.update(selected.id!, form);
      await load(); setModal(null);
      setToast({ msg: modal==='add'?'Aula criada!':'Aula atualizada!', type:'success' });
    } catch { setToast({ msg:'Erro ao salvar', type:'error' }); }
  };

  const del = async () => {
    try { await aulaService.remove(selected!.id!); await load(); setModal(null); setToast({ msg:'Aula removida', type:'success' }); }
    catch { setToast({ msg:'Erro ao remover', type:'error' }); }
  };

  const filtered = items.filter(i => i.titulo.toLowerCase().includes(search.toLowerCase()));
  const getMod   = (id:number) => modulos.find(m=>m.id===id)?.titulo ?? '-';
  const tipoBadge = (t:string) => t==='Video'?'badge-danger':t==='Texto'?'badge-info':'badge-warning';
  const tipoIcon  = (t:string) => t==='Video'?'bi-play-fill':t==='Texto'?'bi-file-text':'bi-question-circle';

  return (
    <div className="page">
      <div className="page-header">
        <div><h1 className="page-title">Aulas</h1><p className="page-subtitle">{items.length} aulas cadastradas</p></div>
        <button className="btn btn-primary" onClick={openAdd}><i className="bi bi-plus-lg"></i> Nova Aula</button>
      </div>

      <div className="table-wrapper">
        <div className="table-toolbar">
          <span className="table-toolbar-title">Lista de aulas</span>
          <div className="table-toolbar-right">
            <div className="search-input"><i className="bi bi-search"></i><input placeholder="Buscar..." value={search} onChange={e=>setSearch(e.target.value)}/></div>
          </div>
        </div>
        <table>
          <thead><tr><th>#</th><th>Título</th><th>Módulo</th><th>Tipo</th><th>Duração</th><th>Ordem</th><th>Ações</th></tr></thead>
          <tbody>
            {loading ? <tr><td colSpan={7} className="table-empty"><i className="bi bi-arrow-repeat"></i><p>Carregando...</p></td></tr>
            : filtered.length===0 ? <tr><td colSpan={7} className="table-empty"><i className="bi bi-inbox"></i><p>Nenhuma aula</p></td></tr>
            : filtered.map(a => (
              <tr key={a.id}>
                <td className="td-muted">{a.id}</td>
                <td style={{fontWeight:500}}>{a.titulo}</td>
                <td className="td-muted">{getMod(a.moduloId)}</td>
                <td><span className={`badge ${tipoBadge(a.tipoConteudo)}`}><i className={`bi ${tipoIcon(a.tipoConteudo)}`} style={{marginRight:4}}></i>{a.tipoConteudo}</span></td>
                <td className="td-muted">{a.duracaoMinutos}min</td>
                <td><span className="badge badge-muted">#{a.ordem}</span></td>
                <td><div className="table-actions">
                  <button className="btn btn-ghost btn-icon btn-sm" onClick={()=>openEdit(a)}><i className="bi bi-pencil"></i></button>
                  <button className="btn btn-danger btn-icon btn-sm" onClick={()=>openDel(a)}><i className="bi bi-trash3"></i></button>
                </div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {(modal==='add'||modal==='edit') && (
        <Modal title={modal==='add'?'Nova Aula':'Editar Aula'} onClose={()=>setModal(null)} onConfirm={save}>
          <div className="field"><label>Título</label><input className="input" value={form.titulo} onChange={e=>setForm(f=>({...f,titulo:e.target.value}))} /></div>
          <div className="field"><label>URL do Conteúdo</label><input className="input" value={form.urlConteudo} onChange={e=>setForm(f=>({...f,urlConteudo:e.target.value}))} placeholder="https://..." /></div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:12}}>
            <div className="field"><label>Tipo</label><select className="select" value={form.tipoConteudo} onChange={e=>setForm(f=>({...f,tipoConteudo:e.target.value as Aula['tipoConteudo']}))}>
              <option value="Video">Vídeo</option><option value="Texto">Texto</option><option value="Quiz">Quiz</option>
            </select></div>
            <div className="field"><label>Duração (min)</label><input className="input" type="number" value={form.duracaoMinutos} onChange={e=>setForm(f=>({...f,duracaoMinutos:+e.target.value}))} /></div>
            <div className="field"><label>Ordem</label><input className="input" type="number" min={1} value={form.ordem} onChange={e=>setForm(f=>({...f,ordem:+e.target.value}))} /></div>
          </div>
          <div className="field"><label>Módulo</label><select className="select" value={form.moduloId} onChange={e=>setForm(f=>({...f,moduloId:+e.target.value}))}>{modulos.map(m=><option key={m.id} value={m.id}>{m.titulo}</option>)}</select></div>
        </Modal>
      )}

      {modal==='del' && (
        <Modal title="Confirmar exclusão" onClose={()=>setModal(null)} onConfirm={del} confirmLabel="Excluir" confirmClass="btn btn-danger">
          <p style={{color:'var(--text-muted)'}}>Excluir a aula <strong style={{color:'var(--text)'}}>{selected?.titulo}</strong>?</p>
        </Modal>
      )}

      <div className="toast-container">{toast && <Toast message={toast.msg} type={toast.type} onClose={()=>setToast(null)}/>}</div>
    </div>
  );
}
