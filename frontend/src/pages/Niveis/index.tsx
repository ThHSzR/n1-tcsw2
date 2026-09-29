import { useEffect, useState } from 'react';
import type { Nivel } from '../../services/nivelService';
import { nivelService } from '../../services/nivelService';

const descriptions: Record<string, string> = {
  Iniciante: 'Conteúdo introdutório, sem pré-requisitos.',
  Intermediário: 'Conteúdo para quem já domina os fundamentos.',
  Avançado: 'Conteúdo aprofundado e especializado.',
};

export function Niveis() {
  const [niveis, setNiveis] = useState<Nivel[]>([]);

  useEffect(() => { nivelService.getAll().then(setNiveis); }, []);

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Níveis</h1>
          <p className="page-subtitle">Valores definidos pelo enum NivelCurso do Prisma</p>
        </div>
      </div>
      <div className="level-grid">
        {niveis.map((nivel, index) => (
          <article className="card level-card" key={nivel.id}>
            <span className={`stat-icon ${index === 0 ? 'icon-green' : index === 1 ? 'icon-yellow' : 'icon-red'}`}>
              <i className={`bi ${index === 0 ? 'bi-sunrise' : index === 1 ? 'bi-bar-chart-steps' : 'bi-rocket-takeoff'}`} />
            </span>
            <div><h2>{nivel.nome}</h2><p>{descriptions[nivel.nome]}</p></div>
          </article>
        ))}
      </div>
    </div>
  );
}
