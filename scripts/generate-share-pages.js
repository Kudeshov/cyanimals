const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const SITE_URL = 'https://cyanimals.com/';
const FALLBACK_IMAGE = 'assets/og-preview.jpg';
const PREFERRED_LANG = 'ru';

const COLLECTIONS = [
  {
    name: 'news',
    source: 'news.json',
    directory: 'news',
    redirectPage: 'news.html',
    openLabel: 'Open news item',
    type: 'article',
    descriptionField: 'summary',
  },
  {
    name: 'incidents',
    source: 'incidents.json',
    directory: 'incidents',
    redirectPage: 'index.html',
    openLabel: 'Open incident',
    type: 'article',
    descriptionField: 'description',
  },
];

function readJson(relativePath) {
  const filePath = path.join(ROOT_DIR, relativePath);
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function localized(value) {
  if (!value) return '';
  if (typeof value === 'string') return value;
  return value[PREFERRED_LANG] || value.en || value.el || Object.values(value).find(Boolean) || '';
}

function normalizeText(value) {
  return String(value || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function truncate(value, maxLength = 240) {
  const text = normalizeText(value);
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength - 1).trimEnd()}...`;
}

function escapeHtml(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function rootRelativeUrl(relativePath) {
  return String(relativePath || '')
    .replace(/\\/g, '/')
    .replace(/^\/+/, '');
}

function absoluteUrl(relativePath) {
  return new URL(rootRelativeUrl(relativePath), SITE_URL).href;
}

function collectionItemUrl(collection, item) {
  return new URL(`${collection.directory}/${encodeURIComponent(item.id)}/`, SITE_URL).href;
}

function firstShareImage(item) {
  const images = Array.isArray(item.images) ? item.images : [];
  return images.find((image) => /\.(jpe?g|png|webp|gif)$/i.test(image)) || FALLBACK_IMAGE;
}

function redirectHref(collection, item) {
  return `../../${collection.redirectPage}#${encodeURIComponent(item.id)}`;
}

function itemTitle(item) {
  return truncate(localized(item.title), 120);
}

function itemDescription(collection, item) {
  const fieldValue = localized(item[collection.descriptionField]);
  return truncate(fieldValue || localized(item.body) || localized(item.title));
}

function buildPage(collection, item) {
  const title = itemTitle(item);
  const description = itemDescription(collection, item);
  const imageUrl = absoluteUrl(firstShareImage(item));
  const pageUrl = collectionItemUrl(collection, item);
  const redirect = redirectHref(collection, item);
  const publishedTime = item.publishedAt || item.date || '';

  const articleMeta = publishedTime
    ? `  <meta property="article:published_time" content="${escapeHtml(publishedTime)}" />\n`
    : '';

  return `<!DOCTYPE html>
<html lang="${PREFERRED_LANG}">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description)}" />
  <meta property="og:title" content="${escapeHtml(title)}" />
  <meta property="og:description" content="${escapeHtml(description)}" />
  <meta property="og:image" content="${escapeHtml(imageUrl)}" />
  <meta property="og:url" content="${escapeHtml(pageUrl)}" />
  <meta property="og:type" content="${escapeHtml(collection.type)}" />
  <meta property="og:site_name" content="Animals of Cyprus" />
${articleMeta}  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${escapeHtml(title)}" />
  <meta name="twitter:description" content="${escapeHtml(description)}" />
  <meta name="twitter:image" content="${escapeHtml(imageUrl)}" />
  <link rel="canonical" href="${escapeHtml(pageUrl)}" />
</head>
<body>
  <script>
    window.location.replace(${JSON.stringify(redirect)});
  </script>
  <main>
    <p><a href="${escapeHtml(redirect)}">${escapeHtml(collection.openLabel)}</a></p>
  </main>
</body>
</html>
`;
}

function writeSharePage(collection, item) {
  if (!item || !item.id) {
    throw new Error(`${collection.source}: found item without id`);
  }

  const targetDir = path.join(ROOT_DIR, collection.directory, item.id);
  const targetFile = path.join(targetDir, 'index.html');
  fs.mkdirSync(targetDir, { recursive: true });
  fs.writeFileSync(targetFile, buildPage(collection, item), 'utf8');
  return path.relative(ROOT_DIR, targetFile).replace(/\\/g, '/');
}

function generateCollection(collection) {
  const items = readJson(collection.source);
  if (!Array.isArray(items)) {
    throw new Error(`${collection.source} must contain an array`);
  }

  return items.map((item) => writeSharePage(collection, item));
}

function main() {
  const generated = COLLECTIONS.flatMap(generateCollection);
  console.log(`Generated ${generated.length} share pages:`);
  generated.forEach((filePath) => console.log(`- ${filePath}`));
}

main();
