import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join, relative, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = dirname(dirname(fileURLToPath(import.meta.url)));
const checkOnly = process.argv.includes('--check');

const rootPages = [
  'index.html',
  'cas-usage.html',
  'micro-audit.html',
  'journal.html',
  'mentions-legales.html',
  'confidentialite.html',
];

const nestedPages = ['journal', 'cas-usage'].flatMap((dir) =>
  readdirSync(join(rootDir, dir))
    .filter((name) => name.endsWith('.html'))
    .map((name) => `${dir}/${name}`),
);

const pages = [...rootPages, ...nestedPages];
const navTemplate = readFileSync(join(rootDir, 'partials/site-nav.html'), 'utf8').trim();
const footerTemplate = readFileSync(join(rootDir, 'partials/site-footer.html'), 'utf8').trim();

function pageContext(page) {
  const isNested = page.includes('/');
  const isHome = page === 'index.html';
  const root = isNested ? '../' : '';
  return {
    root,
    homeAnchor: isHome ? '' : `${root}index.html`,
    cssHref: `${root}assets/site-components.css`,
  };
}

function render(template, context) {
  return template
    .replaceAll('{{root}}', context.root)
    .replaceAll('{{homeAnchor}}', context.homeAnchor);
}

function replaceSharedBlock(html, marker, fallbackRegex, replacement) {
  const marked = new RegExp(`<!-- SHARED_${marker}_START -->[\\s\\S]*?<!-- SHARED_${marker}_END -->`);
  if (marked.test(html)) return html.replace(marked, replacement);
  if (!fallbackRegex.test(html)) {
    throw new Error(`Unable to find ${marker.toLowerCase()} block`);
  }
  return html.replace(fallbackRegex, replacement);
}

function ensureComponentsCss(html, cssHref) {
  if (html.includes(cssHref)) return html;
  return html.replace('</head>', `<link rel="stylesheet" href="${cssHref}" />\n</head>`);
}

const changed = [];

for (const page of pages) {
  const path = join(rootDir, page);
  const context = pageContext(page);
  const before = readFileSync(path, 'utf8');

  let after = ensureComponentsCss(before, context.cssHref);
  try {
    after = replaceSharedBlock(after, 'NAV', /(?:<!-- NAV -->\s*)?<nav class="nav">[\s\S]*?<\/nav>/, render(navTemplate, context));
    after = replaceSharedBlock(after, 'FOOTER', /<footer class="site-footer">[\s\S]*?<\/footer>/, render(footerTemplate, context));
  } catch (error) {
    throw new Error(`${page}: ${error.message}`);
  }

  if (after !== before) {
    changed.push(page);
    if (!checkOnly) writeFileSync(path, after, 'utf8');
  }
}

if (changed.length > 0) {
  console.log(`${checkOnly ? 'Out of sync' : 'Synced'} shared components in ${changed.length} page(s):`);
  for (const page of changed) console.log(`- ${relative(rootDir, join(rootDir, page))}`);
  if (checkOnly) process.exit(1);
} else {
  console.log('Shared components are in sync.');
}
