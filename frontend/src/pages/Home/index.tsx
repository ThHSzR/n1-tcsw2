import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { trilhaService }      from '../../services/trilhaService';
import { cursoService }       from '../../services/cursoService';
import { moduloService }      from '../../services/moduloService';
import { aulaService }        from '../../services/aulaService';
import { usuarioService }     from '../../services/usuarioService';
import { certificadoService } from '../../services/certificadoService';
import { assinaturaService }  from '../../services/assinaturaService';
import type { Assinatura }    from '../../services/assinaturaService';

interface Stats {
  trilhas:      number;
  cursos:       number;
  modulos:      number;
  aulas:        number;
  usuarios:     number;
  certificados: number;
  assinaturasAtivas: number;
}

const shortcuts = [
  { to: '/trilhas',      label: 'Trilhas',      icon: 'bi-signpost-split', color: 'var(--primary)' },
  { to: '/cursos',       label: 'Cursos',       icon: 'bi-mortarboard',    color: 'var(--info)' },
  { to: '/modulos',      label: 'Módulos',      icon: 'bi-collection',     color: 'var(--success)' },
  { to: '/aulas',        label: 'Aulas',        icon: 'bi-play-circle',    color: 'var(--warning)' },
  { to: '/usuarios',     label: 'Usuários',     icon: 'bi-people',         color: 'var(--primary)' },
  { to: '/assinaturas',  label: 'Assinaturas',  icon: 'bi-credit-card',    color: 'var(--danger)' },
  { to: '/certificados', label: 'Certificados', icon: 'bi-patch-check',    color: 'var(--success)' },
];

export function Home() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [trilhas, cursos, modulos, aulas, usuarios, certificados, assinaturas] =
          await Promise.all([
            trilhaService.getAll(),
            cursoService.getAll(),
            moduloService.getAll(),
            aulaService.getAll(),
            usuarioService.getAll(),
            certificadoService.getAll(),
            assinaturaService.getAll(),
          ]);
        setStats({
          trilhas:           trilhas.length,
          cursos:            cursos.length,
          modulos:           modulos.length,
          aulas:             aulas.length,
          usuarios:          usuarios.length,
          certificados:      certificados.length,
          assinaturasAtivas: (assinaturas as Assinatura[]).filter(
            a => (a as unknown as { status: string }).status === 'ativa'
          ).length,
        });
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const cards = stats ? [
    { label: 'Trilhas',            value: stats.trilhas,           icon: 'bi-signpost-split', color: 'var(--primary)',  bg: 'var(--primary-light)' },
    { label: 'Cursos',             value: stats.cursos,            icon: 'bi-mortarboard',    color: 'var(--info)',     bg: 'var(--info-light)' },
    { label: 'Módulos',            value: stats.modulos,           icon: 'bi-collection',     color: 'var(--success)',  bg: 'var(--success-light)' },
    { label: 'Aulas',              value: stats.aulas,             icon: 'bi-play-circle',    color: 'var(--warning)',  bg: 'var(--warning-light)' },
    { label: 'Usuários',           value: stats.usuarios,          icon: 'bi-people',         color: 'var(--primary)',  bg: 'var(--primary-light)' },
    { label: 'Certificados',       value: stats.certificados,      icon: 'bi-patch-check',    color: 'var(--success)',  bg: 'var(--success-light)' },
    { label: 'Assinaturas Ativas', value: stats.assinaturasAtivas, icon: 'bi-credit-card',    color: 'var(--danger)',   bg: 'var(--danger-light)' },
  ] : [];

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Bem-vindo 👋</h1>
          <p className="page-subtitle">Visão geral da plataforma SG Cursos</p>
        </div>
      </div>

      <div className="stat-grid">
        {loading
          ? Array.from({ length: 7 }).map((_, i) => (
              <div className="stat-card" key={i} style={{ opacity: 0.4 }}>
                <div className="stat-icon" style={{ background: 'var(--surface-2)', color: 'transparent' }}>
                  <i className="bi bi-circle"></i>
                </div>
                <div>
                  <div className="stat-value">—</div>
                  <div className="stat-label">carregando...</div>
                </div>
              </div>
            ))
          : cards.map(s => (
              <div className="stat-card" key={s.label}>
                <div className="stat-icon" style={{ background: s.bg, color: s.color }}>
                  <i className={`bi ${s.icon}`}></i>
                </div>
                <div>
                  <div className="stat-value">{s.value}</div>
                  <div className="stat-label">{s.label}</div>
                </div>
              </div>
            ))
        }
      </div>

      <div className="card">
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>Acesso rápido</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Navegue para qualquer módulo</div>
        </div>
        <div className="quick-grid">
          {shortcuts.map(s => (
            <NavLink to={s.to} className="quick-card" key={s.to}>
              <i className={`bi ${s.icon}`} style={{ color: s.color }}></i>
              <span>{s.label}</span>
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  );
}
