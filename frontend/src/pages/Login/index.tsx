import { useState } from 'react';
import { ApiError } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';

export function Login() {
  const { login, register, loading } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [nomeCompleto, setNomeCompleto] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    try {
      if (mode === 'register') await register(nomeCompleto, email, senha);
      else await login(email, senha);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Não foi possível entrar. Verifique a API.');
    }
  };

  const changeMode = () => {
    setMode(current => current === 'login' ? 'register' : 'login');
    setError('');
  };

  return (
    <main className="auth-page">
      <section className="auth-hero">
        <div className="auth-brand-icon"><i className="bi bi-mortarboard-fill" /></div>
        <p className="auth-eyebrow">Plataforma de aprendizagem</p>
        <h1>Gestão de cursos, do conteúdo ao certificado.</h1>
        <p>Administre a jornada completa dos alunos em uma interface integrada à API NestJS.</p>
        <div className="auth-features">
          <span><i className="bi bi-check-circle-fill" /> Catálogo e trilhas</span>
          <span><i className="bi bi-check-circle-fill" /> Matrículas e avaliações</span>
          <span><i className="bi bi-check-circle-fill" /> Planos e pagamentos</span>
        </div>
      </section>

      <section className="auth-panel">
        <div className="auth-card">
          <div className="auth-logo">
            <div className="sidebar-logo-icon"><i className="bi bi-mortarboard-fill" /></div>
            <span className="sidebar-logo-text">SG<span>Cursos</span></span>
          </div>
          <h2>{mode === 'login' ? 'Boas-vindas' : 'Crie sua conta'}</h2>
          <p className="auth-subtitle">
            {mode === 'login' ? 'Entre para acessar o painel da plataforma.' : 'Cadastre-se e comece a gerenciar os cursos.'}
          </p>

          <form className="auth-form" onSubmit={submit}>
            {mode === 'register' && (
              <div className="field">
                <label htmlFor="nome">Nome completo</label>
                <input id="nome" className="input" value={nomeCompleto} onChange={e => setNomeCompleto(e.target.value)} required />
              </div>
            )}
            <div className="field">
              <label htmlFor="email">E-mail</label>
              <input id="email" className="input" type="email" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div className="field">
              <label htmlFor="senha">Senha</label>
              <input id="senha" className="input" type="password" minLength={6} value={senha} onChange={e => setSenha(e.target.value)} required />
            </div>
            {error && <div className="auth-error"><i className="bi bi-exclamation-circle" /> {error}</div>}
            <button className="btn btn-primary auth-submit" type="submit" disabled={loading}>
              {loading ? <><span className="spinner-border spinner-small" /> Aguarde...</> : mode === 'login' ? 'Entrar' : 'Criar conta'}
            </button>
          </form>

          <button className="auth-switch" type="button" onClick={changeMode}>
            {mode === 'login' ? 'Ainda não tem conta? Cadastre-se' : 'Já tem uma conta? Entrar'}
          </button>
        </div>
      </section>
    </main>
  );
}
