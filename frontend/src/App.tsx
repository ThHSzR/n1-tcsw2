import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { AppShell } from './components/AppShell';
import { useAuth } from './context/AuthContext';
import { AprendizagemPage } from './pages/AprendizagemPage';
import { CursosPage } from './pages/CursosPage';
import { DashboardPage } from './pages/DashboardPage';
import { FinanceiroPage } from './pages/FinanceiroPage';
import { LoginPage } from './pages/LoginPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { RegisterPage } from './pages/RegisterPage';
import { TrilhasPage } from './pages/TrilhasPage';
import { UsuariosPage } from './pages/UsuariosPage';

function ProtectedLayout() {
  const { session } = useAuth();
  const location = useLocation();
  return session ? <AppShell /> : <Navigate to="/login" replace state={{ from: location.pathname }} />;
}

export default function App() {
  return <Routes><Route path="/login" element={<LoginPage />} /><Route path="/cadastro" element={<RegisterPage />} /><Route element={<ProtectedLayout />}><Route index element={<DashboardPage />} /><Route path="cursos" element={<CursosPage />} /><Route path="trilhas" element={<TrilhasPage />} /><Route path="aprendizagem" element={<AprendizagemPage />} /><Route path="usuarios" element={<UsuariosPage />} /><Route path="financeiro" element={<FinanceiroPage />} /></Route><Route path="*" element={<NotFoundPage />} /></Routes>;
}
