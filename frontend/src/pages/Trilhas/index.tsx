import { useState, useEffect, useCallback } from 'react';
import { Modal } from '../../components/Modal';
import { Toast } from '../../components/Toast';
import { trilhaService } from '../../services/trilhaService';
import type { Trilha } from '../../services/trilhaService';
import { categoriaService } from '../../services/categoriaService';
import type { Categoria } from '../../services/categoriaService';

export function Trilhas() {
  const [items, setItems]         = useState<Trilha[]>([]);
  const [cats, setCats]           = useState<Categoria[]>([]);
  const [search, setSearch]       = useState('');
  const [modal, setModal]         = useState<'add'|'edit'|'del'|null>(null);
  const [selected, setSelected]   = useState<Trilha | null>(null);
  const [form, setForm]           = useState({ titulo:'', descricao:'', categoriaId:0 });
  const [toast, setToast]         = useState<{msg:string;type:'success'|'error'}|null>(null);
  const [loading, setLoading]     = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const [t, c] = await Promise.all([trilhaService.getAll(), categoriaService.getAll()]);
    setItems(t); setCats(c); setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const openAdd  = () => { setForm({ titulo:'', descricao:'', categoriaId: cats[0]?.id ?? 0 }); setModal('add'); };
  const openEdit = (t: Trilha) => { setSelected(t); setForm({ titulo: t.titulo, descricao: t.descricao, categoriaId: t.categoriaId }); setModal('edit'); };
  const openDel  = (t: Trilha) => { setSelected(t); setModal('del'); };

  const save = async () => {
    try {
      if (modal === 'add') await trilhaService.create(form);
      else if (modal === 'edit' && selected) await trilhaService.update(selected.id!, form);
      await load(); setModal(null);
      setToast({ msg: modal === 'add' ? 'Trilha criada!' : 'Trilha atualizada!', type: 'success' });
    } catch { setToast({ msg: 'Erro ao salvar', type: 'error' }); }
  };

  const del = async () => {
    try {
      await trilhaService.remove(selected!.id!);
      await load(); setModal(null);
      setToast({ msg: 'Trilha removida', type: 'success' });
    } catch { setToast({ msg: 'Erro ao remover', type: 'error' }); }
  };

  const filtered = items.filter(i => i.titulo.toLowerCase().includes(search.toLowerCase()));
  const getCat   = (id: number) => cats.find(c => c.id === id)?.nome ?? '-';

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Trilhas</h1>
          <p className="page-subtitle">{items.length} trilhas cadastradas</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}><i className="bi bi-plus-lg"></i> Nova Trilha</button>
      </div>

      <div className="table-wrapper">
        <div className="table-toolbar">
          <span className="table-toolbar-title">Lista de trilhas</span>
          <div className="table-toolbar-right">
            <div className="search-input">
              <i className="bi bi-search"></i>
              <input placeholder="Buscar..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
          </div>
        </div>
        <table>
          <thead><tr><th>#</th><th>Título</th><th>Descrição</th><th>Categoria</th><th>Ações</th></tr></thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="table-empty"><i className="bi bi-arrow-repeat"></i><p>Carregando...</p></td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={5} className="table-empty"><i className="bi bi-inbox"></i><p>Nenhuma trilha encontrada</p></td></tr>
            ) : filtered.map(t => (
              <tr key={t.id}>
                <td className="td-muted">{t.id}</td>
                <td style={{ fontWeight: 500 }}>{t.titulo}</td>
                <td className="td-muted">{t.descricao}</td>
                <td><span className="badge badge-primary">{getCat(t.categoriaId)}</span></td>
                <td>
                  <div className="table-actions">
                    <button className="btn btn-ghost btn-icon btn-sm" title="Editar" onClick={() => openEdit(t)}><i className="bi bi-pencil"></i></button>
                    <button className="btn btn-danger btn-icon btn-sm" title="Excluir" onClick={() => openDel(t)}><i className="bi bi-trash3"></i></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {(modal === 'add' || modal === 'edit') && (
        <Modal title={modal === 'add' ? 'Nova Trilha' : 'Editar Trilha'} onClose={() => setModal(null)} onConfirm={save}>
          <div className="field"><label>Título</label><input className="input" value={form.titulo} onChange={e => setForm(f=>({...f,titulo:e.target.value}))} placeholder="Título da trilha" /></div>
          <div className="field"><label>Descrição</label><textarea className="textarea" value={form.descricao} onChange={e => setForm(f=>({...f,descricao:e.target.value}))} placeholder="Descrição" /></div>
          <div className="field"><label>Categoria</label>
            <select className="select" value={form.categoriaId} onChange={e => setForm(f=>({...f,categoriaId:+e.target.value}))}>
              {cats.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
            </select>
          </div>
        </Modal>
      )}

      {modal === 'del' && (
        <Modal title="Confirmar exclusão" onClose={() => setModal(null)} onConfirm={del} confirmLabel="Excluir" confirmClass="btn btn-danger">
          <p style={{ color:'var(--text-muted)' }}>Tem certeza que deseja excluir a trilha <strong style={{color:'var(--text)'}}>{selected?.titulo}</strong>?</p>
        </Modal>
      )}

      <div className="toast-container">{toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}</div>
    </div>
  );
}
