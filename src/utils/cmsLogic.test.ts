import test from 'node:test';
import assert from 'node:assert/strict';
import {
  DEFAULT_ARTICLES,
  DEFAULT_PORTFOLIO,
  DEFAULT_SITE_SETTINGS,
  extractCategories,
  filterArticlesList,
  filterPortfolioList,
  getActiveSocialItems,
  getPrimaryContactLink,
  normalizeLink,
  removeContentItem,
  upsertContentItem,
} from './cmsLogic';

test('normalizeLink normalizes raw domains, mailto, and empty links', () => {
  assert.equal(normalizeLink(''), '');
  assert.equal(normalizeLink('instagram.com/arhykbs'), 'https://instagram.com/arhykbs');
  assert.equal(normalizeLink('https://lynk.id/arisensei'), 'https://lynk.id/arisensei');
  assert.equal(normalizeLink('mailto:arisensei.edu@gmail.com'), 'mailto:arisensei.edu@gmail.com');
});

test('getActiveSocialItems returns non-empty social channels and flags email properly', () => {
  const items = getActiveSocialItems(DEFAULT_SITE_SETTINGS);
  assert.equal(items.length, 7);
  const mailItem = items.find((i) => i.key === 'email');
  assert.ok(mailItem);
  assert.equal(mailItem.isMail, true);
});

test('getPrimaryContactLink picks whatsapp first when available', () => {
  assert.equal(
    getPrimaryContactLink(DEFAULT_SITE_SETTINGS.socials),
    'https://wa.me/6281234567890'
  );
});

test('extractCategories and filterArticlesList filter by category and query', () => {
  const cats = extractCategories(DEFAULT_ARTICLES);
  assert.deepEqual(cats, ['Semua', 'Pendidikan PJOK', 'Teknologi Guru', 'Desain Grafis']);

  const byCat = filterArticlesList(DEFAULT_ARTICLES, 'Pendidikan PJOK', '');
  assert.equal(byCat.length, 1);
  assert.equal(byCat[0].id, 'demo-a1');

  const bySearch = filterArticlesList(DEFAULT_ARTICLES, 'Semua', 'Kurikulum Merdeka');
  assert.equal(bySearch.length, 1);
  assert.equal(bySearch[0].id, 'demo-a2');
});

test('filterPortfolioList filters portfolio items accurately', () => {
  const all = filterPortfolioList(DEFAULT_PORTFOLIO, 'Semua');
  assert.equal(all.length, 3);

  const webOnly = filterPortfolioList(DEFAULT_PORTFOLIO, 'Web & EduTech');
  assert.equal(webOnly.length, 1);
  assert.equal(webOnly[0].id, 'demo-p2');
});

test('upsertContentItem and removeContentItem create, update, and delete items', () => {
  const created = upsertContentItem(DEFAULT_ARTICLES, {
    title: 'Artikel Baru PJOK',
    category: 'Pendidikan PJOK',
    summary: 'Ringkasan singkat',
    imageUrl: '',
    body: 'Isi lengkap artikel',
    published: true,
  });
  assert.equal(created.length, 4);
  assert.equal(created[0].title, 'Artikel Baru PJOK');

  const updated = upsertContentItem(
    created,
    {
      title: 'Artikel Baru PJOK (Revisi)',
      category: 'Pendidikan PJOK',
      summary: 'Ringkasan singkat',
      imageUrl: '',
      body: 'Isi lengkap artikel',
      published: false,
    },
    created[0].id
  );
  assert.equal(updated.length, 4);
  assert.equal(updated[0].title, 'Artikel Baru PJOK (Revisi)');
  assert.equal(updated[0].published, false);

  const afterRemove = removeContentItem(updated, created[0].id);
  assert.equal(afterRemove.length, 3);
});
