// WORKS — Default image library
// Maps every case num and asset key to a hand-picked Wikimedia Commons CC photo.
// All images are real event photos (concerts, exhibitions, hackathons, lanterns, etc.)
// matching the section/case theme. Falls back to local picsum if an image fails to load.
//
// Format: Wikimedia Commons upload URL (CC BY/CC BY-SA/CC0/Public Domain)
// Why Wikimedia: zero-token, free commercial use, real photos, no rate-limit on <img>.

const CASE_IMAGES = {
  // ── HERO 4 featured (background image) ──
  hero1: 'https://upload.wikimedia.org/wikipedia/commons/d/d8/DFC_3794_Thousands_gather_on_a_beachfront_at_night_for_a_large_outdoor_concert_or_festival_with_a_brightly_lit_stage_tents_and_city_high-rises_glowing_in_the_background.jpg',
  hero2: 'https://upload.wikimedia.org/wikipedia/commons/2/28/Musicians_perform_during_an_outdoor_concert_at_night_with_vibrant_lighting_and_a_lively_atmosphere_in_a_natural_setting.jpg',
  hero3: 'https://upload.wikimedia.org/wikipedia/commons/d/d3/Musicians_perform_live_at_a_vibrant_concert_under_bright_lights_in_an_outdoor_venue.jpg',
  hero4: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Speaker_addresses_crowd_at_outdoor_event_with_a_microphone_in_hand.jpg',

  // ── About ──
  // 團隊合照 (Abstract Wikipedia team group photo)
  about_team:  'https://upload.wikimedia.org/wikipedia/commons/1/1a/Abstract_Wikipedia_Team_-_Group_photo%2C_2022-05-12.jpg',
  // 品牌視覺 (Amsterdam city branding visual identity)
  about_brand: 'https://upload.wikimedia.org/wikipedia/commons/b/b6/2013-04-30_visual_identity_design_of_city_branding_of_Amsterdam_during_the_Coronation.jpg',

  // ── Highlights 4 (核心專長) ──
  // 01 大型展會規劃
  H1_plan:   'https://upload.wikimedia.org/wikipedia/commons/8/83/Multinational_forces_brief_senior_leadership_during_African_Lion_26_operational_planning_team_event_%289664591%29.jpg',
  // 02 場地布置 (live bar 燈光裝飾)
  H2_setup:  'https://upload.wikimedia.org/wikipedia/commons/9/9c/DZ6_2336_Live_band_lights_up_the_neon-lit_bar_as_dancers_and_patrons_enjoy_the_music_and_colorful_decorations.jpg',
  // 03 媒體宣傳 (記者會)
  H3_media:  'https://upload.wikimedia.org/wikipedia/commons/7/76/2025_Press_conference.jpg',
  // 04 跨界合作 (品牌合作簽約)
  H4_collab: 'https://upload.wikimedia.org/wikipedia/commons/c/c8/Land_Rover_and_Bowler_-_Brand_Partnership_Agreement_%287413937452%29.jpg',

  // ── 16 精選案例 (PDF 區塊 4 + 既有) ──
  // P01 Dcard × Google Gemini 校園推廣 (Wikipedia 101 校園講座)
  P01:  'https://upload.wikimedia.org/wikipedia/commons/2/29/Wikipedia_101_Event_-_Istanbul_Medipol_University_Wikipedia_Student_Club%2C_Medipol_Conference_Hall%2C_Zafer_Bat%C4%B1k.jpg',
  // P02 台北國際電玩展 2024 (真實台北電玩展攤位)
  P02:  'https://upload.wikimedia.org/wikipedia/commons/f/f4/2017_Taipei_Game_Show_booth%2C_Taipei_IT_Month_20161211.jpg',
  // P03 和泰黑客松 (Georgia Tech Hackathon 程式馬拉松)
  P03:  'https://upload.wikimedia.org/wikipedia/commons/2/24/Georgia_Tech%27s_%27Hack-a-thon%27_%2829966233485%29.jpg',
  // P04 Jusky × 創戰神 街頭推廣 (Fukushima Prefecture 推廣活動)
  P04:  'https://upload.wikimedia.org/wikipedia/commons/e/e8/Fukushima_Prefecture_promotion_event_in_Ebisu_Garden_Place.jpg',
  // 0101 陽明交大春季校園博覽會 (學生中心)
  '0101': 'https://upload.wikimedia.org/wikipedia/commons/f/f0/Schine_Student_Center_%28Syracuse_University%29_01.jpg',
  // 0102 WBC × Foodpanda 推廣 (Foodpanda 外送品牌 → Liverpool 外送騎士)
  '0102': 'https://upload.wikimedia.org/wikipedia/commons/2/2e/Delivery_cyclist%2C_Liverpool_-_geograph.org.uk_-_5599517.jpg',
  // 0103 嘉義燈節 × 中華電信 (台灣燈節 2015)
  '0103': 'https://upload.wikimedia.org/wikipedia/commons/1/18/2015_Taiwan_Lantern_Festival_02.jpg',
  // 0104 台北花伴野餐 (戶外草地聚會)
  '0104': 'https://upload.wikimedia.org/wikipedia/commons/8/84/Blake_Hall_Essex_listed_barn_and_lawn_01.jpg',
  // 0105 Super Junior 20 周年 (Korea Kpop Festival)
  '0105': 'https://upload.wikimedia.org/wikipedia/commons/6/66/Korea_KPOP_World_Festival_22.jpg',
  // 0106 DCARD × 洽洽瓜子 派樣 (Sampling booth)
  '0106': 'https://upload.wikimedia.org/wikipedia/commons/e/ed/WBOS_Booth_and_vehicle_2016.jpg',
  // 0107 Dcard 開學季校園巡迴 (Syracuse 學生中心)
  '0107': 'https://upload.wikimedia.org/wikipedia/commons/5/56/Schine_Student_Center_corner_%28Syracuse_University%29.jpg',
  // 0108 抽抽一番賞線下推廣 (Anime Comic Game Fiesta)
  '0108': 'https://upload.wikimedia.org/wikipedia/commons/d/d4/Anime_Comic_Game_Fiesta_2017.jpg',
  // 0109 安麗體驗日巡迴 (Juggler 街頭表演 = 品牌體驗活動)
  '0109': 'https://upload.wikimedia.org/wikipedia/commons/1/14/Juggler_Queen_Street_Mall_Brisbane_P1300781.jpg',
  // 0110 藝術品拍賣會 (Art gallery exhibition)
  '0110': 'https://upload.wikimedia.org/wikipedia/commons/7/7e/Exhibition_at_the_gallery_La_Pergola_art_Fienze.JPG',
  // 0111 全美親子運動會 (Steens Rim Run 路跑賽)
  '0111': 'https://upload.wikimedia.org/wikipedia/commons/6/62/Steens_Rim_Run_%2819937600359%29.jpg',
  // 0112 Dcard × VOLVO 校園活動 (BMW 車展/汽車品牌)
  '0112': 'https://upload.wikimedia.org/wikipedia/commons/6/67/D%C3%BClmen%2C_Kirchspiel%2C_Karthaus%2C_BMW_i3_--_2016_--_1759.jpg',
}

// Local picsum fallback (same seed returns same image). Used only if a Wikimedia URL fails.
const PICSEED = (key, w = 800, h = 1000) => `https://picsum.photos/seed/${encodeURIComponent(key)}/${w}/${h}`

window.WORKS_DEFAULT_IMAGES = {
  cases: CASE_IMAGES,
  // Hero featured picks (first 4 = hero1..4)
  hero: [CASE_IMAGES.hero1, CASE_IMAGES.hero2, CASE_IMAGES.hero3, CASE_IMAGES.hero4],
  assets: {
    about_team: CASE_IMAGES.about_team,
    about_brand: CASE_IMAGES.about_brand,
  },
  highlights: {
    H01: CASE_IMAGES.H1_plan,
    H02: CASE_IMAGES.H2_setup,
    H03: CASE_IMAGES.H3_media,
    H04: CASE_IMAGES.H4_collab,
  },
  picsum: PICSEED,
  get(key, fallbackKey) {
    return CASE_IMAGES[key] || PICSEED(fallbackKey || key)
  },
}
