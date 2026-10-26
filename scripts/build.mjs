// Builds the static documentation site into dist/ (deployed to GitHub Pages).
// Usage: node scripts/build.mjs
import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs'
import { basename, dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { marked } from 'marked'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const SITE = join(ROOT, 'site')
const DIST = join(ROOT, 'dist')
const SPEC = join(ROOT, 'Baqio-Public-API.v1.json')
const CUSTOM_DOMAIN = 'api-doc.baqio.com'

const read = (path) => readFileSync(path, 'utf8')
const partial = (name) => read(join(SITE, 'partials', `${name}.html`))

const slugify = (text) =>
  text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

// Operation counts per tag, displayed on the landing page
const spec = JSON.parse(read(SPEC))
const tagCounts = {}
let operations = 0
for (const pathItem of Object.values(spec.paths)) {
  for (const operation of Object.values(pathItem)) {
    if (!operation || !Array.isArray(operation.tags)) continue
    operations += 1
    for (const tag of operation.tags) tagCounts[tag] = (tagCounts[tag] || 0) + 1
  }
}

// Guides rendered from docs/*.md
const guides = readdirSync(join(ROOT, 'docs'))
  .filter((file) => file.endsWith('.md'))
  .map((file) => {
    const markdown = read(join(ROOT, 'docs', file))
    const title = markdown.match(/^#\s+(.+)$/m)?.[1].trim() || basename(file, '.md')
    return { slug: slugify(basename(file, '.md')), title, markdown }
  })

function render(html, { root, current }) {
  const plural = (n) => `${n} endpoint${n > 1 ? 's' : ''}`
  return html
    .replaceAll('{{header}}', partial('header'))
    .replaceAll('{{footer}}', partial('footer'))
    .replace(/\{\{count:([^}]+)\}\}/g, (_, tag) => plural(tagCounts[tag] || 0))
    .replaceAll('{{operations}}', String(operations))
    .replaceAll(`data-nav="${current}"`, `data-nav="${current}" aria-current="page"`)
    .replaceAll('{{root}}', root)
}

function write(relativePath, content) {
  const target = join(DIST, relativePath)
  mkdirSync(dirname(target), { recursive: true })
  writeFileSync(target, content)
}

rmSync(DIST, { recursive: true, force: true })
mkdirSync(DIST, { recursive: true })

cpSync(join(SITE, 'assets'), join(DIST, 'assets'), { recursive: true })
for (const file of ['favicon.ico', 'apple-touch-icon.png']) cpSync(join(SITE, file), join(DIST, file))
cpSync(SPEC, join(DIST, 'openapi.json'))

write('index.html', render(read(join(SITE, 'index.html')), { root: './', current: 'home' }))
write('404.html', render(read(join(SITE, '404.html')), { root: '/', current: '' }))
write('reference/index.html', render(read(join(SITE, 'reference', 'index.html')), { root: '../', current: 'reference' }))

for (const guide of guides) {
  const nav = guides
    .map((g) => `<a href="../${g.slug}/"${g.slug === guide.slug ? ' aria-current="page"' : ''}>${g.title}</a>`)
    .join('\n        ')
  const html = partial('guide')
    .replaceAll('{{guides_nav}}', nav)
    .replaceAll('{{content}}', marked.parse(guide.markdown))
    .replaceAll('{{title}}', guide.title)
    .replaceAll('{{slug}}', guide.slug)
  write(`guides/${guide.slug}/index.html`, render(html, { root: '../../', current: guide.slug }))
}

write('CNAME', `${CUSTOM_DOMAIN}\n`)
write('.nojekyll', '')

if (!existsSync(join(DIST, 'index.html'))) throw new Error('Build failed: dist/index.html missing')
console.log(`Built ${operations} operations, ${guides.length} guide(s) into dist/`)
