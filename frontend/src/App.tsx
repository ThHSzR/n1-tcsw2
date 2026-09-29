import { BrowserRouter, Routes, Route, NavLink, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { Home }         from './pages/Home';
import { SGCursos }     from './pages/SGCursos';
import { Trilhas }      from './pages/Trilhas';
import { Cursos }       from './pages/Cursos';
import { Modulos }      from './pages/Modulos';
import { Aulas }        from './pages/Aulas';
import { Categorias }   from './pages/Categorias';
import { Niveis }       from './pages/Niveis';
import { Instrutores }  from './pages/Instrutores';
import { Usuarios }     from './pages/Usuarios';
import { Matriculas }   from './pages/Matriculas';
import { Assinaturas }  from './pages/Assinaturas';
import { Pagamentos }   from './pages/Pagamentos';
import { Certificados } from './pages/Certificados';
import { Avaliacoes }   from './pages/Avaliacoes';
import { Planos }       from './pages/Planos';
import { Login }        from './pages/Login';
import { useAuth }      from './context/AuthContext';

const navItems = [
  { section: 'Geral' },
  { to: '/',             label: 'Dashboard',   icon: 'bi-grid-1x2' },
  { to: '/sgcursos',     label: 'Visão Geral',  icon: 'bi-bar-chart' },
  { section: 'Conteúdo' },
  { to: '/categorias',   label: 'Categorias',   icon: 'bi-tag' },
  { to: '/niveis',       label: 'Níveis',       icon: 'bi-layers' },
  { to: '/trilhas',      label: 'Trilhas',      icon: 'bi-signpost-split' },
  { to: '/cursos',       label: 'Cursos',       icon: 'bi-mortarboard' },
  { to: '/modulos',      label: 'Módulos',      icon: 'bi-collection' },
  { to: '/aulas',        label: 'Aulas',        icon: 'bi-play-circle' },
  { section: 'Pessoas' },
  { to: '/instrutores',  label: 'Instrutores',  icon: 'bi-person-badge' },
  { to: '/usuarios',     label: 'Usuários',     icon: 'bi-people' },
  { to: '/matriculas',   label: 'Matrículas',   icon: 'bi-person-check' },
  { to: '/avaliacoes',   label: 'Avaliações',   icon: 'bi-star' },
  { to: '/certificados', label: 'Certificados', icon: 'bi-patch-check' },
  { section: 'Financeiro' },
  { to: '/planos',       label: 'Planos',       icon: 'bi-card-list' },
  { to: '/assinaturas',  label: 'Assinaturas',  icon: 'bi-credit-card' },
  { to: '/pagamentos',   label: 'Pagamentos',   icon: 'bi-cash-stack' },
];

const pageTitles: Record<string, string> = {
  '/':             'Dashboard',
  '/sgcursos':     'Visão Geral',
  '/categorias':   'Categorias',
  '/niveis':       'Níveis',
  '/trilhas':      'Trilhas',
  '/cursos':       'Cursos',
  '/modulos':      'Módulos',
  '/aulas':        'Aulas',
  '/instrutores':  'Instrutores',
  '/usuarios':     'Usuários',
  '/matriculas':   'Matrículas',
  '/avaliacoes':   'Avaliações',
  '/certificados': 'Certificados',
  '/planos':       'Planos',
  '/assinaturas':  'Assinaturas',
  '/pagamentos':   'Pagamentos',
};

function Layout() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const title = pageTitles[location.pathname] ?? 'SG Cursos';
  const { session, logout } = useAuth();
  const initials = session?.email.slice(0, 2).toUpperCase() ?? 'SG';

  return (
    <div className="app-layout">
      <button className="sidebar-toggle" onClick={() => setOpen(o => !o)}>
        <i className={`bi ${open ? 'bi-x-lg' : 'bi-list'}`}></i>
      </button>

      {open && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 99, background: 'rgba(0,0,0,0.5)' }}
          onClick={() => setOpen(false)}
        />
      )}

      <aside className={`sidebar ${open ? 'open' : ''}`}>
        <NavLink to="/" className="sidebar-logo" onClick={() => setOpen(false)}>
          <div className="sidebar-logo-icon"><i className="bi bi-mortarboard-fill" style={{ color: '#fff' }}></i></div>
          <span className="sidebar-logo-text">SG<span>Cursos</span></span>
        </NavLink>

        <nav className="sidebar-nav">
          {navItems.map((item, i) =>
            'section' in item ? (
              <div key={i} className="sidebar-section-label">{item.section}</div>
            ) : (
              <NavLink
                key={item.to}
                to={item.to!}
                end={item.to === '/'}
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                onClick={() => setOpen(false)}
              >
                <i className={`bi ${item.icon}`}></i>
                {item.label}
              </NavLink>
            )
          )}
        </nav>

        <div className="sidebar-footer">
          <button className="sidebar-link" type="button" onClick={logout}>
            <i className="bi bi-box-arrow-left"></i>
            Sair
          </button>
          <div className="sidebar-version">SG Cursos v1.0 &middot; 2026</div>
        </div>
      </aside>

      <div className="main-content">
        <header className="topbar">
          <span className="topbar-title">{title}</span>
          <div className="topbar-right">
            <span className="topbar-email">{session?.email}</span>
            <div className="topbar-avatar" title={session?.email}>{initials}</div>
          </div>
        </header>

        <Routes>
          <Route path="/"             element={<Home />} />
          <Route path="/sgcursos"     element={<SGCursos />} />
          <Route path="/categorias"   element={<Categorias />} />
          <Route path="/niveis"       element={<Niveis />} />
          <Route path="/trilhas"      element={<Trilhas />} />
          <Route path="/cursos"       element={<Cursos />} />
          <Route path="/modulos"      element={<Modulos />} />
          <Route path="/aulas"        element={<Aulas />} />
          <Route path="/instrutores"  element={<Instrutores />} />
          <Route path="/usuarios"     element={<Usuarios />} />
          <Route path="/matriculas"   element={<Matriculas />} />
          <Route path="/avaliacoes"   element={<Avaliacoes />} />
          <Route path="/certificados" element={<Certificados />} />
          <Route path="/planos"       element={<Planos />} />
          <Route path="/assinaturas"  element={<Assinaturas />} />
          <Route path="/pagamentos"   element={<Pagamentos />} />
        </Routes>
      </div>
    </div>
  );
}

export function App() {
  const { session } = useAuth();

  return (
    <BrowserRouter>
      {session ? <Layout /> : <Login />}
    </BrowserRouter>
  );
}
