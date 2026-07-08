// WORKS — Default image library
// Maps every case num and asset key to a stable Picsum URL.
// Picsum (https://picsum.photos) is a free service that returns
// real photos by seed — the seed is deterministic so the same seed
// always returns the same photo.
//
// Format: https://picsum.photos/seed/{seed}/{w}/{h}
//
// These are PLACEHOLDER images. The owner can swap each one with
// a real photo via the admin backend at any time.

const PICSEED = (key, w = 800, h = 1000) => `https://picsum.photos/seed/${encodeURIComponent(key)}/${w}/${h}`

// Case image map: num → picsum URL
// Each case gets a unique seed so the photos are visually distinct.
const CASE_DEFAULT_IMAGES = {
  // PDF 精選實績 (P01–P04) — featured in hero
  P01:  PICSEED('works-p01-gemini-campus'),
  P02:  PICSEED('works-p02-gaming-convention'),
  P03:  PICSEED('works-p03-hackathon'),
  P04:  PICSEED('works-p04-street-marketing'),

  // 12 default cases (0101–0112)
  '0101': PICSEED('works-0101-campus-fair'),
  '0102': PICSEED('works-0102-baseball-promo'),
  '0103': PICSEED('works-0103-lantern-festival'),
  '0104': PICSEED('works-0104-picnic'),
  '0105': PICSEED('works-0105-kpop-popup'),
  '0106': PICSEED('works-0106-sample-booth'),
  '0107': PICSEED('works-0107-campus-event'),
  '0108': PICSEED('works-0108-lottery'),
  '0109': PICSEED('works-0109-brand-experience'),
  '0110': PICSEED('works-0110-art-auction'),
  '0111': PICSEED('works-0111-family-sports'),
  '0112': PICSEED('works-0112-campus-brand'),
}

// Image assets (non-case)
const ASSET_DEFAULT_IMAGES = {
  // 720x900 portrait for About team
  about_team:  PICSEED('works-about-team', 720, 900),
  // 800x600 brand image
  about_brand: PICSEED('works-about-brand', 800, 600),
}

window.WORKS_DEFAULT_IMAGES = {
  cases: CASE_DEFAULT_IMAGES,
  assets: ASSET_DEFAULT_IMAGES,
  // Helper to build a picsum URL for any seed
  picsum: PICSEED,
}
