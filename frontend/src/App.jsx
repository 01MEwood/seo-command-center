// ═══════════════════════════════════════════════════════════════════
// SEO Command Center v5.0
// Schreinerhelden GmbH & Co. KG — seo.meosapp.de
// ═══════════════════════════════════════════════════════════════════
import { useState } from 'react';
import { useAuth } from './hooks/useAuth';
import LoginScreen from './components/LoginScreen';
import Layout from './components/Layout';
import Dashboard from './modules/Dashboard';
import Analyse from './modules/Analyse';
import Keywords from './modules/Keywords';
import Content from './modules/Content';
import Tracking from './modules/Tracking';
import Settings from './modules/Settings';

export default function App() {
  const { user, login, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  if (!user) return <LoginScreen onLogin={login} />;

  const modules = {
    dashboard: Dashboard,
    analyse: Analyse,
    keywords: Keywords,
    content: Content,
    tracking: Tracking,
    settings: Settings,
  };

  const Module = modules[activeTab] || Dashboard;

  return (
    <Layout activeTab={activeTab} onNav={setActiveTab} user={user} onLogout={logout}>
      <Module onNavigate={setActiveTab} />
    </Layout>
  );
}
