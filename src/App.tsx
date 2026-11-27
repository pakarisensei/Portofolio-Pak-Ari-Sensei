/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import { AdminCmsModal, AdminTab } from './components/AdminCmsModal';
import { HomeView } from './components/HomeView';
import { PublicPagesView } from './components/PublicPagesView';
import {
  ContentItem,
  DEFAULT_ARTICLES,
  DEFAULT_PORTFOLIO,
  DEFAULT_SITE_SETTINGS,
  PageName,
  SiteSettings,
  removeContentItem,
  upsertContentItem,
} from './utils/cmsLogic';

const STORAGE_KEYS = {
  SETTINGS: 'ari_sensei_site_settings_v1',
  ARTICLES: 'ari_sensei_articles_v1',
  PORTFOLIO: 'ari_sensei_portfolio_v1',
  THEME: 'ari_sensei_theme_v1',
};

export default function App() {
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.THEME);
      return saved === 'light' ? 'light' : 'dark';
    } catch {
      return 'dark';
    }
  });

  const [activePage, setActivePage] = useState<PageName>('home');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const [siteSettings, setSiteSettings] = useState<SiteSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...DEFAULT_SITE_SETTINGS,
          ...parsed,
          photos: { ...DEFAULT_SITE_SETTINGS.photos, ...(parsed.photos || {}) },
          socials: { ...DEFAULT_SITE_SETTINGS.socials, ...(parsed.socials || {}) },
        };
      }
    } catch {
      // Fallback to default
    }
    return DEFAULT_SITE_SETTINGS;
  });

  const [articles, setArticles] = useState<ContentItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ARTICLES);
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback to default
    }
    return DEFAULT_ARTICLES;
  });

  const [portfolio, setPortfolio] = useState<ContentItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PORTFOLIO);
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback to default
    }
    return DEFAULT_PORTFOLIO;
  });

  const [detailModal, setDetailModal] = useState<{
    kind: 'articles' | 'portfolio';
    item: ContentItem;
  } | null>(null);

  const [adminOpen, setAdminOpen] = useState(false);
  const [adminInitialTab, setAdminInitialTab] = useState<AdminTab>('overview');
  const [isAdmin, setIsAdmin] = useState(false);
  const [demoMode, setDemoMode] = useState(false);

  const [toastMsg, setToastMsg] = useState('');
  const [toastVisible, setToastVisible] = useState(false);
  const toastTimerRef = useRef<number | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setToastVisible(true);
    if (toastTimerRef.current) {
      window.clearTimeout(toastTimerRef.current);
    }
    toastTimerRef.current = window.setTimeout(() => {
      setToastVisible(false);
    }, 2400);
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem(STORAGE_KEYS.THEME, theme);
    } catch {
      // Ignore storage error
    }
  }, [theme]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setDetailModal(null);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  const handleToggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    showToast(next === 'light' ? 'Mode Terang Aktif' : 'Mode Gelap Aktif');
  };

  const handleNavigatePage = (pageName: PageName = 'home') => {
    const valid: PageName[] = ['home', 'about', 'writer', 'design', 'learning', 'products'];
    const target = valid.includes(pageName) ? pageName : 'home';
    setActivePage(target);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleJump = (target: PageName | 'contact') => {
    if (target === 'contact') {
      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
      return;
    }
    handleNavigatePage(target);
  };

  const handleOpenAdmin = (initialTab = 'overview') => {
    setAdminInitialTab(initialTab as AdminTab);
    setAdminOpen(true);
  };

  const handleEnterDemo = () => {
    setDemoMode(true);
    setIsAdmin(true);
    showToast('Masuk ke Mode Demo CMS');
  };

  const handleLogout = () => {
    setDemoMode(false);
    setIsAdmin(false);
    showToast('Keluar dari Mode Demo CMS');
  };

  const handleSaveSettings = (newSettings: SiteSettings, msg?: string) => {
    setSiteSettings(newSettings);
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(newSettings));
    } catch {
      // Ignore quota error
    }
    if (msg) showToast(msg);
  };

  const handleSaveContent = (
    kind: 'articles' | 'portfolio',
    payload: Omit<ContentItem, 'id'>,
    editId?: string
  ) => {
    if (kind === 'articles') {
      const updated = upsertContentItem(articles, payload, editId);
      setArticles(updated);
      try {
        localStorage.setItem(STORAGE_KEYS.ARTICLES, JSON.stringify(updated));
      } catch {
        // Ignore
      }
    } else {
      const updated = upsertContentItem(portfolio, payload, editId);
      setPortfolio(updated);
      try {
        localStorage.setItem(STORAGE_KEYS.PORTFOLIO, JSON.stringify(updated));
      } catch {
        // Ignore
      }
    }
  };

  const handleDeleteContent = (kind: 'articles' | 'portfolio', id: string) => {
    if (kind === 'articles') {
      const updated = removeContentItem(articles, id);
      setArticles(updated);
      try {
        localStorage.setItem(STORAGE_KEYS.ARTICLES, JSON.stringify(updated));
      } catch {
        // Ignore
      }
    } else {
      const updated = removeContentItem(portfolio, id);
      setPortfolio(updated);
      try {
        localStorage.setItem(STORAGE_KEYS.PORTFOLIO, JSON.stringify(updated));
      } catch {
        // Ignore
      }
    }
  };

  const navItems: Array<{ page: PageName; label: string }> = [
    { page: 'home', label: 'HOME' },
    { page: 'about', label: 'ABOUT' },
    { page: 'writer', label: 'WRITER' },
    { page: 'design', label: 'DESIGN' },
    { page: 'learning', label: 'BELAJAR' },
    { page: 'products', label: 'KARYA' },
  ];

  return (
    <>
      {/* FULL WEB WRAPPER */}
      <div
        className="w-full max-w-[1260px] mx-auto px-3 sm:px-6 lg:px-8 pt-4 pb-16"
        id="publicSite"
      >
        {/* TOP NAVIGATION BAR (PERSIS REFERENSI + THEME TOGGLE + STUDIO FOTO) */}
        <nav
          className="glass-nav rounded-full px-4 sm:px-6 py-2.5 mb-5 sticky top-3 z-40"
          id="topbar"
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <button
                type="button"
                aria-label="Menu"
                onClick={() => setMobileNavOpen((prev) => !prev)}
                className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-sky-500/15 transition"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                >
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              </button>
            </div>

            <div
              className="hidden md:flex items-center justify-center gap-2 lg:gap-4 flex-1 text-xs font-semibold tracking-[0.14em]"
              style={{ color: 'var(--text-sub)' }}
            >
              {navItems.map((item) => (
                <button
                  key={item.page}
                  type="button"
                  data-page={item.page}
                  onClick={() => handleNavigatePage(item.page)}
                  className={`nav-item ${
                    activePage === item.page ? 'active' : ''
                  } px-3.5 py-1.5 rounded-full hover:text-sky-400 transition`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              {/* CMS Login (Khusus Admin) */}
              <button
                type="button"
                onClick={() => handleOpenAdmin('overview')}
                className="px-3.5 py-2 rounded-full text-[11px] font-bold tracking-wider border transition"
                style={{
                  borderColor: 'var(--border-strong)',
                  background: 'var(--pill-bg)',
                }}
              >
                ADMIN CMS ↗
              </button>
            </div>
          </div>

          {/* Mobile Dropdown */}
          <div
            id="mobileNav"
            className={`${
              mobileNavOpen ? 'grid' : 'hidden'
            } md:hidden pt-3 pb-1 border-t mt-2.5 grid-cols-3 gap-2 text-center text-[11px] font-semibold tracking-wider`}
            style={{ borderColor: 'var(--border-soft)' }}
          >
            {navItems.map((item) => (
              <button
                key={item.page}
                type="button"
                data-page={item.page}
                onClick={() => {
                  handleNavigatePage(item.page);
                  setMobileNavOpen(false);
                }}
                className={`nav-item ${
                  activePage === item.page ? 'active' : ''
                } py-2 rounded-xl hover:bg-sky-500/15`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </nav>

        {/* HALAMAN 1: HOME */}
        {activePage === 'home' && (
          <HomeView
            siteSettings={siteSettings}
            theme={theme}
            onToggleTheme={handleToggleTheme}
            onNavigatePage={handleNavigatePage}
            onJump={handleJump}
            onOpenAdmin={handleOpenAdmin}
          />
        )}

        {/* HALAMAN 2-6 & FOOTER CONTACT */}
        <PublicPagesView
          activePage={activePage}
          siteSettings={siteSettings}
          articles={articles}
          portfolio={portfolio}
          onNavigatePage={handleNavigatePage}
          onJump={handleJump}
          onOpenDetail={(kind, item) => setDetailModal({ kind, item })}
        />
      </div>

      {/* MODAL DETAIL ARTIKEL / PORTOFOLIO */}
      {detailModal && (
        <div
          id="detailModal"
          onClick={(e) => {
            if (e.target === e.currentTarget) setDetailModal(null);
          }}
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md p-4 overflow-y-auto flex items-center justify-center"
        >
          <div
            className="w-full max-w-2xl rounded-3xl border shadow-2xl p-6 my-8"
            style={{
              background: 'var(--modal-bg)',
              borderColor: 'var(--border-strong)',
            }}
          >
            <div
              className="flex items-start justify-between gap-3 border-b pb-4 mb-4"
              style={{ borderColor: 'var(--border-soft)' }}
            >
              <div>
                <div
                  id="detailCategory"
                  className="text-[10px] font-extrabold tracking-[0.22em] uppercase text-sky-500 mb-1"
                >
                  {detailModal.item.category ||
                    (detailModal.kind === 'articles' ? 'Artikel' : 'Portofolio')}
                </div>
                <h3 id="detailTitle" className="text-xl font-extrabold leading-snug">
                  {detailModal.item.title}
                </h3>
              </div>
              <button
                type="button"
                aria-label="Tutup Detail"
                onClick={() => setDetailModal(null)}
                className="w-9 h-9 rounded-full bg-sky-500/15 hover:bg-sky-500/25 flex items-center justify-center font-bold shrink-0"
              >
                ✕
              </button>
            </div>
            {detailModal.item.imageUrl && (
              <div id="detailImageWrap" className="mb-4">
                <img
                  id="detailImage"
                  src={detailModal.item.imageUrl}
                  alt={detailModal.item.title}
                  className="w-full max-h-80 object-cover rounded-2xl"
                />
              </div>
            )}
            <p
              id="detailSummary"
              className="text-xs sm:text-sm font-semibold mb-3"
              style={{ color: 'var(--text-main)' }}
            >
              {detailModal.item.summary}
            </p>
            <div
              id="detailBody"
              className="text-xs sm:text-sm leading-relaxed whitespace-pre-line"
              style={{ color: 'var(--text-sub)' }}
            >
              {detailModal.item.body || detailModal.item.summary}
            </div>
          </div>
        </div>
      )}

      {/* ADMIN CMS OVERLAY */}
      <AdminCmsModal
        isOpen={adminOpen}
        initialTab={adminInitialTab}
        isAdmin={isAdmin}
        demoMode={demoMode}
        siteSettings={siteSettings}
        articles={articles}
        portfolio={portfolio}
        onClose={() => setAdminOpen(false)}
        onEnterDemo={handleEnterDemo}
        onLogout={handleLogout}
        onSaveSettings={handleSaveSettings}
        onSaveContent={handleSaveContent}
        onDeleteContent={handleDeleteContent}
        onToast={showToast}
      />

      {/* TOAST */}
      <div
        id="toast"
        className={`fixed bottom-5 left-1/2 -translate-x-1/2 px-5 py-2.5 rounded-full bg-sky-500 text-white text-xs font-extrabold shadow-2xl pointer-events-none transition-opacity duration-200 z-[200] ${
          toastVisible ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {toastMsg}
      </div>
    </>
  );
}
