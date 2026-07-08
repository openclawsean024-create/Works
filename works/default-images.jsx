// WORKS — Default image library
// Maps every case num and asset key to a stable Picsum URL.
// Picsum (https://picsum.photos) is a free service that returns
// real photos by seed — the seed is deterministic so the same seed
// always returns the same photo.
//
// Format: https://picsum.photos/seed/{seed}/{w}/{h}
//
// IMPORTANT: picsum is RANDOM photos (Flickr pool) — we can't
// keyword-filter for "event photos only". These are placeholders.
// The admin can:
//   1. Re-roll all default seeds via the "重新隨機" button in admin
//   2. Upload real photos per case / asset

const PICSEED = (key, w = 800, h = 1000) => `https://picsum.photos/seed/${encodeURIComponent(key)}/${w}/${h}`

// Each entry: { num, seed }
// The seed is "語意化" (e.g. "outdoor-festival-1018") so the
// intent is clear, and we add a numeric suffix so re-rolling
// produces a visibly different image.
const CASE_SEEDS = {
  P01:  'outdoor-campus-event-1042',
  P02:  'expo-convention-stage-1058',
  P03:  'hackathon-corporate-1091',
  P04:  'street-marketing-booth-1067',
  '0101': 'campus-festival-outdoor-1023',
  '0102': 'baseball-crowd-event-1071',
  '0103': 'lantern-festival-night-1085',
  '0104': 'outdoor-picnic-garden-1019',
  '0105': 'kpop-concert-stage-1044',
  '0106': 'sample-booth-marketing-1063',
  '0107': 'campus-event-outdoor-1088',
  '0108': 'lottery-event-crowd-1027',
  '0109': 'brand-experience-stage-1053',
  '0110': 'art-auction-gallery-1076',
  '0111': 'family-sports-event-1031',
  '0112': 'campus-brand-activation-1099',
}

const ASSET_SEEDS = {
  about_team:  'workshop-team-collaboration-1086',
  about_brand: 'brand-identity-stage-1047',
}

function buildCaseMap() {
  const out = {}
  for (const [num, seed] of Object.entries(CASE_SEEDS)) {
    out[num] = PICSEED(seed)
  }
  return out
}

function buildAssetMap() {
  const out = {}
  for (const [key, seed] of Object.entries(ASSET_SEEDS)) {
    out[key] = PICSEED(seed, key === 'about_team' ? 720 : 800, key === 'about_team' ? 900 : 600)
  }
  return out
}

// Re-roll seeds by appending a random suffix.
// Called by admin "重新隨機預設圖" button.
function rerollSeeds() {
  const ts = Date.now().toString().slice(-4)
  for (const num of Object.keys(CASE_SEEDS)) {
    CASE_SEEDS[num] = CASE_SEEDS[num].replace(/-\d{4}$/, '') + '-' + ts
  }
  for (const key of Object.keys(ASSET_SEEDS)) {
    ASSET_SEEDS[key] = ASSET_SEEDS[key].replace(/-\d{4}$/, '') + '-' + ts
  }
}

window.WORKS_DEFAULT_IMAGES = {
  get cases() { return buildCaseMap() },
  get assets() { return buildAssetMap() },
  // Force rebuild (after reroll)
  refresh() {
    return { cases: buildCaseMap(), assets: buildAssetMap() }
  },
  picsum: PICSEED,
  rerollSeeds,
  // Expose seeds so admin can re-roll
  _seeds: { cases: CASE_SEEDS, assets: ASSET_SEEDS },
}
