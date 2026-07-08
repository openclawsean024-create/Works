// WORKS — Service Worker (Network-first, offline fallback)
const CACHE = 'works-v1'
const ASSETS = [
  '/Works/',
  '/Works/works.html',
  '/Works/admin.html',
  '/Works/manifest.json',
  '/Works/robots.txt',
  '/Works/sitemap.xml',
  '/Works/works/site.css',
  '/Works/works/data.jsx',
  '/Works/works/header.jsx',
  '/Works/works/hero.jsx',
  '/Works/works/about.jsx',
  '/Works/works/highlights.jsx',
  '/Works/works/service.jsx',
  '/Works/works/cases.jsx',
  '/Works/works/news-contact.jsx',
  '/Works/works/default-images.jsx',
  '/Works/images/icon-192.svg',
  '/Works/images/icon-512.svg',
]

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS).catch(() => null)))
  self.skipWaiting()
})

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(
    keys.filter(k => k !== CACHE).map(k => caches.delete(k))
  )))
  self.clients.claim()
})

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url)
  // Skip non-GET, cross-origin (Wikimedia images use direct, not via SW)
  if (e.request.method !== 'GET') return
  if (url.origin !== self.location.origin) return

  e.respondWith(
    fetch(e.request).then(res => {
      // Cache successful responses
      if (res && res.status === 200 && res.type === 'basic') {
        const clone = res.clone()
        caches.open(CACHE).then(c => c.put(e.request, clone)).catch(() => null)
      }
      return res
    }).catch(() => caches.match(e.request).then(r => r || caches.match('/Works/works.html')))
  )
})