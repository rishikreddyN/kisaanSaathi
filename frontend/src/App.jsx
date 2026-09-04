import React, { useState, useEffect } from 'react';
import { Routes, Route, NavLink, Link, useLocation, useNavigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import FarmerPage from './pages/FarmerPage';
import OfficerLoginPage from './pages/OfficerLoginPage';
import AeoDashboard from './pages/AeoDashboard';
import CommunityPage from './pages/CommunityPage';
import MyIssuesPage from './pages/MyIssuesPage';
import PlanMyCropPage from './pages/PlanMyCropPage';
import LanguageSelector from './components/LanguageSelector';
import AuthModal from './components/AuthModal';
import { LanguageProvider, useLanguage } from './context/LanguageContext';

function MainLayout() {
  const { t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();

  const isAeoRoute = location.pathname.startsWith('/aeo') || location.pathname.startsWith('/dashboard');

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authSession, setAuthSession] = useState(() => {
    try {
      const farmer = JSON.parse(localStorage.getItem('kisaansathi_farmer_profile') || 'null');
      const officer = JSON.parse(localStorage.getItem('aeo_officer_session') || 'null');
      return { farmer, officer };
    } catch {
      return { farmer: null, officer: null };
    }
  });

  const syncAuth = () => {
    try {
      const farmer = JSON.parse(localStorage.getItem('kisaansathi_farmer_profile') || 'null');
      const officer = JSON.parse(localStorage.getItem('aeo_officer_session') || 'null');
      setAuthSession({ farmer, officer });
    } catch {
      setAuthSession({ farmer: null, officer: null });
    }
  };

  useEffect(() => {
    window.addEventListener('storage', syncAuth);
    window.addEventListener('kisaansathi_auth_changed', syncAuth);
    return () => {
      window.removeEventListener('storage', syncAuth);
      window.removeEventListener('kisaansathi_auth_changed', syncAuth);
    };
  }, []);

  const handleFarmerLogout = () => {
    localStorage.removeItem('kisaansathi_farmer_profile');
    window.dispatchEvent(new Event('kisaansathi_auth_changed'));
    syncAuth();
  };

  const handleOfficerLogout = () => {
    localStorage.removeItem('aeo_officer_session');
    window.dispatchEvent(new Event('kisaansathi_auth_changed'));
    syncAuth();
    navigate('/officer-login');
  };

  return (
    <div className="app-container">
      {/* Universal Login Modal */}
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />

      {/* Navigation Bar: If on AEO Workspace, show ONLY dedicated AEO header with Logout */}
      {isAeoRoute ? (
        <header
          className="navbar aeo-navbar"
          style={{
            backgroundColor: '#0f172a',
            color: '#ffffff',
            padding: '14px 28px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid #1e293b',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <span style={{ fontSize: '1.5rem' }}>🏛️</span>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontWeight: '800', fontSize: '1.05rem', color: '#ffffff', letterSpacing: '-0.01em' }}>
                  KisaanSaathi
                </span>
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: '700',
                    color: '#86efac',
                    backgroundColor: 'rgba(22, 163, 74, 0.2)',
                    border: '1px solid rgba(134, 239, 172, 0.3)',
                    padding: '2px 8px',
                    borderRadius: '6px',
                  }}
                >
                  AEO Workspace
                </span>
              </div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '2px' }}>
                Officer: {authSession.officer?.name || 'Srinivas Rao'} ({authSession.officer?.officer_id || 'AEO001'}) &bull; Department of Agriculture
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              type="button"
              className="btn btn-sm btn-navbar-logout"
              onClick={handleOfficerLogout}
              data-testid="navbar-logout-btn"
              style={{
                backgroundColor: '#dc2626',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                padding: '8px 20px',
                fontWeight: '700',
                fontSize: '0.85rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 2px 8px rgba(220, 38, 38, 0.35)',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#b91c1c')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#dc2626')}
            >
              <span>🚪</span> Logout
            </button>
          </div>
        </header>
      ) : (
        /* Regular Farmer Navigation Bar */
        <header className="navbar">
          <div className="navbar-left">
            <Link to="/" className="navbar-brand">
              <span className="brand-logo">🌱</span>
              <span className="brand-name">{t.appName || 'KisaanSathi'}</span>
            </Link>

            <nav className="nav-links">
              <NavLink
                to="/my-issues"
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                📋 My Issues
              </NavLink>
              <NavLink
                to="/community"
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                👥 Community
              </NavLink>
              <NavLink
                to="/plan-my-crop"
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                🌱 Plan My Crop
              </NavLink>
              <Link
                to="/report"
                className="nav-link nav-link-highlight"
              >
                Report a Problem
              </Link>
            </nav>
          </div>

          <div className="navbar-right">
            {/* Multi-language Selector */}
            <LanguageSelector />

            {authSession.farmer?.name ? (
              <div className="navbar-user-group" data-testid="navbar-farmer-group">
                <Link to="/my-issues" className="navbar-user-chip" title="View my issues">
                  <span className="navbar-user-avatar">
                    {(authSession.farmer.name || 'F').charAt(0).toUpperCase()}
                  </span>
                  <span className="navbar-user-name">{authSession.farmer.name}</span>
                </Link>
                <button
                  type="button"
                  className="btn btn-sm btn-navbar-logout"
                  onClick={handleFarmerLogout}
                  title="Logout from farmer account"
                  data-testid="navbar-logout-btn"
                >
                  Logout
                </button>
              </div>
            ) : authSession.officer?.officer_id ? (
              <div className="navbar-user-group" data-testid="navbar-officer-group">
                <Link to="/aeo" className="navbar-user-chip navbar-officer-chip" title="Officer dashboard">
                  <span className="navbar-user-avatar">🏛️</span>
                  <span className="navbar-user-name">{authSession.officer.officer_id}</span>
                </Link>
                <button
                  type="button"
                  className="btn btn-sm btn-navbar-logout"
                  onClick={handleOfficerLogout}
                  title="Logout from officer session"
                  data-testid="navbar-logout-btn"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                type="button"
                className="btn btn-navbar-login"
                onClick={() => setIsAuthModalOpen(true)}
                data-testid="navbar-login-btn"
              >
                Login
              </button>
            )}
          </div>
        </header>
      )}

      {/* Main Content */}
      <main className="main-content">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/report" element={<FarmerPage />} />
          <Route path="/farmer" element={<FarmerPage />} />
          <Route path="/community" element={<CommunityPage />} />
          <Route path="/my-issues" element={<MyIssuesPage />} />
          <Route path="/community/problems/:problemId" element={<CommunityPage />} />
          <Route path="/plan-my-crop" element={<PlanMyCropPage />} />
          <Route path="/officer-login" element={<OfficerLoginPage />} />
          <Route path="/aeo" element={<AeoDashboard />} />
          <Route path="/dashboard" element={<AeoDashboard />} />
        </Routes>
      </main>

      {/* Footer (hidden on AEO workspace) */}
      {!isAeoRoute && (
        <footer className="footer">
          <div className="footer-content">
            <div className="footer-brand">
              <span className="brand-logo">🌱</span>
              <strong>{t.appName || 'KisaanSathi'}</strong>
              <span className="footer-tagline">&mdash; {t.footerTitle}</span>
            </div>
            <p className="footer-subtext">
              {t.footerSubtext}
            </p>
            <div className="footer-links">
              <Link to="/">{t.navHome}</Link>
              <Link to="/report">{t.navReport}</Link>
              <Link to="/officer-login">{t.navOfficerLogin}</Link>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <MainLayout />
    </LanguageProvider>
  );
}
