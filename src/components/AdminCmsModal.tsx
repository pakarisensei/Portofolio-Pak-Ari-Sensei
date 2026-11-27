import React, { useEffect, useRef, useState } from 'react';
import {
  ContentItem,
  PhotoConfig,
  SiteSettings,
  compressImageToDataUrl,
  removeWhiteBgFromEdges,
} from '../utils/cmsLogic';

export type AdminTab = 'overview' | 'photos' | 'profile' | 'socials' | 'articles' | 'portfolio';

interface AdminCmsModalProps {
  isOpen: boolean;
  initialTab: AdminTab;
  isAdmin: boolean;
  demoMode: boolean;
  siteSettings: SiteSettings;
  articles: ContentItem[];
  portfolio: ContentItem[];
  onClose: () => void;
  onEnterDemo: () => void;
  onLogout: () => void;
  onSaveSettings: (newSettings: SiteSettings, toastMsg?: string) => void;
  onSaveContent: (
    kind: 'articles' | 'portfolio',
    payload: Omit<ContentItem, 'id'>,
    editId?: string
  ) => void;
  onDeleteContent: (kind: 'articles' | 'portfolio', id: string) => void;
  onToast: (msg: string) => void;
}

export const AdminCmsModal: React.FC<AdminCmsModalProps> = ({
  isOpen,
  initialTab,
  isAdmin,
  demoMode,
  siteSettings,
  articles,
  portfolio,
  onClose,
  onEnterDemo,
  onLogout,
  onSaveSettings,
  onSaveContent,
  onDeleteContent,
  onToast,
}) => {
  const [activeTab, setActiveTab] = useState<AdminTab>(initialTab);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginMessage, setLoginMessage] = useState(
    "Firebase belum dikonfigurasi. Klik 'COBA MODE DEMO CMS' untuk langsung mengedit profil, link medsos, artikel, & portofolio."
  );

  // Photos Tab State
  const [draftPhotos, setDraftPhotos] = useState<PhotoConfig>(siteSettings.photos);
  const [urlInputs, setUrlInputs] = useState<PhotoConfig>({
    hero: siteSettings.photos.hero && !siteSettings.photos.hero.startsWith('data:') ? siteSettings.photos.hero : '',
    avatar:
      siteSettings.photos.avatar && !siteSettings.photos.avatar.startsWith('data:')
        ? siteSettings.photos.avatar
        : '',
    writerCard:
      siteSettings.photos.writerCard && !siteSettings.photos.writerCard.startsWith('data:')
        ? siteSettings.photos.writerCard
        : '',
    gallery1:
      siteSettings.photos.gallery1 && !siteSettings.photos.gallery1.startsWith('data:')
        ? siteSettings.photos.gallery1
        : '',
    gallery2:
      siteSettings.photos.gallery2 && !siteSettings.photos.gallery2.startsWith('data:')
        ? siteSettings.photos.gallery2
        : '',
    aboutPhoto:
      siteSettings.photos.aboutPhoto && !siteSettings.photos.aboutPhoto.startsWith('data:')
        ? siteSettings.photos.aboutPhoto
        : '',
  });
  const [autoRemoveBg, setAutoRemoveBg] = useState(true);
  const [bgThreshold, setBgThreshold] = useState(230);
  const [heroScale, setHeroScale] = useState(siteSettings.heroTransform?.scale ?? 100);
  const [heroOffsetY, setHeroOffsetY] = useState(siteSettings.heroTransform?.offsetY ?? 0);
  const rawHeroImageRef = useRef<HTMLImageElement | null>(null);

  // Profile Tab State
  const [profileForm, setProfileForm] = useState({
    fullName: siteSettings.fullName,
    degreeName: siteSettings.degreeName,
    brandAlias: siteSettings.brandAlias,
    handle: siteSettings.handle,
    subtitle: siteSettings.subtitle,
    roleLine: siteSettings.roleLine,
    bioShort: siteSettings.bioShort,
    introBio: siteSettings.introBio,
    aboutBio: siteSettings.aboutBio,
    tagline: siteSettings.tagline,
  });

  // Socials Tab State
  const [socialsForm, setSocialsForm] = useState({
    instagram: siteSettings.socials.instagram || '',
    facebook: siteSettings.socials.facebook || '',
    youtube: siteSettings.socials.youtube || '',
    tiktok: siteSettings.socials.tiktok || '',
    lynkid: siteSettings.socials.lynkid || '',
    whatsapp: siteSettings.socials.whatsapp || '',
    email: siteSettings.socials.email || '',
  });

  // Content Manager (Articles / Portfolio) State
  const [editId, setEditId] = useState('');
  const [contentTitle, setContentTitle] = useState('');
  const [contentCategory, setContentCategory] = useState('');
  const [contentSummary, setContentSummary] = useState('');
  const [contentImageUrl, setContentImageUrl] = useState('');
  const [contentBody, setContentBody] = useState('');
  const [contentPublished, setContentPublished] = useState('true');

  // Confirm Dialog State
  const [pendingDelete, setPendingDelete] = useState<{
    kind: 'articles' | 'portfolio';
    id: string;
  } | null>(null);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab, isOpen]);

  useEffect(() => {
    setDraftPhotos(siteSettings.photos);
    setHeroScale(siteSettings.heroTransform?.scale ?? 100);
    setHeroOffsetY(siteSettings.heroTransform?.offsetY ?? 0);
    setProfileForm({
      fullName: siteSettings.fullName,
      degreeName: siteSettings.degreeName,
      brandAlias: siteSettings.brandAlias,
      handle: siteSettings.handle,
      subtitle: siteSettings.subtitle,
      roleLine: siteSettings.roleLine,
      bioShort: siteSettings.bioShort,
      introBio: siteSettings.introBio,
      aboutBio: siteSettings.aboutBio,
      tagline: siteSettings.tagline,
    });
    setSocialsForm({
      instagram: siteSettings.socials.instagram || '',
      facebook: siteSettings.socials.facebook || '',
      youtube: siteSettings.socials.youtube || '',
      tiktok: siteSettings.socials.tiktok || '',
      lynkid: siteSettings.socials.lynkid || '',
      whatsapp: siteSettings.socials.whatsapp || '',
      email: siteSettings.socials.email || '',
    });
  }, [siteSettings]);

  const resetContentForm = () => {
    setEditId('');
    setContentTitle('');
    setContentCategory('');
    setContentSummary('');
    setContentImageUrl('');
    setContentBody('');
    setContentPublished('true');
  };

  const handleTabSwitch = (tab: AdminTab) => {
    setActiveTab(tab);
    resetContentForm();
  };

  if (!isOpen) return null;

  const handleEmailLogin = () => {
    setLoginMessage('Isi firebaseConfig di index.html atau gunakan Mode Demo CMS.');
  };

  const handleGoogleLogin = () => {
    setLoginMessage(
      "Untuk login dengan akun Google Anda secara online, pasang firebaseConfig & aktifkan Google Sign-In di Firebase Console. Sementara ini silakan klik 'COBA MODE DEMO CMS'."
    );
  };

  const processHeroImage = (img: HTMLImageElement, removeBg: boolean, threshold: number) => {
    const resultUrl = removeBg
      ? removeWhiteBgFromEdges(img, threshold)
      : compressImageToDataUrl(img, 760, 0.85);
    setDraftPhotos((prev) => ({ ...prev, hero: resultUrl }));
    onSaveSettings(
      {
        ...siteSettings,
        heroTransform: { scale: heroScale, offsetY: heroOffsetY },
        photos: { ...draftPhotos, hero: resultUrl },
      },
      "Slot 1 siap! Klik 'Simpan Semua Foto' untuk menyimpan."
    );
  };

  const handleHeroFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const img = new Image();
    img.onload = () => {
      rawHeroImageRef.current = img;
      processHeroImage(img, autoRemoveBg, bgThreshold);
    };
    img.src = URL.createObjectURL(file);
  };

  const handleOtherFileChange = (
    key: Exclude<keyof PhotoConfig, 'hero'>,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const img = new Image();
    img.onload = () => {
      const dataUrl = compressImageToDataUrl(img, 500, 0.82);
      const updated = { ...draftPhotos, [key]: dataUrl };
      setDraftPhotos(updated);
      onSaveSettings(
        {
          ...siteSettings,
          heroTransform: { scale: heroScale, offsetY: heroOffsetY },
          photos: updated,
        },
        "Foto berhasil dimuat! Klik 'Simpan Semua Foto'."
      );
    };
    img.src = URL.createObjectURL(file);
  };

  const handleSaveAllPhotos = () => {
    const mergedPhotos: PhotoConfig = { ...draftPhotos };
    (['hero', 'avatar', 'writerCard', 'gallery1', 'gallery2', 'aboutPhoto'] as const).forEach(
      (key) => {
        const trimmed = (urlInputs[key] || '').trim();
        if (trimmed) {
          mergedPhotos[key] = trimmed;
        }
      }
    );
    setDraftPhotos(mergedPhotos);
    onSaveSettings(
      {
        ...siteSettings,
        heroTransform: { scale: heroScale, offsetY: heroOffsetY },
        photos: mergedPhotos,
      },
      'Semua foto berhasil disimpan!'
    );
  };

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(
      {
        ...siteSettings,
        fullName: profileForm.fullName.trim(),
        degreeName: profileForm.degreeName.trim(),
        brandAlias: profileForm.brandAlias.trim(),
        handle: profileForm.handle.trim(),
        subtitle: profileForm.subtitle.trim(),
        roleLine: profileForm.roleLine.trim(),
        bioShort: profileForm.bioShort.trim(),
        introBio: profileForm.introBio.trim(),
        aboutBio: profileForm.aboutBio.trim(),
        tagline: profileForm.tagline.trim(),
      },
      'Profil & About berhasil disimpan!'
    );
  };

  const handleSocialsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveSettings(
      {
        ...siteSettings,
        socials: {
          instagram: socialsForm.instagram.trim(),
          facebook: socialsForm.facebook.trim(),
          youtube: socialsForm.youtube.trim(),
          tiktok: socialsForm.tiktok.trim(),
          lynkid: socialsForm.lynkid.trim(),
          whatsapp: socialsForm.whatsapp.trim(),
          email: socialsForm.email.trim(),
        },
      },
      'Semua tautan medsos berhasil diperbarui!'
    );
  };

  const handleContentSubmit = (kind: 'articles' | 'portfolio', e: React.FormEvent) => {
    e.preventDefault();
    if (!contentTitle.trim()) return;
    onSaveContent(
      kind,
      {
        title: contentTitle.trim(),
        category: contentCategory.trim(),
        summary: contentSummary.trim(),
        imageUrl: contentImageUrl.trim(),
        body: contentBody.trim(),
        published: contentPublished === 'true',
      },
      editId || undefined
    );
    resetContentForm();
    onToast('Konten disimpan (Mode Demo)');
  };

  const handleEditContentItem = (item: ContentItem) => {
    setEditId(item.id);
    setContentTitle(item.title || '');
    setContentCategory(item.category || '');
    setContentSummary(item.summary || '');
    setContentImageUrl(item.imageUrl || '');
    setContentBody(item.body || '');
    setContentPublished(String(item.published === true));
  };

  const currentKind: 'articles' | 'portfolio' =
    activeTab === 'portfolio' ? 'portfolio' : 'articles';
  const currentList = currentKind === 'articles' ? articles : portfolio;

  return (
    <>
      <div
        id="admin"
        className="fixed inset-0 z-50 bg-gradient-to-br from-[#060e17] to-[#0f2233] text-white overflow-y-auto p-4 sm:p-6"
      >
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-sky-200/20 pb-4">
            <div>
              <div className="text-[10px] tracking-[0.25em] text-sky-300">
                PERSONAL DIGITAL ECOSYSTEM
              </div>
              <h1 className="text-xl font-extrabold tracking-wider">ARI SENSEI CMS ONLINE</h1>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-sky-300/30 text-xs font-semibold"
              >
                ← WEBSITE
              </button>
              {isAdmin && (
                <button
                  type="button"
                  id="signOutBtn"
                  onClick={onLogout}
                  className="px-4 py-2 rounded-xl bg-rose-900/60 hover:bg-rose-800 border border-rose-400/40 text-xs font-semibold"
                >
                  LOGOUT
                </button>
              )}
            </div>
          </div>

          {!isAdmin ? (
            <div
              id="loginBox"
              className="max-w-md mx-auto mt-10 bg-[#0a1724] border border-sky-200/20 rounded-3xl p-6 shadow-2xl"
            >
              <h2 className="text-lg font-bold mb-1">Login Administrator</h2>
              <p className="text-xs text-slate-400 mb-4">
                Masuk menggunakan akun Google / Email Firebase Anda untuk mengelola seluruh isi website, atau coba Mode Demo CMS.
              </p>
              <div className="space-y-3">
                <div>
                  <label htmlFor="email" className="block text-[11px] text-sky-200 mb-1">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    autoComplete="username"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@email.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#06111c] border border-sky-200/20 text-sm text-white outline-none focus:border-sky-400"
                  />
                </div>
                <div>
                  <label htmlFor="password" className="block text-[11px] text-sky-200 mb-1">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#06111c] border border-sky-200/20 text-sm text-white outline-none focus:border-sky-400"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleEmailLogin}
                  className="w-full py-2.5 rounded-xl bg-sky-300 hover:bg-sky-200 text-slate-950 font-extrabold text-xs tracking-wider transition"
                >
                  LOGIN EMAIL &amp; PASSWORD
                </button>
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  className="w-full py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-extrabold text-xs tracking-wider transition flex items-center justify-center gap-2"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  LOGIN DENGAN AKUN GOOGLE
                </button>
                <button
                  type="button"
                  id="demoCmsBtn"
                  onClick={onEnterDemo}
                  className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-sky-100 font-bold text-xs tracking-wider transition"
                >
                  COBA MODE DEMO CMS (OFFLINE PREVIEW)
                </button>
              </div>
              <p id="loginMessage" className="text-xs text-slate-400 mt-3 leading-relaxed">
                {loginMessage}
              </p>
            </div>
          ) : (
            <div id="dashboard" className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-5 mt-6">
              <aside className="bg-[#0a1724] border border-sky-200/20 rounded-2xl p-4 h-max flex flex-wrap md:flex-col gap-2">
                {(
                  [
                    { key: 'overview', label: '▦ Overview' },
                    { key: 'photos', label: '📷 Kelola Foto' },
                    { key: 'profile', label: '👤 Profil & About' },
                    { key: 'socials', label: '🔗 Medsos & Link' },
                    { key: 'articles', label: '▤ Artikel' },
                    { key: 'portfolio', label: '✧ Portofolio' },
                  ] as Array<{ key: AdminTab; label: string }>
                ).map((t) => (
                  <button
                    key={t.key}
                    type="button"
                    data-tab={t.key}
                    onClick={() => handleTabSwitch(t.key)}
                    className={`admin-tab text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold ${
                      activeTab === t.key
                        ? 'active bg-sky-500/20 text-white'
                        : 'text-slate-300 hover:bg-white/10'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </aside>

              <section
                id="adminPanel"
                className="bg-[#0a1724] border border-sky-200/20 rounded-2xl p-5"
              >
                {activeTab === 'overview' && (
                  <div>
                    <h2 className="text-lg font-bold mb-4">Dashboard Overview</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
                      <div className="bg-[#0f2334] border border-sky-200/15 rounded-2xl p-4">
                        <small className="text-slate-400">Total Artikel</small>
                        <strong className="block text-2xl mt-1">{articles.length}</strong>
                      </div>
                      <div className="bg-[#0f2334] border border-sky-200/15 rounded-2xl p-4">
                        <small className="text-slate-400">Total Karya</small>
                        <strong className="block text-2xl mt-1">{portfolio.length}</strong>
                      </div>
                      <div className="bg-[#0f2334] border border-sky-200/15 rounded-2xl p-4">
                        <small className="text-slate-400">Mode CMS</small>
                        <strong className="block text-base mt-2 text-emerald-400">
                          {demoMode ? 'DEMO LOKAL' : 'FIREBASE ONLINE'}
                        </strong>
                      </div>
                    </div>
                    <div className="bg-[#0f2334] border border-sky-200/15 rounded-2xl p-4">
                      <h3 className="font-bold text-sm mb-1">Selamat datang di CMS ARI SENSEI</h3>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        Kelola artikel dan portofolio Anda dari menu di samping. Konten berstatus Publikasi akan langsung tampil di halaman utama.
                      </p>
                    </div>
                  </div>
                )}

                {activeTab === 'photos' && (
                  <div>
                    <h2 className="text-lg font-bold mb-1">
                      Kelola 6 Slot Foto Website (Khusus Admin)
                    </h2>
                    <p className="text-xs text-slate-400 mb-4">
                      Pengunjung biasa tidak dapat mengganti foto. Anda bisa mengunggah file langsung dari perangkat (otomatis dikompres) atau menempelkan URL gambar untuk setiap slot.
                    </p>

                    <div className="space-y-4">
                      {/* SLOT 1: HERO UTAMA */}
                      <div className="p-4 rounded-2xl bg-[#06111c] border border-sky-400/25">
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                          <label className="text-xs font-extrabold text-sky-300">
                            SLOT 1 · Foto Utama Tengah (Hero)
                          </label>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 font-semibold">
                            Auto Hapus Background Putih
                          </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                          <div>
                            <label
                              htmlFor="cmsFile-hero"
                              className="block text-[10px] text-slate-400 mb-1"
                            >
                              Unggah dari Perangkat
                            </label>
                            <input
                              id="cmsFile-hero"
                              type="file"
                              accept="image/*"
                              onChange={handleHeroFileChange}
                              className="block w-full text-xs file:mr-3 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-[11px] file:font-bold file:bg-sky-500 file:text-white cursor-pointer"
                            />
                          </div>
                          <div>
                            <label
                              htmlFor="cmsUrl-hero"
                              className="block text-[10px] text-slate-400 mb-1"
                            >
                              Atau URL / Path Foto
                            </label>
                            <input
                              id="cmsUrl-hero"
                              value={urlInputs.hero}
                              onChange={(e) =>
                                setUrlInputs((prev) => ({ ...prev, hero: e.target.value }))
                              }
                              placeholder="https://... atau assets/hero.png"
                              className="w-full px-3 py-2 rounded-xl bg-[#0b1b2b] border border-sky-200/20 text-xs text-white"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-sky-200/15">
                          <div>
                            <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer mb-1.5">
                              <input
                                id="cmsAutoRemoveBg"
                                type="checkbox"
                                checked={autoRemoveBg}
                                onChange={(e) => {
                                  const checked = e.target.checked;
                                  setAutoRemoveBg(checked);
                                  if (rawHeroImageRef.current) {
                                    processHeroImage(rawHeroImageRef.current, checked, bgThreshold);
                                  }
                                }}
                                className="accent-sky-500 w-4 h-4"
                              />
                              <span>Hapus Background Putih Otomatis</span>
                            </label>
                            <div className="flex justify-between text-[10px] text-slate-400">
                              <span>Sensitivitas Hapus Putih</span>
                              <span id="cmsThresholdVal">{bgThreshold}</span>
                            </div>
                            <input
                              id="cmsBgThreshold"
                              type="range"
                              min="185"
                              max="252"
                              value={bgThreshold}
                              onChange={(e) => {
                                const val = Number(e.target.value);
                                setBgThreshold(val);
                                if (rawHeroImageRef.current) {
                                  processHeroImage(rawHeroImageRef.current, autoRemoveBg, val);
                                }
                              }}
                              aria-label="Sensitivitas Hapus Putih"
                              className="w-full accent-sky-500"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <div className="flex justify-between text-[10px] text-slate-400">
                              <span>Skala / Ukuran Foto</span>
                              <span id="cmsHeroScaleVal">{heroScale}%</span>
                            </div>
                            <input
                              id="cmsHeroScale"
                              type="range"
                              min="70"
                              max="145"
                              value={heroScale}
                              onChange={(e) => {
                                const val = Number(e.target.value);
                                setHeroScale(val);
                                onSaveSettings({
                                  ...siteSettings,
                                  heroTransform: { scale: val, offsetY: heroOffsetY },
                                });
                              }}
                              aria-label="Skala / Ukuran Foto"
                              className="w-full accent-sky-500"
                            />
                            <div className="flex justify-between text-[10px] text-slate-400">
                              <span>Geser Atas / Bawah</span>
                              <span id="cmsHeroOffsetVal">{heroOffsetY}px</span>
                            </div>
                            <input
                              id="cmsHeroOffsetY"
                              type="range"
                              min="-120"
                              max="120"
                              value={heroOffsetY}
                              onChange={(e) => {
                                const val = Number(e.target.value);
                                setHeroOffsetY(val);
                                onSaveSettings({
                                  ...siteSettings,
                                  heroTransform: { scale: heroScale, offsetY: val },
                                });
                              }}
                              aria-label="Geser Atas / Bawah"
                              className="w-full accent-sky-500"
                            />
                          </div>
                        </div>
                      </div>

                      {/* SLOT 2 - 6 */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {(
                          [
                            { key: 'avatar', title: 'SLOT 2 · Foto Profil Bulat (Kiri Atas)' },
                            { key: 'writerCard', title: 'SLOT 3 · Foto Kartu PENULIS' },
                            { key: 'gallery1', title: 'SLOT 4 · Foto Galeri Kanan Atas' },
                            { key: 'gallery2', title: 'SLOT 5 · Foto Galeri Kanan Bawah' },
                            { key: 'aboutPhoto', title: 'SLOT 6 · Foto Profil Halaman ABOUT' },
                          ] as const
                        ).map((slot) => (
                          <div
                            key={slot.key}
                            className={`p-3.5 rounded-2xl bg-[#06111c] border border-sky-200/15 space-y-2 ${
                              slot.key === 'aboutPhoto' ? 'sm:col-span-2' : ''
                            }`}
                          >
                            <label
                              htmlFor={`cmsFile-${slot.key}`}
                              className="block text-xs font-bold text-sky-300"
                            >
                              {slot.title}
                            </label>
                            <input
                              id={`cmsFile-${slot.key}`}
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleOtherFileChange(slot.key, e)}
                              className="block w-full text-[11px] file:mr-2 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-[10px] file:font-bold file:bg-slate-600 file:text-white cursor-pointer"
                            />
                            <input
                              id={`cmsUrl-${slot.key}`}
                              value={urlInputs[slot.key]}
                              onChange={(e) =>
                                setUrlInputs((prev) => ({ ...prev, [slot.key]: e.target.value }))
                              }
                              aria-label={`URL ${slot.title}`}
                              placeholder="Atau tempel URL foto (https://...)"
                              className="w-full px-3 py-1.5 rounded-lg bg-[#0b1b2b] border border-sky-200/15 text-[11px] text-white"
                            />
                          </div>
                        ))}
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                        <p className="text-[11px] text-slate-400">
                          Tip: Untuk situs online dengan banyak foto resolusi tinggi, gunakan URL gambar atau simpan ke folder <code>assets/</code>.
                        </p>
                        <button
                          type="button"
                          id="saveAllPhotosBtn"
                          onClick={handleSaveAllPhotos}
                          className="px-5 py-2.5 rounded-xl bg-sky-300 hover:bg-sky-200 text-slate-950 text-xs font-extrabold"
                        >
                          Simpan Semua Foto
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'profile' && (
                  <div>
                    <h2 className="text-lg font-bold mb-1">
                      Edit Profil, Halaman Home &amp; About
                    </h2>
                    <p className="text-xs text-slate-400 mb-4">
                      Perubahan di sini langsung memperbarui halaman Home dan About Anda. Untuk mengganti foto, gunakan menu <strong>📷 Kelola Foto</strong>.
                    </p>
                    <form id="profileForm" onSubmit={handleProfileSubmit} className="space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label htmlFor="pf_fullName" className="block text-[11px] text-sky-200 mb-1">
                            Nama Lengkap / Judul Utama
                          </label>
                          <input
                            id="pf_fullName"
                            required
                            value={profileForm.fullName}
                            onChange={(e) =>
                              setProfileForm((p) => ({ ...p, fullName: e.target.value }))
                            }
                            className="w-full px-3 py-2 rounded-xl bg-[#06111c] border border-sky-200/20 text-xs text-white"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="pf_degreeName"
                            className="block text-[11px] text-sky-200 mb-1"
                          >
                            Nama dengan Gelar (About)
                          </label>
                          <input
                            id="pf_degreeName"
                            value={profileForm.degreeName}
                            onChange={(e) =>
                              setProfileForm((p) => ({ ...p, degreeName: e.target.value }))
                            }
                            className="w-full px-3 py-2 rounded-xl bg-[#06111c] border border-sky-200/20 text-xs text-white"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="pf_brandAlias"
                            className="block text-[11px] text-sky-200 mb-1"
                          >
                            Nama Panggilan / Brand
                          </label>
                          <input
                            id="pf_brandAlias"
                            value={profileForm.brandAlias}
                            onChange={(e) =>
                              setProfileForm((p) => ({ ...p, brandAlias: e.target.value }))
                            }
                            className="w-full px-3 py-2 rounded-xl bg-[#06111c] border border-sky-200/20 text-xs text-white"
                          />
                        </div>
                        <div>
                          <label htmlFor="pf_handle" className="block text-[11px] text-sky-200 mb-1">
                            Username / Handle
                          </label>
                          <input
                            id="pf_handle"
                            value={profileForm.handle}
                            onChange={(e) =>
                              setProfileForm((p) => ({ ...p, handle: e.target.value }))
                            }
                            className="w-full px-3 py-2 rounded-xl bg-[#06111c] border border-sky-200/20 text-xs text-white"
                          />
                        </div>
                      </div>
                      <div>
                        <label htmlFor="pf_subtitle" className="block text-[11px] text-sky-200 mb-1">
                          Subtitle Home
                        </label>
                        <input
                          id="pf_subtitle"
                          value={profileForm.subtitle}
                          onChange={(e) =>
                            setProfileForm((p) => ({ ...p, subtitle: e.target.value }))
                          }
                          className="w-full px-3 py-2 rounded-xl bg-[#06111c] border border-sky-200/20 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label htmlFor="pf_roleLine" className="block text-[11px] text-sky-200 mb-1">
                          Baris Profesi (Halaman About)
                        </label>
                        <input
                          id="pf_roleLine"
                          value={profileForm.roleLine}
                          onChange={(e) =>
                            setProfileForm((p) => ({ ...p, roleLine: e.target.value }))
                          }
                          className="w-full px-3 py-2 rounded-xl bg-[#06111c] border border-sky-200/20 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label htmlFor="pf_bioShort" className="block text-[11px] text-sky-200 mb-1">
                          Bio Singkat (Atas Home)
                        </label>
                        <textarea
                          id="pf_bioShort"
                          rows={2}
                          value={profileForm.bioShort}
                          onChange={(e) =>
                            setProfileForm((p) => ({ ...p, bioShort: e.target.value }))
                          }
                          className="w-full px-3 py-2 rounded-xl bg-[#06111c] border border-sky-200/20 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label htmlFor="pf_introBio" className="block text-[11px] text-sky-200 mb-1">
                          Teks Introduce Myself (Bawah Home)
                        </label>
                        <textarea
                          id="pf_introBio"
                          rows={2}
                          value={profileForm.introBio}
                          onChange={(e) =>
                            setProfileForm((p) => ({ ...p, introBio: e.target.value }))
                          }
                          className="w-full px-3 py-2 rounded-xl bg-[#06111c] border border-sky-200/20 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label htmlFor="pf_aboutBio" className="block text-[11px] text-sky-200 mb-1">
                          Bio Lengkap (Halaman About)
                        </label>
                        <textarea
                          id="pf_aboutBio"
                          rows={3}
                          value={profileForm.aboutBio}
                          onChange={(e) =>
                            setProfileForm((p) => ({ ...p, aboutBio: e.target.value }))
                          }
                          className="w-full px-3 py-2 rounded-xl bg-[#06111c] border border-sky-200/20 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label htmlFor="pf_tagline" className="block text-[11px] text-sky-200 mb-1">
                          Tagline Bawah Home
                        </label>
                        <input
                          id="pf_tagline"
                          value={profileForm.tagline}
                          onChange={(e) =>
                            setProfileForm((p) => ({ ...p, tagline: e.target.value }))
                          }
                          className="w-full px-3 py-2 rounded-xl bg-[#06111c] border border-sky-200/20 text-xs text-white"
                        />
                      </div>

                      <button
                        type="submit"
                        className="px-5 py-2.5 rounded-xl bg-sky-300 hover:bg-sky-200 text-slate-950 text-xs font-extrabold"
                      >
                        Simpan Perubahan Profil
                      </button>
                    </form>
                  </div>
                )}

                {activeTab === 'socials' && (
                  <div>
                    <h2 className="text-lg font-bold mb-1">Kelola Media Sosial &amp; Tautan</h2>
                    <p className="text-xs text-slate-400 mb-4">
                      Semua link yang diisi di sini otomatis aktif di halaman Home, About, dan bagian Contact. Kosongkan jika ingin disembunyikan.
                    </p>
                    <form id="socialsForm" onSubmit={handleSocialsSubmit} className="space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label
                            htmlFor="sc_instagram"
                            className="block text-[11px] text-sky-200 mb-1"
                          >
                            Instagram URL
                          </label>
                          <input
                            id="sc_instagram"
                            value={socialsForm.instagram}
                            onChange={(e) =>
                              setSocialsForm((s) => ({ ...s, instagram: e.target.value }))
                            }
                            placeholder="https://instagram.com/username"
                            className="w-full px-3 py-2 rounded-xl bg-[#06111c] border border-sky-200/20 text-xs text-white"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="sc_facebook"
                            className="block text-[11px] text-sky-200 mb-1"
                          >
                            Facebook URL
                          </label>
                          <input
                            id="sc_facebook"
                            value={socialsForm.facebook}
                            onChange={(e) =>
                              setSocialsForm((s) => ({ ...s, facebook: e.target.value }))
                            }
                            placeholder="https://facebook.com/username"
                            className="w-full px-3 py-2 rounded-xl bg-[#06111c] border border-sky-200/20 text-xs text-white"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="sc_youtube"
                            className="block text-[11px] text-sky-200 mb-1"
                          >
                            YouTube URL
                          </label>
                          <input
                            id="sc_youtube"
                            value={socialsForm.youtube}
                            onChange={(e) =>
                              setSocialsForm((s) => ({ ...s, youtube: e.target.value }))
                            }
                            placeholder="https://youtube.com/@channel"
                            className="w-full px-3 py-2 rounded-xl bg-[#06111c] border border-sky-200/20 text-xs text-white"
                          />
                        </div>
                        <div>
                          <label htmlFor="sc_tiktok" className="block text-[11px] text-sky-200 mb-1">
                            TikTok URL
                          </label>
                          <input
                            id="sc_tiktok"
                            value={socialsForm.tiktok}
                            onChange={(e) =>
                              setSocialsForm((s) => ({ ...s, tiktok: e.target.value }))
                            }
                            placeholder="https://tiktok.com/@username"
                            className="w-full px-3 py-2 rounded-xl bg-[#06111c] border border-sky-200/20 text-xs text-white"
                          />
                        </div>
                        <div>
                          <label htmlFor="sc_lynkid" className="block text-[11px] text-sky-200 mb-1">
                            Lynk.id / Katalog Produk URL
                          </label>
                          <input
                            id="sc_lynkid"
                            value={socialsForm.lynkid}
                            onChange={(e) =>
                              setSocialsForm((s) => ({ ...s, lynkid: e.target.value }))
                            }
                            placeholder="https://lynk.id/arisensei"
                            className="w-full px-3 py-2 rounded-xl bg-[#06111c] border border-sky-200/20 text-xs text-white"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="sc_whatsapp"
                            className="block text-[11px] text-sky-200 mb-1"
                          >
                            WhatsApp Link (wa.me)
                          </label>
                          <input
                            id="sc_whatsapp"
                            value={socialsForm.whatsapp}
                            onChange={(e) =>
                              setSocialsForm((s) => ({ ...s, whatsapp: e.target.value }))
                            }
                            placeholder="https://wa.me/628..."
                            className="w-full px-3 py-2 rounded-xl bg-[#06111c] border border-sky-200/20 text-xs text-white"
                          />
                        </div>
                        <div className="sm:col-span-2">
                          <label htmlFor="sc_email" className="block text-[11px] text-sky-200 mb-1">
                            Email (awali dengan mailto:)
                          </label>
                          <input
                            id="sc_email"
                            value={socialsForm.email}
                            onChange={(e) =>
                              setSocialsForm((s) => ({ ...s, email: e.target.value }))
                            }
                            placeholder="mailto:email@gmail.com"
                            className="w-full px-3 py-2 rounded-xl bg-[#06111c] border border-sky-200/20 text-xs text-white"
                          />
                        </div>
                      </div>
                      <button
                        type="submit"
                        className="px-5 py-2.5 rounded-xl bg-sky-300 hover:bg-sky-200 text-slate-950 text-xs font-extrabold"
                      >
                        Simpan Semua Tautan
                      </button>
                    </form>
                  </div>
                )}

                {(activeTab === 'articles' || activeTab === 'portfolio') && (
                  <div>
                    <h2 className="text-lg font-bold mb-4">
                      Kelola {activeTab === 'articles' ? 'Artikel' : 'Portofolio'}
                    </h2>
                    <form
                      id="contentForm"
                      onSubmit={(e) => handleContentSubmit(currentKind, e)}
                      className="space-y-3 mb-6"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label htmlFor="title" className="block text-[11px] text-sky-200 mb-1">
                            Judul
                          </label>
                          <input
                            id="title"
                            required
                            maxLength={140}
                            value={contentTitle}
                            onChange={(e) => setContentTitle(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl bg-[#06111c] border border-sky-200/20 text-xs text-white"
                          />
                        </div>
                        <div>
                          <label htmlFor="category" className="block text-[11px] text-sky-200 mb-1">
                            Kategori
                          </label>
                          <input
                            id="category"
                            maxLength={60}
                            value={contentCategory}
                            onChange={(e) => setContentCategory(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl bg-[#06111c] border border-sky-200/20 text-xs text-white"
                          />
                        </div>
                      </div>
                      <div>
                        <label htmlFor="summary" className="block text-[11px] text-sky-200 mb-1">
                          Ringkasan
                        </label>
                        <textarea
                          id="summary"
                          maxLength={500}
                          rows={2}
                          value={contentSummary}
                          onChange={(e) => setContentSummary(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-[#06111c] border border-sky-200/20 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label htmlFor="imageUrl" className="block text-[11px] text-sky-200 mb-1">
                          URL Gambar (opsional)
                        </label>
                        <input
                          id="imageUrl"
                          type="url"
                          placeholder="https://..."
                          value={contentImageUrl}
                          onChange={(e) => setContentImageUrl(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-[#06111c] border border-sky-200/20 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label htmlFor="body" className="block text-[11px] text-sky-200 mb-1">
                          Isi Lengkap / Deskripsi
                        </label>
                        <textarea
                          id="body"
                          rows={3}
                          value={contentBody}
                          onChange={(e) => setContentBody(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-[#06111c] border border-sky-200/20 text-xs text-white"
                        />
                      </div>
                      <div className="flex flex-wrap items-center gap-3">
                        <select
                          id="published"
                          aria-label="Status Publikasi"
                          value={contentPublished}
                          onChange={(e) => setContentPublished(e.target.value)}
                          className="px-3 py-2 rounded-xl bg-[#06111c] border border-sky-200/20 text-xs text-white"
                        >
                          <option value="true">Publikasikan</option>
                          <option value="false">Simpan sebagai draft</option>
                        </select>
                        <button
                          type="submit"
                          className="px-4 py-2 rounded-xl bg-sky-300 hover:bg-sky-200 text-slate-950 text-xs font-extrabold"
                        >
                          Simpan Konten
                        </button>
                        <button
                          type="button"
                          onClick={resetContentForm}
                          className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-semibold"
                        >
                          Kosongkan
                        </button>
                      </div>
                    </form>

                    <div id="contentList" className="space-y-2.5">
                      {currentList.length > 0 ? (
                        currentList.map((x) => (
                          <div
                            key={x.id}
                            className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-[#0f2334] border border-sky-200/15 p-3 rounded-xl"
                          >
                            <div>
                              <strong className="text-xs sm:text-sm">{x.title}</strong>
                              <small className="block text-[11px] text-slate-400 mt-0.5">
                                {x.category || 'Tanpa kategori'} ·{' '}
                                {x.published ? 'Publikasi' : 'Draft'}
                              </small>
                            </div>
                            <div className="flex gap-2">
                              <button
                                type="button"
                                aria-label={`Edit ${x.title}`}
                                onClick={() => handleEditContentItem(x)}
                                className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-[11px] font-semibold"
                              >
                                Edit
                              </button>
                              <button
                                type="button"
                                aria-label={`Hapus ${x.title}`}
                                onClick={() => setPendingDelete({ kind: currentKind, id: x.id })}
                                className="px-3 py-1.5 rounded-lg bg-rose-900/70 hover:bg-rose-700 text-[11px] font-semibold"
                              >
                                Hapus
                              </button>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-slate-400">Belum ada konten.</p>
                      )}
                    </div>
                  </div>
                )}
              </section>
            </div>
          )}
        </div>
      </div>

      {/* CUSTOM CONFIRM DIALOG */}
      {pendingDelete && (
        <div
          id="confirmModal"
          className="fixed inset-0 z-[120] bg-black/75 backdrop-blur-sm p-4 flex items-center justify-center"
        >
          <div className="w-full max-w-sm rounded-2xl bg-[#0d1c2b] text-white border border-sky-200/25 p-5 shadow-2xl">
            <h3 className="text-base font-bold mb-2">Konfirmasi Hapus</h3>
            <p id="confirmMessage" className="text-xs text-slate-300 leading-relaxed mb-5">
              Hapus konten ini secara permanen?
            </p>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                id="confirmCancelBtn"
                onClick={() => setPendingDelete(null)}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-semibold"
              >
                Batal
              </button>
              <button
                type="button"
                id="confirmOkBtn"
                onClick={() => {
                  onDeleteContent(pendingDelete.kind, pendingDelete.id);
                  setPendingDelete(null);
                  onToast('Konten dihapus');
                }}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
