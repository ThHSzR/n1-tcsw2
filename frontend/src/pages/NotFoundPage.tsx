import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return <div className="empty-state full-page"><div className="empty-icon"><i className="bi bi-compass" /></div><h1>Página não encontrada</h1><p>Esse caminho ainda não faz parte da jornada.</p><Link className="btn btn-primary" to="/">Voltar ao início</Link></div>;
}
