import { type FormEvent, useState } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ApiError } from '../lib/api';
import { ErrorAlert } from '../components/Feedback';

export function LoginPage() {
  const { session, login, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const location = useLocation();

  if (session) {
    const destination = (location.state as { from?: string } | null)?.from ?? '/';
    return <Navigate to={destination} replace />;
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError('');
    try {
      await login(email, senha);
    } catch (reason) {
      setError(reason instanceof ApiError ? reason.message : 'Não foi possível entrar');
    }
  }

  return (
    <div className="auth-page">
      <section className="auth-visual">
        <div className="auth-brand"><div className="brand-mark"><span>N</span></div><strong>Nexo</strong></div>
        <div className="visual-copy">
          <span className="eyebrow eyebrow--light">Conhecimento em movimento</span>
          <h1>Aprenda. Ensine.<br /><em>Evolua.</em></h1>
          <p>Uma plataforma completa para transformar conteúdo em experiências de aprendizagem memoráveis.</p>
        </div>
        <div className="visual-orbit orbit-one" />
        <div className="visual-orbit orbit-two" />
        <div className="floating-card floating-card--one"><i className="bi bi-play-fill" /><span><strong>42</strong><small>aulas concluídas</small></span></div>
        <div className="floating-card floating-card--two"><i className="bi bi-graph-up-arrow" /><span><strong>+28%</strong><small>progresso este mês</small></span></div>
      </section>
      <section className="auth-form-side">
        <form className="auth-form" onSubmit={submit}>
          <div className="auth-form-heading"><span>Bem-vindo de volta</span><h2>Entre na sua conta</h2><p>Continue de onde parou e mantenha o ritmo.</p></div>
          {error && <ErrorAlert message={error} />}
          <label className="form-label">E-mail</label>
          <div className="input-icon"><i className="bi bi-envelope" /><input className="form-control" type="email" placeholder="voce@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required /></div>
          <div className="d-flex justify-content-between"><label className="form-label">Senha</label></div>
          <div className="input-icon"><i className="bi bi-lock" /><input className="form-control" type={showPassword ? 'text' : 'password'} placeholder="Sua senha" value={senha} onChange={(e) => setSenha(e.target.value)} minLength={6} required /><button type="button" onClick={() => setShowPassword((value) => !value)}><i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`} /></button></div>
          <button className="btn btn-primary btn-lg w-100 mt-2" disabled={loading}>{loading ? <><span className="spinner-border spinner-border-sm me-2" />Entrando</> : <>Entrar <i className="bi bi-arrow-right ms-2" /></>}</button>
          <p className="auth-switch">Ainda não tem uma conta? <Link to="/cadastro">Criar conta</Link></p>
        </form>
      </section>
    </div>
  );
}
