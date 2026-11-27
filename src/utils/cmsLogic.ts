export type PageName = 'home' | 'about' | 'writer' | 'design' | 'learning' | 'products';

export interface PhotoConfig {
  hero: string;
  avatar: string;
  writerCard: string;
  gallery1: string;
  gallery2: string;
  aboutPhoto: string;
}

export interface HeroTransform {
  scale: number;
  offsetY: number;
}

export interface SocialLinks {
  instagram: string;
  facebook: string;
  youtube: string;
  tiktok: string;
  lynkid: string;
  whatsapp: string;
  email: string;
}

export interface SiteSettings {
  fullName: string;
  degreeName: string;
  brandAlias: string;
  handle: string;
  subtitle: string;
  roleLine: string;
  bioShort: string;
  introBio: string;
  aboutBio: string;
  tagline: string;
  heroTransform: HeroTransform;
  photos: PhotoConfig;
  socials: SocialLinks;
}

export interface ContentItem {
  id: string;
  title: string;
  category: string;
  summary: string;
  imageUrl: string;
  body: string;
  published: boolean;
}

export interface SocialDisplayItem {
  key: keyof SocialLinks;
  label: string;
  desc: string;
  icon: string;
  badge: string;
  color: string;
  href: string;
  isMail: boolean;
}

export const PHOTO_CONFIG: PhotoConfig = {
  hero: '',
  avatar: '',
  writerCard: '',
  gallery1: '',
  gallery2: '',
  aboutPhoto: '',
};

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  fullName: 'Pak Ari Sensei',
  degreeName: 'Ariansyah Imran, S.Pd., Gr.',
  brandAlias: 'Pak Ari Sensei',
  handle: '@arhykbs',
  subtitle: 'Personal Digital Ecosystem',
  roleLine: 'S.Pd., Gr. · Pendidik PJOK · Digital Educator · Graphic Designer',
  bioShort:
    'Guru PJOK, Content Creator, Graphic Designer, dan Digital Educator. Ruang untuk berbagi karya, pengetahuan, kreativitas, serta inovasi pendidikan.',
  introBio:
    'Saya Ariansyah Imran, S.Pd., Gr. Seorang pendidik PJOK yang tertarik pada teknologi pendidikan, desain grafis, konten kreatif, dan pengembangan solusi digital untuk guru di Indonesia.',
  aboutBio:
    'Dikenal juga sebagai Ari Sensei, saya adalah seorang pendidik Pendidikan Jasmani, Olahraga, dan Kesehatan (PJOK) yang berfokus pada integrasi teknologi pendidikan, desain komunikasi visual, serta pengembangan solusi digital praktis untuk membantu guru dan siswa belajar lebih bermakna.',
  tagline: 'BERBAGI ILMU · BERKARYA · MENGINSPIRASI',
  heroTransform: { scale: 100, offsetY: 0 },
  photos: { ...PHOTO_CONFIG },
  socials: {
    instagram: 'https://instagram.com/arhykbs',
    facebook: 'https://facebook.com/arhykbs',
    youtube: 'https://youtube.com/@arisensei',
    tiktok: 'https://tiktok.com/@arhykbs',
    lynkid: 'https://lynk.id/arisensei',
    whatsapp: 'https://wa.me/6281234567890',
    email: 'mailto:arisensei.edu@gmail.com',
  },
};

export const DEFAULT_ARTICLES: ContentItem[] = [
  {
    id: 'demo-a1',
    title: 'Strategi Pembelajaran Mendalam (Deep Learning) di Kelas PJOK',
    category: 'Pendidikan PJOK',
    summary:
      'Panduan praktis menerapkan pembelajaran aktif yang bermakna dan menggembirakan di lapangan olahraga.',
    imageUrl: '',
    body: 'Pembelajaran PJOK modern memadukan gerak fisik, refleksi, dan kolaborasi siswa.',
    published: true,
  },
  {
    id: 'demo-a2',
    title: 'Memanfaatkan AI untuk Menyusun Modul Ajar Kurikulum Merdeka',
    category: 'Teknologi Guru',
    summary:
      'Tips prompting efektif bagi pendidik agar administrasi pembelajaran lebih cepat dan terstruktur.',
    imageUrl: '',
    body: 'Alur kerja digital membantu guru fokus pada pendampingan siswa.',
    published: true,
  },
  {
    id: 'demo-a3',
    title: 'Desain Media Presentasi Interaktif untuk Guru Masa Kini',
    category: 'Desain Grafis',
    summary:
      'Prinsip tipografi, kontras warna, dan layout visual agar materi ajar mudah dipahami peserta didik.',
    imageUrl: '',
    body: 'Visual yang rapi membantu meningkatkan fokus siswa.',
    published: true,
  },
];

