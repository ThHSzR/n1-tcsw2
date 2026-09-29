import { useState, useEffect } from 'react';
import { cursoService }                      from '../../services/cursoService';
import type { Curso }                        from '../../services/cursoService';
import { assinaturaService, planoService }   from '../../services/assinaturaService';
import type { Assinatura, Plano }            from '../../services/assinaturaService';
import { certificadoService }               from '../../services/certificadoService';

export function SGCursos() {
  const [cursos, setCursos]           = useState<Curso[]>([]);
  const [receitaMensal, setReceita]   = useState(0);
  const [assinaturasAtivas, setAtivas] = useState(0);
  const [totalCerts, setTotalCerts]   = useState(0);
  const [loading, setLoading]         = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [cs, assinaturas, planos, certs] = await Promise.all([
          cursoService.getAll(),
          assinaturaService.getAll(),
          planoService.getAll(),
          certificadoService.getAll(),
        ]);

        setCursos(cs);
        setTotalCerts(certs.length);

        const ativas = (assinaturas as Assinatura[]).filter(a => (a as unknown as { status: string }).status === 'ativa');
        setAtivas(ativas.length);

        const receita = ativas.reduce((acc, a) => {
          const plano = (planos as Plano[]).find(p => p.id === a.planoId);
          return acc + (plano?.preco ?? 0);
        }, 0);
        setReceita(receita);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const nivelColor = (n: string) => n === 'Iniciante' ? 'badge-success' : n === 'Intermediário' ? 'badge-warning' : 'badge-danger';

  const kpis = [
    { label: 'Cursos cadastrados',      value: loading ? '—' : String(cursos.length),           icon: 'bi-mortarboard',     color: 'var(--info)' },
    { label: 'Assinaturas ativas',      value: loading ? '—' : String(assinaturasAtivas),        icon: 'bi-person-check',    color: 'var(--primary)' },
    { label: 'Receita (assin. ativas)', value: loading ? '—' : `R$ ${receitaMensal.toFixed(2)}`, icon: 'bi-currency-dollar', color: 'var(--success)' },
    { label: 'Certificados emitidos',   value: loading ? '—' : String(totalCerts),              icon: 'bi-patch-check',     color: 'var(--warning)' },
  ];

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Visão Geral</h1>
          <p className="page-subtitle">Métricas e resumo da plataforma</p>
        </div>
      </div>

      <div className="stat-grid" style={{ marginBottom: 24 }}>
        {kpis.map(i => (
          <div className="stat-card" key={i.label}>
            <div className="stat-icon" style={{ background: 'var(--surface-3)', color: i.color }}>
              <i className={`bi ${i.icon}`}></i>
            </div>
            <div>
              <div className="stat-value">{i.value}</div>
              <div style={{ marginTop: 4 }}>
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{i.label}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="table-wrapper">
        <div className="table-toolbar">
          <span className="table-toolbar-title">Cursos cadastrados</span>
        </div>
        <table>
          <thead>
            <tr>
              <th>Curso</th>
              <th>Horas</th>
              <th>Nível</th>
            </tr>
          </thead>
          <tbody>
            {loading
              ? <tr><td colSpan={3} className="table-empty"><i className="bi bi-arrow-repeat"></i><p>Carregando...</p></td></tr>
              : cursos.length === 0
                ? <tr><td colSpan={3} className="table-empty"><i className="bi bi-inbox"></i><p>Nenhum curso</p></td></tr>
                : cursos.map(c => (
                  <tr key={c.id}>
                    <td style={{ fontWeight: 500 }}>{c.titulo}</td>
                    <td className="td-muted">{c.totalHoras}h</td>
                    <td><span className={`badge ${nivelColor(c.nivel)}`}>{c.nivel}</span></td>
                  </tr>
                ))
            }
          </tbody>
        </table>
      </div>
    </div>
  );
}
