import { useEffect, useState } from 'react';
import type { Instrutor } from '../../services/instrutorService';
import { instrutorService } from '../../services/instrutorService';

export function Instrutores() {
  const [instrutores, setInstrutores] = useState<Instrutor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    instrutorService.getAll().then(setInstrutores).finally(() => setLoading(false));
  }, []);

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Instrutores</h1>
          <p className="page-subtitle">Na API atual, usuários também podem ser vinculados como instrutores</p>
        </div>
      </div>
      <div className="table-wrapper">
        <div className="table-toolbar"><span className="table-toolbar-title">Pessoas disponíveis</span></div>
        <table>
          <thead><tr><th>#</th><th>Nome</th><th>E-mail</th><th>Perfil</th></tr></thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={4} className="table-empty"><i className="bi bi-arrow-repeat" /><p>Carregando...</p></td></tr>
            ) : instrutores.length === 0 ? (
              <tr><td colSpan={4} className="table-empty"><i className="bi bi-people" /><p>Nenhum usuário cadastrado</p></td></tr>
            ) : instrutores.map(item => (
              <tr key={item.id}>
                <td className="td-muted">{item.id}</td>
                <td style={{ fontWeight: 500 }}>{item.nome}</td>
                <td className="td-muted">{item.email}</td>
                <td><span className="badge badge-primary">Usuário / Instrutor</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
