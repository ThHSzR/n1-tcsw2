import { type FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ErrorAlert } from '../components/Feedback';
import { api, ApiError } from '../lib/api';

export function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ nomeCompleto: '', email: '', senha: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function submit(event: FormEvent) {
    event.preventDefault(); setSaving(true); setError('');
    try {
      await api('/usuarios', { method: 'POST', body: JSON.stringify(form) });
      navigate('/login', { state: { created: true } });
    } catch (reason) {
      setError(reason instanceof ApiError ? reason.message : 'Não foi possível criar a conta');
    } finally { setSaving(false); }
  }

  return (
    <div className="auth-page auth-page--register">
      <section className="auth-visual">
        <div className="auth-brand"><div className="brand-mark"><span>N</span></div><strong>Nexo</strong></div>
        <div className="visual-copy"><span className="eyebrow eyebrow--light">Comece hoje</span><h1>Seu próximo nível<br /><em>começa aqui.</em></h1><p>Crie sua conta e conecte-se a cursos, trilhas e pessoas que compartilham a vontade de evoluir.</p></div>
        <div className="quote-card"><i className="bi bi-quote" /><p>O investimento em conhecimento sempre paga os melhores juros.</p><span>Benjamin Franklin</span></div>
      </section>
      <section className="auth-form-side">
        <form className="auth-form" onSubmit={submit}>
          <div className="auth-form-heading"><span>Junte-se à comunidade</span><h2>Crie sua conta</h2><p>Leva menos de um minuto.</p></div>
          {error && <ErrorAlert message={error} />}
          <label className="form-label">Nome completo</label><input className="form-control" placeholder="Como podemos chamar você?" value={form.nomeCompleto} onChange={(e) => setForm({ ...form, nomeCompleto: e.target.value })} required />
          <label className="form-label">E-mail</label><input className="form-control" type="email" placeholder="voce@email.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          <label className="form-label">Senha</label><input className="form-control" type="password" placeholder="Mínimo de 6 caracteres" minLength={6} value={form.senha} onChange={(e) => setForm({ ...form, senha: e.target.value })} required />
          <button className="btn btn-primary btn-lg w-100 mt-2" disabled={saving}>{saving ? 'Criando conta...' : 'Criar minha conta'}</button>
          <p className="auth-switch">Já possui uma conta? <Link to="/login">Entrar</Link></p>
        </form>
      </section>
    </div>
  );
}
