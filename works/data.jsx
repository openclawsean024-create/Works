// WORKS — Shared site data
//
// ═══════════════════════════════════════════════════════
// 如何新增案例圖片：
//   1. 把圖片放到 images/cases/ 資料夾（建議 800×1000px, JPG/WebP）
//   2. 在下方 cases 陣列對應項目加上 img: 'images/cases/你的檔名.jpg'
//   3. 支援外部網址，例如 img: 'https://example.com/photo.jpg'
//   4. 不填 img（或 img: null）則顯示佔位格
//
// 如何新增案例：
//   複製任一行，貼到 cases 陣列最前面，填入資料即可。
//   cat 可用：BRAND / CAMPUS / CONCERT / EVENT / AUCTION
// ═══════════════════════════════════════════════════════

const WORKS_DATA = {
  brand: {
    zh: '沃克思國際',
    en: 'WORKS',
    full: '沃克思國際有限公司',
    fullEn: 'WORKS INTERNATIONAL CO., LTD.',
    tagline: '你的線下活動神隊友。',
    taglineEn: 'From precise manpower to on-site integration — one-stop landing.',
    estab: '2024',
    address: '臺北市中正區開封街一段 66 號 5 樓',
    addressEn: '5F, No. 66, Sec. 1, Kaifeng St., Zhongzheng Dist., Taipei',
    rep: '李汪銘',
    repTitle: 'Founder / Creative Director',
    taxid: '93741676',
    capital: '1,000,000',
  },
  nav: [
    { id: 'home',    zh: '首頁',     en: 'HOME' },
    { id: 'about',   zh: '關於我們', en: 'ABOUT' },
    { id: 'service', zh: '服務介紹', en: 'SERVICE' },
    { id: 'case',    zh: '歷年案例', en: 'CASE' },
    { id: 'news',    zh: '消息公告', en: 'NEWS' },
    { id: 'contact', zh: '聯絡我們', en: 'CONTACT' },
  ],
  // PDF 區塊 2：核心專長 — 4 大關鍵能力亮點
  highlights: [
    {
      num: '01',
      zh: '大型展會的臨危不亂',
      en: 'LARGE-SCALE EXHIBITIONS',
      desc: '萬人展會的 0 失誤法則。從動線精算、人流極大化到硬體雙備援，我們具備高壓環境下的危機預判與即時應變力。',
      tags: ['#台北國際電玩展', '#任天堂', '#蔚藍檔案'],
    },
    {
      num: '02',
      zh: '高端活動的細節把控',
      en: 'HIGH-END EVENT CRAFTSMANSHIP',
      desc: '細節控的專案美學。無論是企業年會或黑客松，我們以「15 分鐘」為單位的精準控場，確保視覺設計與現場執行的完美對齊。',
      tags: ['#和泰黑客松', '#Msonic見面會', '#統包統籌'],
    },
    {
      num: '03',
      zh: '品牌專屬執行戰隊',
      en: 'DEDICATED BRAND SQUAD',
      desc: '拒絕平庸臨時人力。出勤人員皆受過嚴格培訓，並配置專屬督導 (Team Leader) 盯場，守護您品牌第一線的專業形象。',
      tags: ['#全障運媒體接待', '#Google Gemini校園推廣'],
    },
    {
      num: '04',
      zh: '全感官影音與禮品整合',
      en: 'FULL-SENSORY CONTENT & GIFTING',
      desc: '將線下感動無限延伸。串聯頂尖影像團隊與客製禮贈品資源，從現場發送到社群短影音擴散，一站式創造最大綜效。',
      tags: ['#Reels短影音行銷', '#企業公關伴手禮'],
    },
  ],
  // 既有：4 大業務領域（保留 — 業務範圍）
  servicePillars: [
    {
      num: '01',
      zh: '活動企劃執行',
      en: 'Event Planning & Execution',
      sub: ['新品上市', '消費者活動', '表揚大會 / 演唱會', '企業家庭日', '年度尾牙'],
    },
    {
      num: '02',
      zh: '視覺 & 空間規劃執行',
      en: 'Visual & Spatial Design',
      sub: ['平面 / 3D 設計', '產品包裝設計', '企業識別 CI 設計'],
    },
    {
      num: '03',
      zh: '展會規劃執行',
      en: 'Exhibition Production',
      sub: ['展場企劃執行', '商品陳列設計'],
    },
    {
      num: '04',
      zh: '整合行銷企劃執行',
      en: 'Integrated Marketing',
      sub: ['整合行銷企劃執行', '記者會企劃執行'],
    },
  ],
  serviceSeven: [
    { num: '01', zh: '活動人力',  en: 'Active Manpower',       kw: ['前台接待', '舞台監督', '展場服務', '臨時人員'] },
    { num: '02', zh: '硬體設備',  en: 'Hardware Integration',  kw: ['LED 大屏', '投影系統', '訊號整合', '直播工程'] },
    { num: '03', zh: '活動設備',  en: 'Event Planning',        kw: ['桁架舞台', '帳篷', '桌椅', '發電機'] },
    { num: '04', zh: '表演團隊',  en: 'Performance Team',      kw: ['主持人', '樂團', '舞團', '特技魔術'] },
    { num: '05', zh: '婚禮企劃',  en: 'Wedding Planning',      kw: ['宴會規劃', '迎娶', '進場設計', '宴客流程'] },
    { num: '06', zh: '舞台工程',  en: 'Stage Works',           kw: ['結構設計', '施工', '安全認證', '客製場景'] },
    { num: '07', zh: '燈光音響',  en: 'Lighting & Sound',      kw: ['Moving light', 'Line array', '操作工程師', '租賃'] },
  ],
  // PDF 區塊 4：精選實績 — 4 個 PDF 指定案例 + 既有案例
  cases: [
    // PDF 區塊 4 精選實績（4 個）
    { num: 'P01', year: '2025', cat: 'CAMPUS', img: null,
      zh: 'Dcard × Google Gemini 校園推廣',
      en: 'Dcard × Google Gemini Campus Activation',
      tags: ['#活動規劃', '#專業人力', '#高效推廣'] },
    { num: 'P02', year: '2024', cat: 'EVENT',  img: null,
      zh: '2024 台北國際電玩展（任天堂 / 蔚藍檔案）',
      en: 'Taipei Game Show 2024 (Nintendo / Blue Archive)',
      tags: ['#萬人展會', '#大型統籌', '#硬體規劃'] },
    { num: 'P03', year: '2024', cat: 'BRAND',  img: null,
      zh: '和泰集團 和泰黑客松 MAAS',
      en: 'Hotai × Hotai Hackathon MAAS',
      tags: ['#高端企業活動', '#細節把控', '#統包統籌'] },
    { num: 'P04', year: '2025', cat: 'BRAND',  img: null,
      zh: 'Jusky 街星 × 創戰神 推廣活動',
      en: 'Jusky × Chou Zhan Shen Promo Activation',
      tags: ['#硬體設計', '#快閃統籌', '#陳列佈置'] },
    // 既有 12 個案例（保留）
    { num: '0101', year: '2026', cat: 'CAMPUS',   img: null, zh: '新竹陽明交通大學春季校園博覽會', en: 'NYCU Spring Career Fair' },
    { num: '0102', year: '2026', cat: 'BRAND',    img: null, zh: 'WBC × Foodpanda 推廣活動',       en: 'WBC × Foodpanda Activation' },
    { num: '0103', year: '2026', cat: 'EVENT',    img: null, zh: '嘉義燈節 — 中華電信主攤位',      en: 'Chiayi Lantern Festival × CHT' },
    { num: '0104', year: '2026', cat: 'BRAND',    img: null, zh: '台北花伴野餐',                    en: 'Taipei Picnic with Flowers' },
    { num: '0105', year: '2025', cat: 'CONCERT',  img: null, zh: 'Super Junior 20 周年快閃櫃',      en: 'Super Junior 20th Pop-up' },
    { num: '0106', year: '2025', cat: 'BRAND',    img: null, zh: 'DCARD × 洽洽瓜子年貨大展派樣',   en: 'DCARD × Chacheer Sampling' },
    { num: '0107', year: '2025', cat: 'CAMPUS',   img: null, zh: 'Dcard 開學季校園巡迴活動',       en: 'Dcard Campus Tour' },
    { num: '0108', year: '2025', cat: 'EVENT',    img: null, zh: '抽抽一番賞線下推廣活動',         en: 'Ichiban Kuji Promo Tour' },
    { num: '0109', year: '2024', cat: 'BRAND',    img: null, zh: '安麗體驗日（巡迴）',             en: 'Amway Experience Day Tour' },
    { num: '0110', year: '2024', cat: 'AUCTION',  img: null, zh: '藝術品拍賣會',                   en: 'Fine Art Auction' },
    { num: '0111', year: '2024', cat: 'EVENT',    img: null, zh: '全美親子運動會',                 en: 'All-American Family Sports Day' },
    { num: '0112', year: '2023', cat: 'CAMPUS',   img: null, zh: 'Dcard × VOLVO 校園活動',         en: 'Dcard × VOLVO Campus' },
  ],
  news: [
    { date: '2026.04.18', tag: 'PROJECT', zh: '春季校園博覽會 — 收場順利落幕', en: 'Spring Career Fair · Wrap' },
    { date: '2026.03.02', tag: 'NOTICE',  zh: '徵才公告：活動執行專員 × 2',     en: 'Hiring · Event Coordinator' },
    { date: '2026.02.10', tag: 'PROJECT', zh: '嘉義燈節進駐中華電信主攤位',     en: 'Chiayi Lantern Festival Goes Live' },
    { date: '2026.01.05', tag: 'COMPANY', zh: '沃克思國際 2026 新春開工',       en: 'New Year Kickoff' },
    { date: '2025.12.20', tag: 'PROJECT', zh: 'DCARD 年貨大展圓滿結束',         en: 'DCARD Sampling Wrapped' },
    { date: '2025.10.15', tag: 'COMPANY', zh: '沃克思加入台北市活動公會',       en: 'Joined Taipei Event Guild' },
  ],
  // PDF 區塊 4 標題：「精選實績（Portfolio）（上方放合作品牌 LOGO 輪播）」
  // LOGO 輪播名單 — 用 typography 呈現（無授權圖）
  clientLogos: [
    'DCARD', 'GOOGLE', 'GEMINI', 'VOLVO', 'AMWAY 安麗',
    'NINTENDO 任天堂', 'BLUE ARCHIVE 蔚藍檔案', 'CHT 中華電信', 'HOTAI 和泰', 'JUSKY',
    'FOODPANDA', 'SUPER JUNIOR', '陽明交大 NYCU', 'WBC', '一番賞',
  ],
  // 既有 clients（保留給 footer / marquee）
  clients: [
    'DCARD', 'FOODPANDA', 'CHT 中華電信', 'VOLVO', 'AMWAY 安麗',
    'SUPER JUNIOR', '陽明交通大學', 'WBC', '洽洽瓜子', '一番賞',
  ],
  // PDF 區塊 3：為什麼選擇沃克思 — 3 大核心優勢
  whyUs: [
    {
      num: '01',
      zh: '頂尖品牌信任',
      en: 'TRUSTED BY TOP BRANDS',
      desc: '從任天堂、Google 到和泰集團，累積百場國家級與跨國品牌實戰經驗。',
    },
    {
      num: '02',
      zh: '單一窗口整合',
      en: 'SINGLE POINT OF CONTACT',
      desc: '一個群組搞定人力、設計、影音與禮品，大幅降低溝通成本。',
    },
    {
      num: '03',
      zh: '零失誤執行力',
      en: 'ZERO-DEFECT EXECUTION',
      desc: '系統化 SOP 與硬體／人力雙重備援機制，將現場風險降至最低。',
    },
  ],
  // 既有：服務競爭力 4 條（保留 — 細節補充）
  competencies: [
    { num: '01', zh: '從概念到收場', en: 'CONCEPT → WRAP', desc: '不只是執行 — 從第一張提案簡報到收場那一刻，我們是同一支團隊。' },
    { num: '02', zh: '設計與執行同源', en: 'DESIGN-LED EXECUTION', desc: '平面 / 3D / 空間設計 in-house，視覺一致性從紙本延續到現場。' },
    { num: '03', zh: '校園與品牌雙軌', en: 'CAMPUS × BRAND', desc: '同時熟悉 Z 世代校園生態與 B2B 品牌語言，連結兩端不是難題。' },
    { num: '04', zh: '巡迴調度經驗', en: 'TOUR LOGISTICS',    desc: '安麗、Dcard、洽洽——多場巡迴累積出的場域應變力。' },
  ],
  stats: [
    { n: '60+',  l: '年執行場次', en: 'PROJECTS / YEAR' },
    { n: '12+',  l: '合作品牌',   en: 'PARTNER BRANDS' },
    { n: '24h',  l: '提案回覆',   en: 'RESPONSE' },
    { n: '100%', l: '客戶留存',   en: 'RETENTION' },
  ],
};

window.WORKS_DATA = WORKS_DATA;
