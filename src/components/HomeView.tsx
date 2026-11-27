import React, { useState } from 'react';
import { PageName, SiteSettings, normalizeLink } from '../utils/cmsLogic';

interface HomeViewProps {
  siteSettings: SiteSettings;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  onNavigatePage: (page: PageName) => void;
  onJump: (target: PageName | 'contact') => void;
  onOpenAdmin: (initialTab?: string) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  siteSettings,
  theme,
  onToggleTheme,
  onNavigatePage,
  onJump,
  onOpenAdmin,
}) => {
  const [controls, setControls] = useState({
    airplane: false,
    cellular: true,
    wifi: false,
    bluetooth: true,
  });

  const toggleControl = (key: keyof typeof controls) => {
    setControls((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const displayName = (siteSettings.fullName || 'PAK ARI SENSEI').trim().toUpperCase();
  const igUrl = normalizeLink(siteSettings.socials?.instagram) || 'https://instagram.com/arhykbs';
  const fbUrl = normalizeLink(siteSettings.socials?.facebook) || 'https://facebook.com';
  const photos = siteSettings.photos || {
    hero: '',
    avatar: '',
    writerCard: '',
    gallery1: '',
    gallery2: '',
    aboutPhoto: '',
  };
  const heroTransform = siteSettings.heroTransform || { scale: 100, offsetY: 0 };

  return (
    <div id="page-home" className="page-view active">
      <main id="home" className="hero-outer rounded-[36px] sm:rounded-[48px] p-3 sm:p-6 lg:p-8">
        {/* SLOT 1: FOTO UTAMA (DIKELOLA KHUSUS LEWAT CMS ADMIN) */}
        <div className="hero-portrait-layer" id="heroPortraitSlot">
          {photos.hero ? (
            <img
              id="heroPortraitImg"
              src={photos.hero}
              alt="Foto Utama"
              style={{
                transform: `translateY(${heroTransform.offsetY || 0}px) scale(${(heroTransform.scale || 100) / 100})`,
                transformOrigin: 'bottom center',
              }}
            />
          ) : (
            <div className="w-[240px] sm:w-[300px] h-[400px] sm:h-[500px] rounded-t-[150px] rounded-b-3xl border border-sky-400/25 bg-sky-950/30 backdrop-blur-md flex flex-col items-center justify-center text-center p-6 gap-2">
              <div className="text-xs font-extrabold tracking-[0.25em] opacity-80">ARI SENSEI</div>
              <p className="text-[11px] leading-relaxed opacity-60 max-w-[200px]">
                Foto utama dikelola melalui Dashboard CMS Admin.
              </p>
            </div>
          )}
        </div>

        {/* BAGIAN 1: KARTU HEADER ATAS (NOTCH PORTOFOLIO + AVATAR + JUDUL BESAR) */}
        <section className="top-solid-card rounded-[30px] sm:rounded-[38px] p-4 sm:p-7 relative z-10 min-h-[270px] sm:min-h-[300px] flex flex-col justify-between">
          {/* Top Notch Row */}
          <div className="grid grid-cols-3 items-center mb-4">
            <div></div>
            <div className="portfolio-notch-pill justify-self-center px-6 sm:px-12 py-2 rounded-full text-[10px] sm:text-xs font-extrabold">
              PORTOFOLIO
            </div>
            <div className="justify-self-end flex items-center gap-2 pr-1" aria-hidden="true">
              <span className="window-dot"></span>
              <span className="window-dot"></span>
              <span className="window-dot"></span>
            </div>
          </div>

          {/* Inner Top Content: Left Mini Profile & Right Headline */}
          <div className="grid grid-cols-1 sm:grid-cols-[150px_1fr_minmax(280px,410px)] gap-4 items-center">
            {/* SLOT 2: AVATAR BULAT KIRI ATAS */}
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full p-1.5 border border-sky-300/45 bg-sky-500/10 shadow-[0_0_0_6px_rgba(148,197,230,0.10)] relative">
                <div
                  id="avatarSlot"
                  className="w-full h-full rounded-full overflow-hidden bg-gradient-to-b from-sky-400/40 via-slate-700 to-slate-900 flex items-center justify-center font-extrabold text-xl text-white"
                >
                  {photos.avatar ? (
                    <img
                      src={photos.avatar}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                      style={{ objectPosition: '50% 12%' }}
                    />
                  ) : (
                    'AS'
                  )}
                </div>
              </div>

              <div className="flex items-center justify-center gap-2.5 mt-3 mb-1.5">
                <a
                  id="homeIgLink"
                  href={igUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="w-7 h-7 rounded-lg border flex items-center justify-center hover:bg-sky-500 hover:text-white hover:border-sky-500 transition"
                  style={{ borderColor: 'var(--border-strong)' }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="2" width="20" height="20" rx="5" />
                    <circle cx="12" cy="12" r="4" />
                    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
                  </svg>
                </a>
                <a
                  id="homeFbLink"
                  href={fbUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="w-7 h-7 rounded-lg border flex items-center justify-center hover:bg-sky-500 hover:text-white hover:border-sky-500 transition"
                  style={{ borderColor: 'var(--border-strong)' }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M14 13.5h2.5l1-4H14v-2c0-1.03 0-2 2-2h1.5V2.14c-.326-.043-1.557-.14-2.857-.14C11.928 2 10 3.657 10 6.7v2.8H7v4h3V22h4v-8.5z" />
                  </svg>
                </a>
              </div>
              <div id="homeBadgeName" className="text-xs sm:text-sm font-bold tracking-wide">
                {siteSettings.brandAlias || 'Pak Ari Sensei'}
              </div>
              <div
                className="mt-1 flex flex-col items-center gap-0.5 text-[10px]"
                style={{ color: 'var(--text-muted)' }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                  <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
                <span>New Post</span>
              </div>
            </div>

            {/* Ruang Tengah untuk Kepala & Bahu Foto Utama */}
            <div className="hidden sm:block"></div>

            {/* Judul Besar & Bio Singkat Kanan */}
            <div className="text-center sm:text-left">
              <h1
                id="homeHeadline"
                className="font-display headline-metallic text-3xl sm:text-5xl lg:text-[54px] leading-none uppercase whitespace-nowrap mb-2.5"
              >
                {displayName}
              </h1>
              <p id="homeSubtitle" className="text-xs sm:text-sm font-bold mb-1">
                {siteSettings.subtitle}
              </p>
              <p
                id="homeBioShort"
                className="text-xs sm:text-[13px] leading-relaxed"
                style={{ color: 'var(--text-sub)' }}
              >
                {siteSettings.bioShort}
              </p>
            </div>
          </div>
        </section>

        {/* BAGIAN 2: AREA TENGAH & BAWAH (DOCK KIRI + WIDGET iOS + KARTU MENYATU + GALERI KANAN) */}
        <div className="relative z-20 mt-5 grid grid-cols-[48px_1fr_52px] sm:grid-cols-[84px_1fr_74px] gap-2.5 sm:gap-5 items-stretch">
          {/* KIRI: DOCK VERTIKAL + SLIDER TRANSLUCENT + FINGERPRINT */}
          <aside className="flex flex-col justify-between items-center gap-4">
            <div className="flex items-center gap-1.5 sm:gap-2">
              {/* Main Vertical Story Dock */}
              <div className="dock-shell w-11 sm:w-[54px] py-3 rounded-full flex flex-col items-center gap-2">
                <button
                  type="button"
                  onClick={() => onJump('about')}
                  title="Tentang Saya"
                  aria-label="Tentang Saya"
                  className="w-9 h-9 rounded-xl hover:bg-sky-500/20 flex items-center justify-center font-bold text-sm transition"
                >
                  Aa
                </button>
                <button
                  type="button"
                  onClick={() => onJump('writer')}
                  title="Artikel"
                  aria-label="Artikel"
                  className="w-9 h-9 rounded-xl hover:bg-sky-500/20 flex items-center justify-center transition"
                >
                  <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18.178 8c5.096 0 5.096 8 0 8-5.095 0-7.133-8-12.739-8-4.585 0-4.585 8 0 8 5.606 0 7.644-8 12.74-8z" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => onJump('design')}
                  title="Desain & Portofolio"
                  aria-label="Desain & Portofolio"
                  className="w-9 h-9 rounded-xl hover:bg-sky-500/20 flex items-center justify-center transition"
                >
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="4" />
                    <line x1="12" y1="3" x2="12" y2="21" />
                    <line x1="3" y1="12" x2="21" y2="12" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => onJump('learning')}
                  title="Pusat Belajar"
                  aria-label="Pusat Belajar"
                  className="w-9 h-9 rounded-xl hover:bg-sky-500/20 flex items-center justify-center transition"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="4" />
                    <path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41m11.32-11.32l1.41-1.41" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => onJump('products')}
                  title="Karya Digital"
                  aria-label="Karya Digital"
                  className="w-9 h-9 rounded-xl hover:bg-sky-500/20 flex items-center justify-center transition"
                >
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="9" />
                    <line x1="3" y1="12" x2="21" y2="12" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => onJump('design')}
                  title="Galeri Karya"
                  aria-label="Galeri Karya"
                  className="w-9 h-9 rounded-xl hover:bg-sky-500/20 flex items-center justify-center transition"
                >
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="4" y="4" width="16" height="16" rx="3" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => onJump('contact')}
                  title="Kontak"
                  aria-label="Kontak"
                  className="w-9 h-9 rounded-xl hover:bg-sky-500/20 flex items-center justify-center transition"
                >
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="9" />
                    <rect x="9" y="9" width="6" height="6" rx="1" fill="currentColor" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => onJump('home')}
                  title="Ke Atas"
                  aria-label="Ke Atas"
                  className="w-9 h-9 rounded-xl hover:bg-sky-500/20 flex items-center justify-center transition"
                >
                  <svg
                    width="17"
                    height="17"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                  >
                    <polyline points="18 15 12 9 6 15" />
                  </svg>
                </button>
              </div>

              {/* Aksen Slider Vertikal seperti di Referensi */}
              <div className="hidden sm:flex flex-col items-center gap-1.5">
                <span className="text-[9px] font-bold opacity-60">100%</span>
                <div className="w-3.5 h-36 rounded-full dock-shell p-0.5 flex flex-col justify-end overflow-hidden">
                  <div className="w-full h-2/3 rounded-full bg-gradient-to-t from-sky-500/70 to-sky-300/40"></div>
                </div>
              </div>
            </div>

            {/* Fingerprint Button (Akses CMS Admin) */}
            <button
              type="button"
              onClick={() => onOpenAdmin('overview')}
              title="Login CMS Admin"
              aria-label="Login CMS Admin"
              className="dock-shell w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center hover:border-sky-400 transition"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
              >
                <path d="M12 10a2 2 0 0 0-2 2c0 1.02-.1 2.51-.26 4" />
                <path d="M14 13.12c0 2.38 0 6.38-1 8.88" />
                <path d="M17.29 21.02c.12-.6.43-2.3.5-3.02" />
                <path d="M2 12a10 10 0 0 1 18-6" />
                <path d="M2 16h.01" />
                <path d="M21.8 16c.2-2 .131-5.354 0-6" />
                <path d="M5 19.5C5.5 18 6 15 6 12a6 6 0 0 1 .34-2" />
                <path d="M8.65 22c.21-.66.45-1.32.57-2" />
                <path d="M9 6.8a6 6 0 0 1 9 5.2v2" />
              </svg>
            </button>
          </aside>

          {/* TENGAH: WIDGET iOS + KARTU MENYATU PENULIS & INTRODUCE MY SELF + PHOTO STACK */}
          <div className="flex flex-col justify-between min-h-[470px] sm:min-h-[510px] gap-6">
            {/* BARIS TENGAH KANAN: STATUS BAR + CONTROL CENTER 2x2 */}
            <div className="flex flex-col items-end gap-4 pt-1">
              {/* Status Bar Pill */}
              <div className="top-solid-card inline-flex items-center gap-4 px-5 py-2.5 rounded-full">
                <svg width="16" height="14" viewBox="0 0 18 14" fill="currentColor">
                  <rect x="0" y="9" width="3" height="5" rx="1" />
                  <rect x="5" y="6" width="3" height="8" rx="1" />
                  <rect x="10" y="3" width="3" height="11" rx="1" />
                  <rect x="15" y="0" width="3" height="14" rx="1" />
                </svg>
                <svg
                  width="16"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                >
                  <path d="M5 12.55a11 11 0 0 1 14.08 0" />
                  <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
                  <circle cx="12" cy="20" r="1" fill="currentColor" />
                </svg>
                <svg width="24" height="13" viewBox="0 0 28 14" fill="none">
                  <rect x="1" y="1" width="22" height="12" rx="3" stroke="currentColor" strokeWidth="1.8" />
                  <rect x="3.5" y="3.5" width="15" height="7" rx="1.2" fill="currentColor" />
                  <rect x="24.5" y="4.5" width="2.5" height="5" rx="1" fill="currentColor" />
                </svg>
              </div>

              {/* 2x2 Control Center */}
              <div className="flex flex-wrap items-center justify-end gap-4 mt-4 sm:mt-8">
                <div className="control-box w-[118px] p-3 rounded-[26px] grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => toggleControl('airplane')}
                    title="Mode Pesawat"
                    aria-label="Mode Pesawat"
                    className={`w-10 h-10 rounded-full flex items-center justify-center hover:scale-105 transition ${
                      controls.airplane
                        ? 'bg-[#0a84ff] text-white shadow-[0_0_16px_rgba(10,132,255,0.55)]'
                        : 'bg-slate-900/80 text-slate-100'
                    }`}
                  >
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleControl('cellular')}
                    title="Jaringan Aktif"
                    aria-label="Jaringan Aktif"
                    className={`w-10 h-10 rounded-full flex items-center justify-center hover:scale-105 transition ${
                      controls.cellular
                        ? 'bg-[#34c759] text-white shadow-[0_0_16px_rgba(52,199,89,0.55)]'
                        : 'bg-slate-900/80 text-slate-100'
                    }`}
                  >
                    <svg
                      width="17"
                      height="17"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                    >
                      <circle cx="12" cy="12" r="2" fill="currentColor" />
                      <path d="M16.24 7.76a6 6 0 0 1 0 8.49m-8.48-.01a6 6 0 0 1 0-8.49m11.31-2.82a10 10 0 0 1 0 14.14m-14.14 0a10 10 0 0 1 0-14.14" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleControl('wifi')}
                    title="Wi-Fi"
                    aria-label="Wi-Fi"
                    className={`w-10 h-10 rounded-full flex items-center justify-center hover:scale-105 transition ${
                      controls.wifi
                        ? 'bg-[#0a84ff] text-white shadow-[0_0_16px_rgba(10,132,255,0.55)]'
                        : 'bg-slate-900/80 text-slate-100'
                    }`}
                  >
                    <svg
                      width="17"
                      height="17"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    >
                      <path d="M5 12.55a11 11 0 0 1 14.08 0" />
                      <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
                      <line x1="2" y1="2" x2="22" y2="22" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => toggleControl('bluetooth')}
                    title="Bluetooth"
                    aria-label="Bluetooth"
                    className={`w-10 h-10 rounded-full flex items-center justify-center hover:scale-105 transition ${
                      controls.bluetooth
                        ? 'bg-[#0a84ff] text-white shadow-[0_0_16px_rgba(10,132,255,0.55)]'
                        : 'bg-slate-900/80 text-slate-100'
                    }`}
                  >
                    <svg
                      width="17"
                      height="17"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="6.5 6.5 17.5 17.5 12 23 12 1 17.5 6.5 6.5 17.5" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* BARIS BAWAH: KARTU MENYATU (PENULIS + INTRODUCE MY SELF) & KOLOM PHOTO KANAN */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_144px] gap-4 items-end mt-auto">
              {/* KARTU MENYATU SEPERTI REFERENSI */}
              <div className="flex flex-col">
                {/* Baris Label Atas: Pill PENULIS di kiri, Judul INTRODUCE MY SELF di kanan */}
                <div className="grid grid-cols-1 sm:grid-cols-[195px_1fr] gap-4 items-end mb-2.5 px-1">
                  <div className="pill-badge py-2 px-5 rounded-full text-center text-[10px] sm:text-[11px] font-extrabold">
                    PENULIS
                  </div>
                  <div className="hidden sm:block pl-1">
                    <h2 className="text-lg sm:text-xl font-extrabold tracking-wider leading-tight">
                      INTRODUCE
                      <br />
                      MY SELF
                    </h2>
                  </div>
                </div>

                {/* Badan Kartu Menyatu */}
                <article
                  id="homeAboutCard"
                  className="bento-glass rounded-[28px] p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-[195px_1fr] gap-4 sm:gap-5 items-center"
                >
                  {/* SLOT 3: FOTO KARTU PENULIS */}
                  <div>
                    <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-slate-700 to-slate-900 border border-white/20 flex items-center justify-center text-[10px] tracking-widest text-sky-200">
                      <div
                        id="writerPhotoSlot"
                        className="w-full h-full flex flex-col items-center justify-center gap-1 p-2 text-center"
                      >
                        {photos.writerCard ? (
                          <img
                            src={photos.writerCard}
                            alt="Penulis"
                            className="w-full h-full object-cover"
                            style={{ objectPosition: '50% 15%' }}
                          />
                        ) : (
                          <span className="font-bold opacity-80">PENULIS</span>
                        )}
                      </div>
                    </div>
                    <div
                      className="flex justify-between text-[7.5px] tracking-wider font-bold pt-2 px-0.5"
                      style={{ color: 'var(--text-muted)' }}
                    >
                      <span>SLO-MO</span>
                      <span>VIDEO</span>
                      <span className="text-amber-500">PHOTO</span>
                      <span>PORTRAIT</span>
                      <span>SQUARE</span>
                    </div>
                  </div>

                  {/* Teks Bio */}
                  <div>
                    <h2 className="sm:hidden text-lg font-extrabold tracking-wider leading-tight mb-2">
                      INTRODUCE MY SELF
                    </h2>
                    <p
                      id="homeIntroBio"
                      className="text-xs sm:text-[13.5px] leading-relaxed"
                      style={{ color: 'var(--text-sub)' }}
                    >
                      {siteSettings.introBio}
                    </p>
                  </div>
                </article>
              </div>

              {/* KANAN BAWAH: LABEL PHOTO + 2 SLOT FOTO GALERI */}
              <div className="flex flex-col">
                <div className="top-solid-card w-full py-2 px-4 rounded-full text-center text-[10px] font-extrabold tracking-[0.22em] mb-2.5">
                  PHOTO
                </div>
                <div className="photo-stack-box rounded-[26px] p-2.5 grid grid-cols-2 lg:grid-cols-1 gap-2.5">
                  {/* SLOT 4: GALERI 1 */}
                  <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-slate-700 to-slate-900 border border-white/20 flex items-center justify-center text-[9px] tracking-widest text-sky-200">
                    <div
                      id="gallerySlot1"
                      className="w-full h-full flex flex-col items-center justify-center gap-0.5 text-center p-1"
                    >
                      {photos.gallery1 ? (
                        <img
                          src={photos.gallery1}
                          alt="Galeri 1"
                          className="w-full h-full object-cover"
                          style={{ objectPosition: '50% 15%' }}
                        />
                      ) : (
                        <span className="font-bold opacity-80">GALERI 1</span>
                      )}
                    </div>
                  </div>

                  {/* SLOT 5: GALERI 2 */}
                  <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-gradient-to-br from-slate-700 to-slate-900 border border-white/20 flex items-center justify-center text-[9px] tracking-widest text-sky-200">
                    <div
                      id="gallerySlot2"
                      className="w-full h-full flex flex-col items-center justify-center gap-0.5 text-center p-1"
                    >
                      {photos.gallery2 ? (
                        <img
                          src={photos.gallery2}
                          alt="Galeri 2"
                          className="w-full h-full object-cover"
                          style={{ objectPosition: '50% 20%' }}
                        />
                      ) : (
                        <span className="font-bold opacity-80">GALERI 2</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* KANAN: WIDGET CUACA (TOMBOL GANTI TEMA GELAP / TERANG) + QUICK DOCK VERTIKAL */}
          <aside className="flex flex-col items-center justify-start gap-4 pt-1">
            <button
              type="button"
              id="themeToggleBtn"
              onClick={onToggleTheme}
              aria-label="Ganti Tema Gelap / Terang"
              title="Klik untuk Ganti Tema Gelap / Terang"
              className="weather-box w-12 h-11 sm:w-[70px] sm:h-[60px] rounded-2xl flex items-center justify-center cursor-pointer hover:scale-105 active:scale-95 transition"
            >
              {/* Ikon Mode Gelap: Awan & Bulan Sabit (bersih tanpa garis bertumpuk) */}
              <svg
                id="weatherIconDark"
                className={theme === 'light' ? 'hidden' : ''}
                width="34"
                height="34"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18.2 3.2a3.3 3.3 0 0 0 3.1 4.4 3.3 3.3 0 1 1-3.1-4.4Z" />
                <path d="M6.5 19.2h9.8a3.4 3.4 0 0 0 .5-6.76 4.8 4.8 0 0 0-9.35-1.14 3.8 3.8 0 0 0-.95 7.9Z" />
              </svg>
              {/* Ikon Mode Terang: Awan & Matahari */}
              <svg
                id="weatherIconLight"
                className={theme !== 'light' ? 'hidden' : ''}
                width="34"
                height="34"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="17.5" cy="7" r="2.4" />
                <path d="M17.5 2.6v1M21.8 7h-1M20.5 4l-.7.7M14.5 4l.7.7" />
                <path d="M6.5 19.2h9.8a3.4 3.4 0 0 0 .5-6.76 4.8 4.8 0 0 0-9.35-1.14 3.8 3.8 0 0 0-.95 7.9Z" />
              </svg>
            </button>

            <div
              className="w-11 sm:w-14 rounded-3xl overflow-hidden border shadow-2xl flex flex-col"
              style={{ borderColor: 'var(--border-strong)' }}
            >
              <div className="right-dock-top py-3.5 flex flex-col items-center gap-3.5">
                <button
                  type="button"
                  onClick={() => onJump('home')}
                  title="Beranda"
                  aria-label="Beranda"
                  className="w-8 h-8 rounded-xl hover:bg-sky-500/20 flex items-center justify-center transition"
                >
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 3l9 8h-3v9h-5v-6h-2v6H6v-9H3l9-8z" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => onJump('writer')}
                  title="Artikel"
                  aria-label="Artikel Kanan"
                  className="w-8 h-8 rounded-xl hover:bg-sky-500/20 flex items-center justify-center transition"
                >
                  <svg
                    width="17"
                    height="17"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  >
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                    <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                    <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                  </svg>
                </button>
              </div>
              <div className="right-dock-bottom py-3.5 flex flex-col items-center gap-3.5">
                <button
                  type="button"
                  onClick={() => onJump('products')}
                  title="Produk Digital"
                  aria-label="Produk Digital"
                  className="w-8 h-8 rounded-xl hover:bg-black/15 flex items-center justify-center transition"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                  >
                    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={() => onJump('contact')}
                  title="Kolaborasi"
                  aria-label="Kolaborasi"
                  className="w-8 h-8 rounded-xl hover:bg-black/15 flex items-center justify-center transition"
                >
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                  </svg>
                </button>
              </div>
            </div>
          </aside>
        </div>

        {/* BOTTOM TAGLINE BAR */}
        <div
          id="homeTagline"
          className="tagline-pill mt-6 mx-auto max-w-3xl py-3.5 px-6 rounded-full text-center text-[10px] sm:text-xs font-extrabold tracking-[0.28em] relative z-20"
        >
          {siteSettings.tagline}
        </div>

        {/* AKSEN DOCK BAWAH DENGAN 2 TITIK (PERSIS REFERENSI) */}
        <div
          className="mt-4 mx-auto max-w-4xl flex items-center justify-between px-6 py-2.5 rounded-full top-solid-card relative z-20 opacity-90"
          aria-hidden="true"
        >
          <span className="window-dot"></span>
          <div className="w-28 sm:w-44 h-1.5 rounded-full bg-sky-400/30"></div>
          <span className="window-dot"></span>
        </div>
      </main>

      {/* AKSES CEPAT KE HALAMAN LAIN DARI BERANDA */}
      <section className="pt-10">
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
          <button
            type="button"
            onClick={() => onNavigatePage('about')}
            className="tile-card rounded-2xl p-4 text-left group"
          >
            <div className="text-[10px] font-bold tracking-widest text-sky-400 mb-1">01 · PROFIL</div>
            <div className="text-sm font-extrabold group-hover:text-sky-400 transition">About Me ↗</div>
            <p className="text-[11px] mt-1" style={{ color: 'var(--text-muted)' }}>
              Biodata, karier &amp; keahlian
            </p>
          </button>
          <button
            type="button"
            onClick={() => onNavigatePage('writer')}
            className="tile-card rounded-2xl p-4 text-left group"
          >
            <div className="text-[10px] font-bold tracking-widest text-sky-400 mb-1">02 · LITERASI</div>
            <div className="text-sm font-extrabold group-hover:text-sky-400 transition">Writer &amp; Artikel ↗</div>
            <p className="text-[11px] mt-1" style={{ color: 'var(--text-muted)' }}>
              Tulisan PJOK &amp; EduTech
            </p>
          </button>
          <button
            type="button"
            onClick={() => onNavigatePage('design')}
            className="tile-card rounded-2xl p-4 text-left group"
          >
            <div className="text-[10px] font-bold tracking-widest text-sky-400 mb-1">03 · VISUAL</div>
            <div className="text-sm font-extrabold group-hover:text-sky-400 transition">Design Showcase ↗</div>
            <p className="text-[11px] mt-1" style={{ color: 'var(--text-muted)' }}>
              Galeri karya &amp; portofolio
            </p>
          </button>
          <button
            type="button"
            onClick={() => onNavigatePage('learning')}
            className="tile-card rounded-2xl p-4 text-left group"
          >
            <div className="text-[10px] font-bold tracking-widest text-sky-400 mb-1">04 · EDUKASI</div>
            <div className="text-sm font-extrabold group-hover:text-sky-400 transition">Pusat Belajar ↗</div>
            <p className="text-[11px] mt-1" style={{ color: 'var(--text-muted)' }}>
              Modul &amp; perangkat guru
            </p>
          </button>
          <button
            type="button"
            onClick={() => onNavigatePage('products')}
            className="tile-card rounded-2xl p-4 text-left group col-span-2 lg:col-span-1"
          >
            <div className="text-[10px] font-bold tracking-widest text-sky-400 mb-1">05 · DIGITAL</div>
            <div className="text-sm font-extrabold group-hover:text-sky-400 transition">Karya &amp; Produk ↗</div>
            <p className="text-[11px] mt-1" style={{ color: 'var(--text-muted)' }}>
              Template &amp; asisten PJOK
            </p>
          </button>
        </div>
      </section>
    </div>
  );
};
