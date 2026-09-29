import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const navigation = [
  { to: '/', label: 'Visão geral', icon: 'bi-grid-1x2-fill', end: true },
  { to: '/cursos', label: 'Cursos', icon: 'bi-play-btn-fill' },
  { to: '/trilhas', label: 'Trilhas', icon: 'bi-signpost-split-fill' },
  { to: '/aprendizagem', label: 'Aprendizagem', icon: 'bi-mortarboard-fill' },
  { to: '/usuarios', label: 'Pessoas', icon: 'bi-people-fill' },
  { to: '/financeiro', label: 'Financeiro', icon: 'bi-wallet2' },
];

export function AppShell() {
  const { session, logout } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <div className="app-layout">
      <aside className={`sidebar ${open ? 'is-open' : ''}`}>
        <div className="brand">
          <div className="brand-mark"><span>N</span></div>
          <div><strong>Nexo</strong><small>learning hub</small></div>
        </div>
        <nav className="side-nav" aria-label="Navegação principal">
          <span className="nav-label">Workspace</span>
          {navigation.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setOpen(false)}
              className={({ isActive }) => (isActive ? 'active' : '')}
            >
              <i className={`bi ${item.icon}`} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-insight">
          <span className="insight-icon"><i className="bi bi-lightning-charge-fill" /></span>
          <strong>Aprender transforma.</strong>
          <small>Organize conhecimento, acompanhe evolução.</small>
        </div>
        <div className="sidebar-user">
          <div className="avatar">{session?.email.charAt(0).toUpperCase()}</div>
          <div><strong>{session?.email.split('@')[0]}</strong><small>{session?.email}</small></div>
          <button onClick={logout} aria-label="Sair"><i className="bi bi-box-arrow-right" /></button>
        </div>
      </aside>
      {open && <button className="sidebar-backdrop" onClick={() => setOpen(false)} aria-label="Fechar menu" />}
      <main className="main-area">
        <div className="mobile-topbar">
          <button onClick={() => setOpen(true)} aria-label="Abrir menu"><i className="bi bi-list" /></button>
          <div className="brand brand--mobile"><div className="brand-mark"><span>N</span></div><strong>Nexo</strong></div>
          <div className="avatar avatar--small">{session?.email.charAt(0).toUpperCase()}</div>
        </div>
        <div className="content-wrap"><Outlet /></div>
      </main>
    </div>
  );
}
