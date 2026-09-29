import { useState, useEffect, useCallback } from 'react';
import { Modal }  from '../../components/Modal';
import { Toast }  from '../../components/Toast';
import { categoriaService } from '../../services/categoriaService';
import type { Categoria }   from '../../services/categoriaService';

export function Categorias() {
  const [items, setItems]     = useState<Categoria[]>([]);
  const [search, setSearch]   = useState('');
  const [modal, setModal]     = useState<'add'|'edit'|'del'|null>(null);
  const [selected, setSelected] = useState<Categoria|null>(null);
  const [form, setForm]       = useState({ nome: '', descricao: '' });
  const [toast, setToast]     = useState<{msg:string;type:'success'|'error'}|null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    const data = await categoriaService.getAll();
    setItems(data); setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const openAdd  = () => { setForm({ nome: '', descricao: '' }); setModal('add'); };
  const openEdit = (c: Categoria) => { setSelected(c); setForm({ nome: c.nome, descricao: c.descricao }); setModal('edit'); };
  const openDel  = (c: Categoria) => { setSelected(c); setModal('del'); };

  const save = async () => {
    try {
      if (modal === 'add') await categoriaService.create(form);
      else if (modal === 'edit' && selected) await categoriaService.update(selected.id!, form);
      await load(); setModal(null);
      setToast({ msg: modal === 'add' ? 'Categoria criada!' : 'Categoria atualizada!', type: 'success' });
    } catch { setToast({ msg: 'Erro ao salvar', type: 'error' }); }
  };

  const del = async () => {
    try { await categoriaService.remove(selected!.id!); await load(); setModal(null); setToast({ msg: 'Categoria removida', type: 'success' }); }
    catch { setToast({ msg: 'Erro ao remover', type: 'error' }); }
  };

  const filtered = items.filter(i => i.nome.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="page">
      <div className="page-header">
        <div><h1 className="page-title">Categorias</h1><p className="page-subtitle">{items.length} categorias cadastradas</p></div>
        <button className="btn btn-primary" onClick={openAdd}><i className="bi bi-plus-lg"></i> Nova Categoria</button>
      </div>

      <div className="table-wrapper">
        <div className="table-toolbar">
          <span className="table-toolbar-title">Lista de categorias</span>
          <div className="table-toolbar-right">
            <div className="search-input"><i className="bi bi-search"></i><input placeholder="Buscar categoria..." value={search} onChange={e => setSearch(e.target.value)} /></div>
          </div>
        </div>
        <table>
          <thead><tr><th>#</th><th>Nome</th><th>Descrição</th><th>Ações</th></tr></thead>
          <tbody>
            {loading
              ? <tr><td colSpan={4} className="table-empty"><i className="bi bi-arrow-repeat"></i><p>Carregando...</p></td></tr>
              : filtered.length === 0
              ? <tr><td colSpan={4} className="table-empty"><i className="bi bi-inbox"></i><p>Nenhuma categoria</p></td></tr>
              : filtered.map(c => (
                <tr key={c.id}>
                  <td className="td-muted">{c.id}</td>
                  <td style={{ fontWeight: 500 }}>{c.nome}</td>
                  <td className="td-muted">{c.descricao}</td>
                  <td><div className="table-actions">
                    <button className="btn btn-ghost btn-icon btn-sm" onClick={() => openEdit(c)}><i className="bi bi-pencil"></i></button>
                    <button className="btn btn-danger btn-icon btn-sm" onClick={() => openDel(c)}><i className="bi bi-trash3"></i></button>
                  </div></td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>

      {(modal === 'add' || modal === 'edit') && (
        <Modal title={modal === 'add' ? 'Nova Categoria' : 'Editar Categoria'} onClose={() => setModal(null)} onConfirm={save}>
          <div className="field"><label>Nome</label><input className="input" value={form.nome} onChange={e => setForm(f => ({ ...f, nome: e.target.value }))} /></div>
          <div className="field"><label>Descrição</label><textarea className="textarea" value={form.descricao} onChange={e => setForm(f => ({ ...f, descricao: e.target.value }))} /></div>
        </Modal>
      )}

      {modal === 'del' && (
        <Modal title="Confirmar exclusão" onClose={() => setModal(null)} onConfirm={del} confirmLabel="Excluir" confirmClass="btn btn-danger">
          <p style={{ color: 'var(--text-muted)' }}>Excluir categoria <strong style={{ color: 'var(--text)' }}>{selected?.nome}</strong>?</p>
        </Modal>
      )}

      <div className="toast-container">{toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}</div>
    </div>
  );
}