export const DEFAULT_PORTFOLIO: ContentItem[] = [
  {
    id: 'demo-p1',
    title: 'Poster & Feed Edukasi PJOK',
    category: 'Graphic Design',
    summary:
      'Seri desain infografis teknik dasar olahraga dan kebugaran jasmani untuk media sosial.',
    imageUrl: '',
    body: 'Koleksi karya visual edukatif untuk komunitas guru dan siswa.',
    published: true,
  },
  {
    id: 'demo-p2',
    title: 'Asisten Digital Perangkat Ajar PJOK',
    category: 'Web & EduTech',
    summary:
      'Aplikasi web bantu guru menyusun ATP, modul ajar, serta rubrik penilaian praktik olahraga.',
    imageUrl: '',
    body: 'Ringan diakses lewat HP maupun laptop.',
    published: true,
  },
  {
    id: 'demo-p3',
    title: 'Brand Identity & Thumbnail Konten Edukasi',
    category: 'Content Creation',
    summary:
      'Konsep visual modern bertema dark-glass untuk kanal pembelajaran dan produk digital.',
    imageUrl: '',
    body: 'Konsistensi branding meningkatkan kepercayaan audiens digital.',
    published: true,
  },
];

export function normalizeLink(url = ''): string {
  const clean = String(url).trim();
  if (!clean) return '';
  if (/^(https?:\/\/|mailto:|tel:)/i.test(clean)) return clean;
  return 'https://' + clean;
}

export function getPrimaryContactLink(socials: SocialLinks): string {
  return (
    normalizeLink(
      socials.whatsapp || socials.instagram || socials.lynkid || socials.email
    ) || 'https://instagram.com/arhykbs'
  );
}

export function getActiveSocialItems(settings: SiteSettings): SocialDisplayItem[] {
  const soc = settings.socials || ({} as SocialLinks);
  const rawItems: Array<{
    key: keyof SocialLinks;
    label: string;
    desc: string;
    icon: string;
    badge: string;
    color: string;
  }> = [
    {
      key: 'instagram',
      label: 'Instagram',
      desc: settings.handle || 'Ikuti konten harian',
      icon: '◎',
      badge: 'IG',
      color: 'text-pink-400',
    },
    {
      key: 'facebook',
      label: 'Facebook',
      desc: 'Komunitas & update',
      icon: 'f',
      badge: 'FB',
      color: 'text-blue-400',
    },
    {
      key: 'youtube',
      label: 'YouTube',
      desc: 'Video edukasi & PJOK',
      icon: '▶',
      badge: 'YT',
      color: 'text-rose-400',
    },
    {
      key: 'tiktok',
      label: 'TikTok',
      desc: 'Konten singkat kreatif',
      icon: '♪',
      badge: 'TT',
      color: 'text-cyan-400',
    },
    {
      key: 'lynkid',
      label: 'Lynk.id / Produk',
      desc: 'Katalog karya digital',
      icon: '↗',
      badge: 'LINK',
      color: 'text-emerald-400',
    },
    {
      key: 'whatsapp',
      label: 'WhatsApp',
      desc: 'Diskusi & kolaborasi',
      icon: '✆',
      badge: 'WA',
      color: 'text-green-400',
    },
    {
      key: 'email',
      label: 'Email Resmi',
      desc: 'Undangan & kerja sama',
      icon: '✉',
      badge: 'MAIL',
      color: 'text-amber-400',
    },
  ];

  return rawItems
    .map((item) => {
      const href = normalizeLink(soc[item.key]);
      return {
        ...item,
        href,
        isMail: href.startsWith('mailto:'),
      };
    })
    .filter((item) => Boolean(item.href));
}

