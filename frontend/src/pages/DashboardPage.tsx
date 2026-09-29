import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ErrorAlert, LoadingState, PageHeader } from '../components/Feedback';
import { useAuth } from '../context/AuthContext';
import { api } from '../lib/api';
import type { Categoria, Curso, Matricula, Paginated, Plano, Usuario } from '../types';

interface DashboardData {
  usuarios: Usuario[];
  cursos: Paginated<Curso>;
  categorias: Categoria[];
  matriculas: Matricula[];
  planos: Plano[];
}

const accents = ['coral', 'lime', 'blue', 'violet'];

export function DashboardPage() {
  const { session } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([
      api<Usuario[]>('/usuarios'), api<Paginated<Curso>>('/cursos?limite=4'),
      api<Categoria[]>('/categorias'), api<Matricula[]>('/matriculas'), api<Plano[]>('/planos'),
    ]).then(([usuarios, cursos, categorias, matriculas, planos]) => setData({ usuarios, cursos, categorias, matriculas, planos }))
      .catch((reason: Error) => setError(reason.message));
  }, []);

  const firstName =
    data?.usuarios
      .find((usuario) => usuario.idUsuario === session?.idUsuario)
      ?.nomeCompleto.split(' ')[0] ?? session?.email.split('@')[0] ?? 'por aqui';
  const completed = data?.matriculas.filter((item) => item.dataConclusao).length ?? 0;

  return (
    <>
      <PageHeader eyebrow="Visão geral" title={`Olá, ${firstName}!`} description="Acompanhe o pulso da sua plataforma e continue fazendo conhecimento circular." action={<Link to="/cursos" className="btn btn-dark"><i className="bi bi-plus-lg me-2" />Novo curso</Link>} />
      {error && <ErrorAlert message={error} />}
      {!data ? <LoadingState /> : (
        <>
          <section className="metric-grid">
            <Metric icon="bi-play-btn" value={data.cursos.total} label="Cursos ativos" accent="lime" trend="Catálogo completo" />
            <Metric icon="bi-people" value={data.usuarios.length} label="Pessoas" accent="blue" trend="Comunidade Nexo" />
            <Metric icon="bi-mortarboard" value={data.matriculas.length} label="Matrículas" accent="coral" trend={`${completed} concluídas`} />
            <Metric icon="bi-tags" value={data.categorias.length} label="Categorias" accent="violet" trend={`${data.planos.length} planos disponíveis`} />
          </section>
          <div className="dashboard-grid">
            <section className="panel panel--wide">
              <div className="panel-heading"><div><span className="eyebrow">Em destaque</span><h2>Cursos recentes</h2></div><Link to="/cursos">Ver todos <i className="bi bi-arrow-right" /></Link></div>
              <div className="course-mini-list">
                {data.cursos.dados.length ? data.cursos.dados.map((curso, index) => (
                  <div className="course-mini" key={curso.idCurso}>
                    <div className={`course-symbol ${accents[index % accents.length]}`}><i className={`bi ${index % 2 ? 'bi-code-slash' : 'bi-lightbulb'}`} /></div>
                    <div className="course-mini__body"><span>{curso.categoria.nome}</span><strong>{curso.titulo}</strong><small>{curso.instrutor.nomeCompleto} · {curso.totalAulas} aulas</small></div>
                    <div className="mini-progress"><span>{curso.nivel.toLowerCase()}</span><i className="bi bi-chevron-right" /></div>
                  </div>
                )) : <p className="text-secondary mb-0">Cadastre o primeiro curso para começar.</p>}
              </div>
            </section>
            <section className="panel activity-panel">
              <div className="panel-heading"><div><span className="eyebrow">Atividade</span><h2>Resumo acadêmico</h2></div></div>
              <div className="completion-ring" style={{ '--progress': `${data.matriculas.length ? Math.round((completed / data.matriculas.length) * 100) : 0}%` } as React.CSSProperties}><div><strong>{data.matriculas.length ? Math.round((completed / data.matriculas.length) * 100) : 0}%</strong><span>conclusão</span></div></div>
              <div className="legend-row"><span><i className="dot dot--lime" />Concluídas</span><strong>{completed}</strong></div>
              <div className="legend-row"><span><i className="dot dot--dark" />Em andamento</span><strong>{data.matriculas.length - completed}</strong></div>
              <Link to="/aprendizagem" className="btn btn-soft w-100 mt-3">Ver aprendizagem</Link>
            </section>
          </div>
        </>
      )}
    </>
  );
}

function Metric({ icon, value, label, accent, trend }: { icon: string; value: number; label: string; accent: string; trend: string }) {
  return <article className="metric-card"><div className={`metric-icon ${accent}`}><i className={`bi ${icon}`} /></div><div><strong>{value.toString().padStart(2, '0')}</strong><span>{label}</span><small>{trend}</small></div></article>;
}
