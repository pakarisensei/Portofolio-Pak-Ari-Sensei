import React, { useState } from 'react';
import {
  ContentItem,
  PageName,
  SiteSettings,
  extractCategories,
  filterArticlesList,
  filterPortfolioList,
  getActiveSocialItems,
  getPrimaryContactLink,
} from '../utils/cmsLogic';

interface PublicPagesViewProps {
  activePage: PageName;
  siteSettings: SiteSettings;
  articles: ContentItem[];
  portfolio: ContentItem[];
  onNavigatePage: (page: PageName) => void;
  onJump: (target: PageName | 'contact') => void;
  onOpenDetail: (kind: 'articles' | 'portfolio', item: ContentItem) => void;
}

export const PublicPagesView: React.FC<PublicPagesViewProps> = ({
  activePage,
  siteSettings,
  articles,
  portfolio,
  onNavigatePage,
  onJump,
  onOpenDetail,
}) => {
  const [articleSearch, setArticleSearch] = useState('');
  const [activeArticleCat, setActiveArticleCat] = useState('Semua');
  const [activePortfolioCat, setActivePortfolioCat] = useState('Semua');

  const socialItems = getActiveSocialItems(siteSettings);
  const primaryContact = getPrimaryContactLink(siteSettings.socials);
  const articleCategories = extractCategories(articles, true);
  const filteredArticles = filterArticlesList(articles, activeArticleCat, articleSearch, true);
  const leadArticle = filteredArticles.length > 0 ? filteredArticles[0] : null;

  const portfolioCategories = extractCategories(portfolio, true);
  const filteredPortfolio = filterPortfolioList(portfolio, activePortfolioCat, true);

  return (
    <>
      {/* =========================================================
          HALAMAN 2: ABOUT (FOTO PROFIL + MEDSOS & LINK + KEAHLIAN)
          ========================================================= */}
      {activePage === 'about' && (
        <div id="page-about" className="page-view active">
          <section className="hero-outer rounded-[34px] p-6 sm:p-10 mb-6">
            <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8 items-start">
              {/* KOLOM KIRI: FOTO PROFIL & IDENTITAS SINGKAT */}
              <div className="flex flex-col items-center text-center bento-glass rounded-3xl p-5">
                <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-3xl p-1.5 border-2 border-sky-400/45 bg-sky-500/10 shadow-xl overflow-hidden mb-4">
                  <div
                    id="aboutPhotoSlot"
                    className="w-full h-full rounded-2xl overflow-hidden bg-gradient-to-br from-sky-500/30 via-slate-800 to-slate-950 flex flex-col items-center justify-center text-sky-200 gap-1"
                  >
                    {siteSettings.photos?.aboutPhoto ? (
                      <img
                        src={siteSettings.photos.aboutPhoto}
                        alt="Foto Profil About"
                        className="w-full h-full object-cover"
                        style={{ objectPosition: '50% 15%' }}
                      />
                    ) : (
                      <>
                        <span className="text-4xl font-extrabold">AS</span>
                        <span className="text-[10px] tracking-widest opacity-70">ARI SENSEI</span>
                      </>
                    )}
                  </div>
                </div>

                <div id="aboutCardName" className="text-base font-extrabold tracking-wide">
                  {siteSettings.degreeName || siteSettings.fullName}
                </div>
                <div id="aboutCardAlias" className="text-xs font-semibold text-sky-400 mt-0.5 mb-4">
                  {`${siteSettings.handle || '@arhykbs'} · ${siteSettings.brandAlias || 'Ari Sensei'}`}
                </div>

                <div className="w-full grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => onNavigatePage('products')}
                    className="py-2 px-3 rounded-xl bg-sky-500/15 hover:bg-sky-500 hover:text-white border border-sky-400/30 text-[11px] font-bold transition"
                  >
                    ✦ Karya Digital
                  </button>
                  <button
                    type="button"
                    onClick={() => onJump('contact')}
                    className="py-2 px-3 rounded-xl border text-[11px] font-bold hover:border-sky-400 transition"
                    style={{ borderColor: 'var(--border-strong)' }}
                  >
                    ✉ Kolaborasi
                  </button>
                </div>
              </div>

              {/* KOLOM KANAN: BIO LENGKAP + MEDSOS & LINK AKTIF + STATISTIK */}
              <div>
                <span className="pill-badge inline-block px-4 py-1.5 rounded-full text-[10px] font-extrabold mb-3">
                  ABOUT · PROFIL LENGKAP
                </span>
                <h2
                  id="aboutHeadline"
                  className="font-display headline-metallic text-4xl sm:text-5xl lg:text-6xl uppercase leading-none mb-2"
                >
                  {(siteSettings.fullName || 'PAK ARI SENSEI').toUpperCase()}
                </h2>
                <p id="aboutRoleLine" className="text-xs sm:text-sm font-bold text-sky-400 mb-4">
                  {siteSettings.roleLine}
                </p>
                <p
                  id="aboutBioFull"
                  className="text-sm leading-relaxed mb-6"
                  style={{ color: 'var(--text-sub)' }}
                >
                  {siteSettings.aboutBio}
                </p>

                {/* TAUTAN MEDSOS & LINK PENTING */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xs font-extrabold tracking-[0.2em] uppercase text-sky-400">
                      Media Sosial &amp; Tautan Resmi
                    </h3>
                  </div>
                  <div id="aboutSocialGrid" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                    {socialItems.map((item) => (
                      <a
                        key={item.key}
                        href={item.href}
                        target={item.isMail ? undefined : '_blank'}
                        rel={item.isMail ? undefined : 'noopener noreferrer'}
                        className="bento-glass rounded-2xl p-3.5 flex items-center gap-3 hover:border-sky-400 transition group"
                      >
                        <div
                          className={`w-10 h-10 rounded-xl bg-sky-500/15 border border-sky-400/25 flex items-center justify-center font-extrabold ${item.color} shrink-0 group-hover:scale-105 transition`}
                        >
                          {item.icon}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-extrabold truncate group-hover:text-sky-400 transition">
                            {item.label}
                          </div>
                          <div className="text-[10px] truncate" style={{ color: 'var(--text-muted)' }}>
                            {item.desc}
                          </div>
                        </div>
                        <span className="text-xs opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition">
                          ↗
                        </span>
                      </a>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="bento-glass rounded-2xl p-4 text-center">
                    <div className="text-xl sm:text-2xl font-extrabold text-sky-400">PJOK</div>
                    <div className="text-[11px] mt-1" style={{ color: 'var(--text-muted)' }}>
                      Spesialisasi Guru
                    </div>
                  </div>
                  <div className="bento-glass rounded-2xl p-4 text-center">
                    <div className="text-xl sm:text-2xl font-extrabold text-sky-400">Design</div>
                    <div className="text-[11px] mt-1" style={{ color: 'var(--text-muted)' }}>
                      Visual &amp; Konten
                    </div>
                  </div>
                  <div className="bento-glass rounded-2xl p-4 text-center">
                    <div className="text-xl sm:text-2xl font-extrabold text-sky-400">EduTech</div>
                    <div className="text-[11px] mt-1" style={{ color: 'var(--text-muted)' }}>
                      Inovasi Digital
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* BAR FOKUS KEAHLIAN */}
            <div className="bento-glass rounded-3xl p-6 mt-6">
              <h3 className="text-xs font-extrabold tracking-[0.2em] uppercase text-sky-400 mb-4">
                Fokus Keahlian
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span>Pembelajaran &amp; Kurikulum PJOK</span>
                    <span>95%</span>
                  </div>
                  <div className="h-2 rounded-full bg-sky-500/15 overflow-hidden">
                    <div className="h-full w-[95%] rounded-full bg-sky-500"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span>Graphic Design &amp; Visual Branding</span>
                    <span>90%</span>
                  </div>
                  <div className="h-2 rounded-full bg-sky-500/15 overflow-hidden">
                    <div className="h-full w-[90%] rounded-full bg-sky-400"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span>Teknologi Pendidikan &amp; AI untuk Guru</span>
                    <span>92%</span>
                  </div>
                  <div className="h-2 rounded-full bg-sky-500/15 overflow-hidden">
                    <div className="h-full w-[92%] rounded-full bg-indigo-400"></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span>Content Creation &amp; Penulisan Edukatif</span>
                    <span>88%</span>
                  </div>
                  <div className="h-2 rounded-full bg-sky-500/15 overflow-hidden">
                    <div className="h-full w-[88%] rounded-full bg-emerald-400"></div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="tile-card rounded-3xl p-6">
              <div className="text-xs font-extrabold tracking-widest text-sky-400 mb-2">PERAN 01</div>
              <h3 className="text-base font-bold mb-2">Guru PJOK Profesional</h3>
              <p className="text-xs sm:text-sm leading-relaxed" style={{ color: 'var(--text-sub)' }}>
                Merancang pembelajaran olahraga yang aktif, inklusif, menyenangkan, dan selaras dengan Kurikulum Merdeka serta pendekatan Pembelajaran Mendalam.
              </p>
            </div>
            <div className="tile-card rounded-3xl p-6">
              <div className="text-xs font-extrabold tracking-widest text-sky-400 mb-2">PERAN 02</div>
              <h3 className="text-base font-bold mb-2">Kreator &amp; Desainer Grafis</h3>
              <p className="text-xs sm:text-sm leading-relaxed" style={{ color: 'var(--text-sub)' }}>
                Membuat poster edukasi, infografis olahraga, media presentasi interaktif, dan konten visual kreatif yang mudah dipahami lintas audiens.
              </p>
            </div>
            <div className="tile-card rounded-3xl p-6">
              <div className="text-xs font-extrabold tracking-widest text-sky-400 mb-2">PERAN 03</div>
              <h3 className="text-base font-bold mb-2">Pengembang Ekosistem Digital</h3>
              <p className="text-xs sm:text-sm leading-relaxed" style={{ color: 'var(--text-sub)' }}>
                Membangun alat bantu, template administrasi, dan asisten digital untuk mempercepat kerja administratif para pendidik Indonesia.
              </p>
            </div>
          </section>
        </div>
      )}

      {/* =========================================================
          HALAMAN 3: WRITER (TAMPILAN MAJALAH / BLOG EDITORIAL + FILTER)
          ========================================================= */}
      {activePage === 'writer' && (
        <div id="page-writer" className="page-view active">
          <section className="hero-outer rounded-[34px] p-6 sm:p-8 mb-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <span className="pill-badge inline-block px-4 py-1.5 rounded-full text-[10px] font-extrabold mb-3">
                  WRITER · RUANG LITERASI
                </span>
                <h2 className="font-display headline-metallic text-4xl sm:text-5xl uppercase leading-none">
                  ARTIKEL &amp; CATATAN
                </h2>
                <p className="text-xs sm:text-sm mt-2 max-w-xl" style={{ color: 'var(--text-sub)' }}>
                  Kumpulan tulisan seputar pembelajaran PJOK, pemanfaatan AI untuk pendidik, desain media ajar, dan refleksi dunia pendidikan.
                </p>
              </div>
              <div className="w-full md:w-72">
                <input
                  id="articleSearch"
                  type="search"
                  value={articleSearch}
                  onChange={(e) => setArticleSearch(e.target.value)}
                  placeholder="Cari judul artikel..."
                  aria-label="Cari judul artikel"
                  className="w-full px-4 py-2.5 rounded-full text-xs border outline-none focus:border-sky-400"
                  style={{
                    background: 'var(--input-bg)',
                    borderColor: 'var(--border-strong)',
                    color: 'var(--text-main)',
                  }}
                />
              </div>
            </div>
            <div id="articleCategoryPills" className="flex flex-wrap gap-2 mt-5">
              {articleCategories.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setActiveArticleCat(c)}
                  className={`article-cat-btn px-3.5 py-1.5 rounded-full text-[11px] font-bold transition border ${
                    activeArticleCat === c
                      ? 'bg-sky-500 text-white border-sky-500'
                      : 'border-sky-400/25 hover:border-sky-400'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </section>

          <div id="featuredArticleSlot" className="mb-6">
            {leadArticle && (
              <article
                onClick={() => onOpenDetail('articles', leadArticle)}
                className="article-open-card cursor-pointer tile-card rounded-3xl p-6 sm:p-7 grid grid-cols-1 md:grid-cols-[1.3fr_0.7fr] gap-5 items-center"
              >
                <div>
                  <span className="inline-block px-3 py-1 rounded-full bg-sky-500/15 text-sky-400 text-[10px] font-extrabold tracking-widest uppercase mb-2">
                    ARTIKEL UTAMA · {leadArticle.category || 'Umum'}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-extrabold leading-snug mb-2">
                    {leadArticle.title}
                  </h3>
                  <p className="text-xs sm:text-sm leading-relaxed mb-4" style={{ color: 'var(--text-sub)' }}>
                    {leadArticle.summary || ''}
                  </p>
                  <span className="text-xs font-bold text-sky-400">Baca Selengkapnya →</span>
                </div>
                <div className="rounded-2xl overflow-hidden h-44 bg-gradient-to-br from-sky-500/20 to-slate-900/60 border border-sky-400/20 flex items-center justify-center">
                  {leadArticle.imageUrl ? (
                    <img
                      src={leadArticle.imageUrl}
                      alt={leadArticle.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-4xl text-sky-400/60">✎</span>
                  )}
                </div>
              </article>
            )}
          </div>

          <div id="articleCards" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredArticles.length > 0 ? (
              filteredArticles.map((x) => (
                <article
                  key={x.id}
                  onClick={() => onOpenDetail('articles', x)}
                  className="article-open-card cursor-pointer tile-card rounded-3xl p-5 flex flex-col justify-between"
                >
                  <div>
                    {x.imageUrl && (
                      <img
                        src={x.imageUrl}
                        alt={x.title}
                        className="w-full h-40 object-cover rounded-2xl mb-3"
                      />
                    )}
                    <div className="text-[10px] font-bold tracking-widest uppercase text-sky-500 mb-1.5">
                      {x.category || 'Umum'}
                    </div>
                    <h3 className="text-base font-bold mb-1.5 leading-snug">{x.title}</h3>
                    <p className="text-xs sm:text-sm leading-relaxed mb-4" style={{ color: 'var(--text-sub)' }}>
                      {x.summary || ''}
                    </p>
                  </div>
                  <span className="text-[11px] font-bold text-sky-400">Baca Artikel →</span>
                </article>
              ))
            ) : (
              <p className="text-xs opacity-70">Tidak ada artikel yang cocok.</p>
            )}
          </div>
        </div>
      )}

      {/* =========================================================
          HALAMAN 4: DESIGN (TAMPILAN GALERI SHOWCASE & LIGHTBOX)
          ========================================================= */}
      {activePage === 'design' && (
        <div id="page-design" className="page-view active">
          <section className="hero-outer rounded-[34px] p-6 sm:p-8 mb-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <span className="pill-badge inline-block px-4 py-1.5 rounded-full text-[10px] font-extrabold mb-3">
                  DESIGN · VISUAL SHOWCASE
                </span>
                <h2 className="font-display headline-metallic text-4xl sm:text-5xl uppercase leading-none">
                  DESIGN &amp; PORTOFOLIO
                </h2>
                <p className="text-xs sm:text-sm mt-2 max-w-xl" style={{ color: 'var(--text-sub)' }}>
                  Eksplorasi karya desain grafis, identitas visual, antarmuka web edukasi, serta konten kreatif yang dikelola langsung melalui CMS.
                </p>
              </div>
              <button
                type="button"
                onClick={() => onJump('contact')}
                className="px-5 py-2.5 rounded-full bg-sky-500 hover:bg-sky-400 text-white text-xs font-bold tracking-wider transition w-max"
              >
                KOLABORASI DESAIN ↗
              </button>
            </div>
            <div id="portfolioCategoryPills" className="flex flex-wrap gap-2 mt-5">
              {portfolioCategories.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setActivePortfolioCat(c)}
                  className={`portfolio-cat-btn px-3.5 py-1.5 rounded-full text-[11px] font-bold transition border ${
                    activePortfolioCat === c
                      ? 'bg-sky-500 text-white border-sky-500'
                      : 'border-sky-400/25 hover:border-sky-400'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </section>

          <div id="portfolioCards" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredPortfolio.length > 0 ? (
              filteredPortfolio.map((x) => (
                <article
                  key={x.id}
                  onClick={() => onOpenDetail('portfolio', x)}
                  className="portfolio-open-card cursor-pointer tile-card rounded-3xl overflow-hidden flex flex-col group"
                >
                  <div
                    className="h-44 bg-gradient-to-br from-sky-500/20 via-slate-800/60 to-slate-950/80 flex items-center justify-center overflow-hidden border-b"
                    style={{ borderColor: 'var(--border-soft)' }}
                  >
                    {x.imageUrl ? (
                      <img
                        src={x.imageUrl}
                        alt={x.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      />
                    ) : (
                      <span className="text-4xl text-sky-400/70">✧</span>
                    )}
                  </div>
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="text-[10px] font-bold tracking-widest uppercase text-sky-500 mb-1">
                        {x.category || 'Design'}
                      </div>
                      <h3 className="text-base font-bold mb-1.5 leading-snug">{x.title}</h3>
                      <p className="text-xs sm:text-sm leading-relaxed mb-3" style={{ color: 'var(--text-sub)' }}>
                        {x.summary || ''}
                      </p>
                    </div>
                    <span className="text-[11px] font-bold text-sky-400">Lihat Detail Karya ↗</span>
                  </div>
                </article>
              ))
            ) : (
              <p className="text-xs opacity-70">Belum ada karya portofolio.</p>
            )}
          </div>
        </div>
      )}

      {/* =========================================================
          HALAMAN 5: BELAJAR (TAMPILAN LEARNING HUB & JALUR MATERI)
          ========================================================= */}
      {activePage === 'learning' && (
        <div id="page-learning" className="page-view active">
          <section className="hero-outer rounded-[34px] p-6 sm:p-8 mb-6">
            <span className="pill-badge inline-block px-4 py-1.5 rounded-full text-[10px] font-extrabold mb-3">
              PUSAT BELAJAR · EDUKASI
            </span>
            <h2 className="font-display headline-metallic text-4xl sm:text-5xl uppercase leading-none mb-2">
              RUANG BELAJAR GURU &amp; SISWA
            </h2>
            <p className="text-xs sm:text-sm max-w-2xl" style={{ color: 'var(--text-sub)' }}>
              Pilih jalur belajar yang Anda butuhkan — mulai dari materi praktik PJOK, penyusunan administrasi Kurikulum Merdeka, hingga tutorial teknologi pendidikan.
            </p>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <article className="tile-card rounded-3xl p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-sky-500/15 border border-sky-400/30 flex items-center justify-center text-2xl">
                    ⚽
                  </div>
                  <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-sky-500/15 text-sky-400">
                    MODUL PRAKTIK
                  </span>
                </div>
                <h3 className="text-lg font-extrabold mb-2">Pembelajaran PJOK</h3>
                <p className="text-xs sm:text-sm leading-relaxed mb-4" style={{ color: 'var(--text-sub)' }}>
                  Materi, variasi permainan pemanasan, teknik dasar olahraga, dan rubrik asesmen praktik untuk SD, SMP, dan SMA.
                </p>
                <ul className="space-y-2 text-xs mb-5" style={{ color: 'var(--text-sub)' }}>
                  <li className="flex items-center gap-2">
                    <span className="text-sky-400">✓</span> Permainan Bola Besar &amp; Bola Kecil
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-sky-400">✓</span> Kebugaran Jasmani &amp; Senam Lantai
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-sky-400">✓</span> Pendekatan Deep Learning di Lapangan
                  </li>
                </ul>
              </div>
              <button
                type="button"
                onClick={() => onNavigatePage('writer')}
                className="w-full py-2.5 rounded-xl bg-sky-500/15 hover:bg-sky-500 hover:text-white border border-sky-400/30 text-xs font-bold transition"
              >
                Baca Materi Terkait →
              </button>
            </article>

            <article className="tile-card rounded-3xl p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 border border-emerald-400/30 flex items-center justify-center text-2xl">
                    ▣
                  </div>
                  <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400">
                    KURIKULUM MERDEKA
                  </span>
                </div>
                <h3 className="text-lg font-extrabold mb-2">Administrasi Guru</h3>
                <p className="text-xs sm:text-sm leading-relaxed mb-4" style={{ color: 'var(--text-sub)' }}>
                  Panduan dan contoh struktur perangkat ajar agar guru lebih siap mengajar tanpa terbebani administrasi berulang.
                </p>
                <ul className="space-y-2 text-xs mb-5" style={{ color: 'var(--text-sub)' }}>
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-400">✓</span> Alur Tujuan Pembelajaran (ATP) &amp; CP
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-400">✓</span> Template Modul Ajar &amp; LKPD PJOK
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-emerald-400">✓</span> Format Asesmen Formatif &amp; Sumatif
                  </li>
                </ul>
              </div>
              <button
                type="button"
                onClick={() => onNavigatePage('products')}
                className="w-full py-2.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500 hover:text-white border border-emerald-400/30 text-xs font-bold transition"
              >
                Lihat Perangkat &amp; Template →
              </button>
            </article>

            <article className="tile-card rounded-3xl p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-500/15 border border-indigo-400/30 flex items-center justify-center text-2xl">
                    ✦
                  </div>
                  <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-indigo-500/15 text-indigo-400">
                    EDUTECH &amp; AI
                  </span>
                </div>
                <h3 className="text-lg font-extrabold mb-2">Teknologi Pendidikan</h3>
                <p className="text-xs sm:text-sm leading-relaxed mb-4" style={{ color: 'var(--text-sub)' }}>
                  Tutorial pemanfaatan AI, desain presentasi modern, dan web tools gratis untuk meningkatkan kualitas pembelajaran digital.
                </p>
                <ul className="space-y-2 text-xs mb-5" style={{ color: 'var(--text-sub)' }}>
                  <li className="flex items-center gap-2">
                    <span className="text-indigo-400">✓</span> Prompting AI untuk Perangkat Ajar
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-indigo-400">✓</span> Desain Media Visual &amp; Infografis
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-indigo-400">✓</span> Website Portofolio &amp; CMS Guru
                  </li>
                </ul>
              </div>
              <button
                type="button"
                onClick={() => onNavigatePage('design')}
                className="w-full py-2.5 rounded-xl bg-indigo-500/15 hover:bg-indigo-500 hover:text-white border border-indigo-400/30 text-xs font-bold transition"
              >
                Eksplorasi Karya Digital →
              </button>
            </article>
          </div>
        </div>
      )}

      {/* =========================================================
          HALAMAN 6: KARYA (TAMPILAN ETALASE PRODUK DIGITAL)
          ========================================================= */}
      {activePage === 'products' && (
        <div id="page-products" className="page-view active">
          <section className="hero-outer rounded-[34px] p-6 sm:p-9 mb-6">
            <div className="grid grid-cols-1 lg:grid-cols-[1.25fr_0.75fr] gap-6 items-center">
              <div>
                <span className="pill-badge inline-block px-4 py-1.5 rounded-full text-[10px] font-extrabold mb-3">
                  FLAGSHIP PRODUCT · ARI SENSEI
                </span>
                <h2 className="font-display headline-metallic text-4xl sm:text-5xl uppercase leading-none mb-3">
                  ASISTEN DIGITAL GURU PJOK
                </h2>
                <p className="text-xs sm:text-sm leading-relaxed mb-5" style={{ color: 'var(--text-sub)' }}>
                  Solusi digital siap pakai yang dirancang khusus membantu guru PJOK menyusun modul ajar, rubrik penilaian, hingga ide aktivitas pembelajaran secara cepat, rapi, dan terstruktur.
                </p>
                <div className="flex flex-wrap gap-3">
                  <a
                    href="#contact"
                    onClick={(e) => {
                      e.preventDefault();
                      onJump('contact');
                    }}
                    className="px-5 py-2.5 rounded-full bg-sky-500 hover:bg-sky-400 text-white text-xs font-bold tracking-wider transition"
                  >
                    DAPATKAN AKSES ↗
                  </a>
                  <button
                    type="button"
                    onClick={() => onNavigatePage('learning')}
                    className="px-5 py-2.5 rounded-full border text-xs font-bold tracking-wider transition"
                    style={{ borderColor: 'var(--border-strong)' }}
                  >
                    PELAJARI FITUR
                  </button>
                </div>
              </div>
              <div className="bento-glass rounded-3xl p-5 space-y-2.5 text-xs">
                <div className="font-extrabold text-sky-400 tracking-wider uppercase">
                  YANG ANDA DAPATKAN:
                </div>
                <div className="flex items-center gap-2">
                  <span>⚡</span> Generator &amp; Template Perangkat Ajar PJOK
                </div>
                <div className="flex items-center gap-2">
                  <span>📊</span> Rubrik Penilaian Praktik &amp; Sikap Siap Cetak
                </div>
                <div className="flex items-center gap-2">
                  <span>🎨</span> Bonus Template Presentasi Visual Kelas
                </div>
                <div className="flex items-center gap-2">
                  <span>🔄</span> Pembaruan Berkala Mengikuti Kurikulum
                </div>
              </div>
            </div>
          </section>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <article className="tile-card rounded-3xl p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl">▣</span>
                  <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-sky-500/15 text-sky-400">
                    POPULER
                  </span>
                </div>
                <h3 className="text-base font-extrabold mb-1.5">Bundel Perangkat Ajar PJOK</h3>
                <p className="text-xs sm:text-sm leading-relaxed mb-4" style={{ color: 'var(--text-sub)' }}>
                  Koleksi lengkap ATP, Modul Ajar, LKPD, dan instrumen asesmen siap edit sesuai kebutuhan sekolah.
                </p>
              </div>
              <a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  onJump('contact');
                }}
                className="inline-flex items-center justify-center py-2.5 rounded-xl bg-sky-500/15 hover:bg-sky-500 hover:text-white border border-sky-400/30 text-xs font-bold transition"
              >
                Tanya / Pesan Produk ↗
              </a>
            </article>

            <article className="tile-card rounded-3xl p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl">▤</span>
                  <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-400">
                    E-BOOK &amp; TEMPLATE
                  </span>
                </div>
                <h3 className="text-base font-extrabold mb-1.5">Template Desain &amp; E-Book Edukasi</h3>
                <p className="text-xs sm:text-sm leading-relaxed mb-4" style={{ color: 'var(--text-sub)' }}>
                  Template poster, slide presentasi interaktif, dan panduan praktis bagi guru serta kreator konten pendidikan.
                </p>
              </div>
              <a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  onJump('contact');
                }}
                className="inline-flex items-center justify-center py-2.5 rounded-xl bg-amber-500/15 hover:bg-amber-500 hover:text-white border border-amber-400/30 text-xs font-bold transition"
              >
                Lihat Katalog ↗
              </a>
            </article>

            <article className="tile-card rounded-3xl p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl">✦</span>
                  <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400">
                    LAYANAN
                  </span>
                </div>
                <h3 className="text-base font-extrabold mb-1.5">Kolaborasi &amp; Pelatihan Guru</h3>
                <p className="text-xs sm:text-sm leading-relaxed mb-4" style={{ color: 'var(--text-sub)' }}>
                  Undang Ariansyah Imran untuk workshop desain grafis pendidikan, pemanfaatan AI, atau proyek digital sekolah.
                </p>
              </div>
              <a
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  onJump('contact');
                }}
                className="inline-flex items-center justify-center py-2.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500 hover:text-white border border-emerald-400/30 text-xs font-bold transition"
              >
                Diskusi Kolaborasi ↗
              </a>
            </article>
          </div>
        </div>
      )}

      {/* CONTACT (GLOBAL FOOTER SECTION) */}
      <section id="contact" className="pt-14 scroll-mt-24">
        <div className="flex items-center gap-4 mb-5">
          <h2 className="text-lg sm:text-xl font-extrabold tracking-[0.2em]">LET&apos;S CONNECT</h2>
          <div className="h-px flex-1 bg-gradient-to-r from-sky-400/40 to-transparent"></div>
        </div>
        <div className="tile-card rounded-3xl p-6 flex flex-col gap-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base sm:text-lg font-bold mb-1">Terhubung dan berkolaborasi</h3>
              <p className="text-xs sm:text-sm" style={{ color: 'var(--text-sub)' }}>
                Untuk kolaborasi pendidikan PJOK, desain grafis, pelatihan guru, dan pengembangan karya digital bersama Ariansyah Imran (Ari Sensei).
              </p>
            </div>
            <a
              id="contactPrimaryBtn"
              href={primaryContact}
              target={primaryContact.startsWith('mailto:') ? undefined : '_blank'}
              rel={primaryContact.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
              className="px-5 py-2.5 rounded-full bg-sky-500 hover:bg-sky-400 text-white text-xs font-bold tracking-wider transition whitespace-nowrap"
            >
              HUBUNGI ARI SENSEI ↗
            </a>
          </div>
          <div
            id="footerSocialLinks"
            className="flex flex-wrap gap-2 pt-3 border-t"
            style={{ borderColor: 'var(--border-soft)' }}
          >
            {socialItems.map((item) => (
              <a
                key={item.key}
                href={item.href}
                target={item.isMail ? undefined : '_blank'}
                rel={item.isMail ? undefined : 'noopener noreferrer'}
                className="px-3.5 py-1.5 rounded-full text-[11px] font-bold border hover:bg-sky-500 hover:text-white hover:border-sky-500 transition"
                style={{ borderColor: 'var(--border-strong)' }}
              >
                {item.icon} {item.label} ↗
              </a>
            ))}
          </div>
        </div>
      </section>

      <footer className="text-center pt-12 text-[11px] tracking-[0.2em]" style={{ color: 'var(--text-muted)' }}>
        © 2026 PAK ARI SENSEI · PERSONAL DIGITAL ECOSYSTEM
      </footer>
    </>
  );
};