export function extractCategories(items: ContentItem[], publishedOnly = true): string[] {
  const source = publishedOnly ? items.filter((x) => x.published) : items;
  return ['Semua', ...new Set(source.map((x) => x.category || 'Umum'))];
}

export function filterArticlesList(
  items: ContentItem[],
  activeCategory: string,
  searchQuery: string,
  publishedOnly = true
): ContentItem[] {
  const q = (searchQuery || '').trim().toLowerCase();
  const source = publishedOnly ? items.filter((x) => x.published) : items;
  return source.filter((x) => {
    const cat = x.category || 'Umum';
    const matchCat = activeCategory === 'Semua' || cat === activeCategory;
    const matchQ =
      !q ||
      (x.title || '').toLowerCase().includes(q) ||
      (x.summary || '').toLowerCase().includes(q);
    return matchCat && matchQ;
  });
}

export function filterPortfolioList(
  items: ContentItem[],
  activeCategory: string,
  publishedOnly = true
): ContentItem[] {
  const source = publishedOnly ? items.filter((x) => x.published) : items;
  return source.filter(
    (x) => activeCategory === 'Semua' || (x.category || 'Umum') === activeCategory
  );
}

export function upsertContentItem(
  items: ContentItem[],
  payload: Omit<ContentItem, 'id'>,
  editId?: string
): ContentItem[] {
  if (editId) {
    const idx = items.findIndex((x) => x.id === editId);
    if (idx > -1) {
      const copy = [...items];
      copy[idx] = { id: editId, ...payload };
      return copy;
    }
  }
  return [{ id: 'demo-' + Date.now(), ...payload }, ...items];
}

export function removeContentItem(items: ContentItem[], id: string): ContentItem[] {
  return items.filter((x) => x.id !== id);
}

export function removeWhiteBgFromEdges(
  img: HTMLImageElement,
  threshold = 230
): string {
  const maxDim = 760;
  const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
  const w = Math.max(1, Math.round(img.width * scale));
  const h = Math.max(1, Math.round(img.height * scale));
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) return '';
  ctx.drawImage(img, 0, 0, w, h);

  const imgData = ctx.getImageData(0, 0, w, h);
  const data = imgData.data;
  const visited = new Uint8Array(w * h);
  const queue = new Int32Array(w * h);
  let head = 0;
  let tail = 0;

  const isBgPixel = (idx: number) => {
    const r = data[idx];
    const g = data[idx + 1];
    const b = data[idx + 2];
    const a = data[idx + 3];
    if (a < 20) return true;
    const minC = Math.min(r, g, b);
    const maxC = Math.max(r, g, b);
    return minC >= threshold && maxC - minC <= 32;
  };

  const enqueue = (x: number, y: number) => {
    const p = y * w + x;
    if (visited[p]) return;
    if (isBgPixel(p * 4)) {
      visited[p] = 1;
      queue[tail++] = p;
    }
  };

  for (let x = 0; x < w; x++) {
    enqueue(x, 0);
    enqueue(x, h - 1);
  }
  for (let y = 0; y < h; y++) {
    enqueue(0, y);
    enqueue(w - 1, y);
  }

  while (head < tail) {
    const p = queue[head++];
    data[p * 4 + 3] = 0;
    const x = p % w;
    const y = (p - x) / w;
    if (x > 0) enqueue(x - 1, y);
    if (x < w - 1) enqueue(x + 1, y);
    if (y > 0) enqueue(x, y - 1);
    if (y < h - 1) enqueue(x, y + 1);
  }

  ctx.putImageData(imgData, 0, 0);
  return canvas.toDataURL('image/png');
}

export function compressImageToDataUrl(
  img: HTMLImageElement,
  maxDim = 480,
  quality = 0.82
): string {
  const scale = Math.min(1, maxDim / Math.max(img.width, img.height));
  const w = Math.max(1, Math.round(img.width * scale));
  const h = Math.max(1, Math.round(img.height * scale));
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';
  ctx.drawImage(img, 0, 0, w, h);
  return canvas.toDataURL('image/jpeg', quality);
}
