import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { getAllPosts } from '../services/communityDataStore';
import CommunityPostCard from '../components/CommunityPostCard';
import CreatePostModal from '../components/CreatePostModal';
import FarmerGroupsSection from '../components/FarmerGroupsSection';
import LocalProblemsSection from '../components/LocalProblemsSection';

export default function CommunityPage() {
  const { currentLang, t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();

  // Core 3 Tabs per specification: 'FEED' | 'GROUPS' | 'PROBLEMS'
  const [activeTab, setActiveTab] = useState(() => {
    if (location.state?.targetTab) return location.state.targetTab;
    if (location.pathname.includes('/problems')) return 'PROBLEMS';
    return 'FEED';
  });

  const [posts, setPosts] = useState(() => getAllPosts());
  const [cropFilter, setCropFilter] = useState('ALL');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Sync state if navigation changes
  useEffect(() => {
    if (location.state?.targetTab) {
      setActiveTab(location.state.targetTab);
    }
  }, [location.state]);

  const refreshPosts = () => {
    setPosts(getAllPosts());
  };

  useEffect(() => {
    const handleStorageUpdate = () => {
      refreshPosts();
    };
    window.addEventListener('krishi_community_storage_updated', handleStorageUpdate);
    return () => window.removeEventListener('krishi_community_storage_updated', handleStorageUpdate);
  }, []);

  const filteredPosts = posts.filter((p) => {
    if (cropFilter === 'ALL') return true;
    return p.crop?.toLowerCase() === cropFilter.toLowerCase();
  });

  return (
    <div className="community-page-wrapper" data-testid="community-page">
      {/* 1. COMMUNITY MAIN HEADER */}
      <header className="community-main-header">
        <div className="header-brand-block">
          <div className="brand-pill">
            <span className="brand-emoji">🌾</span>
            <span>Krishi Sahayak Field Network</span>
          </div>
          <h1 className="community-page-title">Farmer Community</h1>
          <p className="community-page-subtitle">
            Farmer Experiences &bull; Local Field Problems &bull; Verified AEO Guidance
          </p>
        </div>

        <div className="header-right-actions">
          <div className="locality-pill" title="Your approximate detected agricultural mandal">
            <span>📍 Ghatkesar Mandal, Medchal–Malkajgiri</span>
          </div>

          <button
            type="button"
            className="btn btn-primary btn-create-community-post"
            onClick={() => setIsCreateModalOpen(true)}
            data-testid="open-create-post-modal-btn"
          >
            <span>＋ Share Problem / Create Post</span>
          </button>
        </div>
      </header>

      {/* 2. STRICTLY THREE CORE TABS NAVIGATION */}
      <nav className="community-navigation-tabs" aria-label="Community Core Tabs">
        <button
          type="button"
          className={`comm-tab-link ${activeTab === 'FEED' ? 'active' : ''}`}
          onClick={() => setActiveTab('FEED')}
          data-testid="tab-feed"
        >
          <span className="tab-icon">📰</span>
          <span className="tab-text">Community Feed</span>
        </button>

        <button
          type="button"
          className={`comm-tab-link ${activeTab === 'GROUPS' ? 'active' : ''}`}
          onClick={() => setActiveTab('GROUPS')}
          data-testid="tab-groups"
        >
          <span className="tab-icon">👥</span>
          <span className="tab-text">Farmer Groups</span>
        </button>

        <button
          type="button"
          className={`comm-tab-link ${activeTab === 'PROBLEMS' ? 'active' : ''}`}
          onClick={() => setActiveTab('PROBLEMS')}
          data-testid="tab-problems"
        >
          <span className="tab-icon">🔍</span>
          <span className="tab-text">Local Problems</span>
        </button>
      </nav>

      {/* 3. MAIN TAB CONTENT */}
      <main className="community-tab-content">
        {/* TAB 1: COMMUNITY FEED */}
        {activeTab === 'FEED' && (
          <section className="feed-view-section" data-testid="feed-view-section">
            {/* Quick summary banner */}
            <div className="feed-banner-card card">
              <div className="feed-banner-left">
                <span className="banner-emoji">💬</span>
                <div>
                  <h3>What are farmers experiencing and discussing?</h3>
                  <p>
                    Read proven treatments shared by fellow farmers in your area. Listen in your language or toggle original speech.
                  </p>
                </div>
              </div>

              {/* Quick Crop filter pills */}
              <div className="crop-filter-chips">
                {[
                  { label: 'All Crops', val: 'ALL' },
                  { label: '🍅 Tomato', val: 'Tomato' },
                  { label: '🌾 Rice', val: 'Rice' },
                  { label: '🌶️ Chilli', val: 'Chilli' },
                  { label: '🌿 Cotton', val: 'Cotton' },
                  { label: '🥭 Mango', val: 'Mango' },
                ].map((c) => (
                  <button
                    key={c.val}
                    type="button"
                    className={`btn-crop-chip ${cropFilter === c.val ? 'active' : ''}`}
                    onClick={() => setCropFilter(c.val)}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Posts Stream */}
            <div className="posts-stream">
              {filteredPosts.length === 0 ? (
                <div className="empty-community-state card">
                  <span>🌱 No posts found for {cropFilter}. Be the first to share an experience!</span>
                  <button
                    type="button"
                    className="btn btn-primary"
                    style={{ marginTop: '14px' }}
                    onClick={() => setIsCreateModalOpen(true)}
                  >
                    ＋ Share Problem / Create Post
                  </button>
                </div>
              ) : (
                filteredPosts.map((post) => (
                  <CommunityPostCard
                    key={post.id}
                    post={post}
                    onUpdate={refreshPosts}
                  />
                ))
              )}
            </div>
          </section>
        )}

        {/* TAB 2: FARMER GROUPS */}
        {activeTab === 'GROUPS' && <FarmerGroupsSection />}

        {/* TAB 3: LOCAL PROBLEMS */}
        {activeTab === 'PROBLEMS' && <LocalProblemsSection />}
      </main>

      {/* Create Post Modal */}
      <CreatePostModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreated={() => {
          refreshPosts();
          setActiveTab('FEED');
        }}
      />
    </div>
  );
}
