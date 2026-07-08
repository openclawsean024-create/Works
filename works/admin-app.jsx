// WORKS — Admin backend
// Login (default admin / admin) + Case CRUD with localStorage persistence.

const { useState, useEffect, useRef } = React

// ── Storage keys ──────────────────────────────────────────────
const STORAGE_KEYS = {
  AUTH: 'works-admin-session',
  CRED: 'works-admin-creds',
  CASES: 'works-custom-cases',
  DELETED: 'works-deleted-defaults',
  ASSETS: 'works-image-assets',
}

// ── Default credentials ───────────────────────────────────────
// Username + SHA-256 of password (never store plaintext)
async function sha256(text) {
  const buf = new TextEncoder().encode(text)
  const hash = await crypto.subtle.digest('SHA-256', buf)
  return Array.from(new Uint8Array(hash)).map((b) => b.toString(16).padStart(2, '0')).join('')
}

const DEFAULT_USER = 'admin'
const DEFAULT_PASS = 'admin'

async function getStoredCreds() {
  let creds
  try { creds = JSON.parse(localStorage.getItem(STORAGE_KEYS.CRED) || 'null') } catch {}
  if (!creds) {
    creds = { user: DEFAULT_USER, passHash: await sha256(DEFAULT_PASS) }
    localStorage.setItem(STORAGE_KEYS.CRED, JSON.stringify(creds))
  }
  return creds
}

// ── Case helpers ──────────────────────────────────────────────
// Customs are stored as a map { case_num: case_data } so that
// editing a default case overrides it (by num) instead of duplicating.
function loadCustomCases() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEYS.CASES) || '{}') } catch { return {} }
}
function saveCustomCases(map) { localStorage.setItem(STORAGE_KEYS.CASES, JSON.stringify(map)) }
function loadDeletedDefaults() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEYS.DELETED) || '[]') } catch { return [] }
}
function saveDeletedDefaults(nums) { localStorage.setItem(STORAGE_KEYS.DELETED, JSON.stringify(nums)) }

// ── Image assets (by key) ────────────────────────────────────
// Stored as { asset_key: { name, img, updatedAt } }
function loadImageAssets() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEYS.ASSETS) || '{}') } catch { return {} }
}
function saveImageAssets(map) { localStorage.setItem(STORAGE_KEYS.ASSETS, JSON.stringify(map)) }

// Effective cases = data.jsx defaults (minus deleted) + custom overrides by num
function getEffectiveCases() {
  const D = window.WORKS_DATA
  const deleted = new Set(loadDeletedDefaults())
  const customsMap = loadCustomCases()
  const defaults = (D.cases || []).filter((c) => !deleted.has(c.num))
  // Apply per-num override from customs map
  const mergedDefaults = defaults.map((c) => customsMap[c.num] ? { ...c, ...customsMap[c.num], _custom: true } : c)
  // Pure custom cases (num not in defaults)
  const customOnly = Object.entries(customsMap)
    .filter(([num]) => !defaults.some((d) => d.num === num))
    .map(([num, data]) => ({ ...data, num, _custom: true }))
  return [...customOnly, ...mergedDefaults]
}

function nextCaseNum() {
  const cases = getEffectiveCases()
  const nums = cases
    .map((c) => parseInt(String(c.num).replace(/\D/g, ''), 10))
    .filter((n) => !isNaN(n))
  const max = nums.length ? Math.max(...nums) : 0
  return 'C' + String(max + 1).padStart(2, '0')
}

// ── Toast helper ──────────────────────────────────────────────
function useToast() {
  const [toast, setToast] = useState(null)
  const show = (msg, type = 'ok') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 2400)
  }
  return { toast, show }
}

// ── Login view ────────────────────────────────────────────────
function LoginView({ onLogin }) {
  const [user, setUser] = useState('')
  const [pass, setPass] = useState('')
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErr('')
    setBusy(true)
    const creds = await getStoredCreds()
    const passHash = await sha256(pass)
    if (user === creds.user && passHash === creds.passHash) {
      localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify({ user, ts: Date.now() }))
      onLogin(user)
    } else {
      setErr('帳號或密碼錯誤')
    }
    setBusy(false)
  }

  return (
    <div className="w-login-card">
      <div className="w-eyebrow">WORKS · BACKEND</div>
      <h2>後台登入</h2>
      <p style={{ color: 'var(--w-text-mute)', fontSize: 13, marginTop: 6 }}>管理作品集 — 預設帳密 <code style={{ color: 'var(--w-accent)' }}>admin / admin</code></p>
      <form onSubmit={handleSubmit}>
        <label htmlFor="user">帳號</label>
        <input id="user" type="text" autoComplete="username" value={user} onChange={(e) => setUser(e.target.value)} required autoFocus />
        <label htmlFor="pass">密碼</label>
        <input id="pass" type="password" autoComplete="current-password" value={pass} onChange={(e) => setPass(e.target.value)} required />
        <button type="submit" disabled={busy}>{busy ? '登入中...' : '登入'}</button>
        {err && <div className="w-login-error">{err}</div>}
      </form>
      <div className="w-login-hint">
        <a href="works.html" style={{ color: 'var(--w-text-mute)' }}>← 返回前台</a>
      </div>
    </div>
  )
}

// ── Form fields ───────────────────────────────────────────────
const CATS = ['BRAND', 'CAMPUS', 'CONCERT', 'EVENT', 'AUCTION']

function CaseForm({ initial, onSubmit, onCancel, onDelete, isCustom, submitLabel = '新增作品集' }) {
  const [form, setForm] = useState(initial || {
    num: nextCaseNum(),
    year: new Date().getFullYear().toString(),
    cat: 'BRAND',
    img: null,
    zh: '',
    en: '',
  })
  const [busy, setBusy] = useState(false)
  const fileRef = useRef(null)

  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  const handleImage = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 1.5 * 1024 * 1024) {
      alert('圖片太大，請壓縮到 1.5MB 以下（建議 800×1000px JPG）')
      return
    }
    const reader = new FileReader()
    reader.onload = (ev) => update('img', ev.target.result)
    reader.readAsDataURL(file)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!form.zh.trim()) { alert('請填寫中文標題'); return }
    if (!form.en.trim()) { alert('請填寫英文標題'); return }
    setBusy(true)
    onSubmit({ ...form, num: form.num.toUpperCase() })
    setBusy(false)
  }

  return (
    <form className="w-admin-form" onSubmit={handleSubmit}>
      <h3>{isCustom ? '編輯作品集' : '新增作品集'}</h3>
      <div className="w-form-sub">
        {isCustom ? '已發布到前台，修改後即時生效' : '填寫後點新增，立即出現在前台'}
      </div>

      <label>編號</label>
      <input type="text" value={form.num} onChange={(e) => update('num', e.target.value)} required maxLength={10} />

      <label>年份</label>
      <input type="text" value={form.year} onChange={(e) => update('year', e.target.value)} required maxLength={4} placeholder="2025" />

      <label>分類</label>
      <select value={form.cat} onChange={(e) => update('cat', e.target.value)}>
        {CATS.map((c) => <option key={c} value={c}>{c}</option>)}
      </select>

      <label>中文標題</label>
      <input type="text" value={form.zh} onChange={(e) => update('zh', e.target.value)} required maxLength={60} placeholder="例：Dcard × Google Gemini 校園推廣" />

      <label>英文標題</label>
      <input type="text" value={form.en} onChange={(e) => update('en', e.target.value)} required maxLength={80} placeholder="Dcard × Google Gemini Campus Activation" />

      <label>封面圖（可選，建議 800×1000px JPG）</label>
      <div
        className="w-image-preview"
        style={form.img ? { backgroundImage: `url('${form.img}')` } : {}}
        onClick={() => fileRef.current?.click()}
        role="button"
        tabIndex={0}
      >
        {!form.img && '+ 點擊上傳圖片'}
      </div>
      <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={handleImage} style={{ display: 'none' }} />
      {form.img && (
        <button type="button" className="w-btn-ghost" style={{ width: '100%', marginTop: 8 }} onClick={() => update('img', null)}>
          移除圖片
        </button>
      )}

      <div className="w-form-row">
        {onCancel && <button type="button" className="w-btn-ghost" onClick={onCancel}>取消</button>}
        <button type="submit" className="w-btn-primary" disabled={busy}>{busy ? '儲存中...' : submitLabel}</button>
      </div>
      {onDelete && (
        <button type="button" className="w-btn-danger" style={{ width: '100%', marginTop: 8 }} onClick={onDelete}>
          刪除此作品集
        </button>
      )}
    </form>
  )
}

// ── Main dashboard ────────────────────────────────────────────
// Asset keys that the frontend uses to display images outside of cases.
const ASSET_KEYS = [
  { key: 'about_team',    name: 'About 團隊照片', desc: 'About 區塊的團隊 PORTRAIT 圖，建議 720×900' },
  { key: 'about_brand',   name: 'About 品牌圖像', desc: 'About 區塊右側的品牌識別/視覺展示圖' },
]

// ── Reroll defaults (Picsum random seeds) ────────────────────
function RerollPanel({ show, onBack }) {
  const [busy, setBusy] = useState(false)
  const [seed, setSeed] = useState(null)

  const handleReroll = () => {
    if (!confirm('確定要重新隨機所有預設圖片？\n\n這會改變 16 個案例 + 2 個素材的 Picsum seed，前台會立即顯示新圖。\n（您已上傳的真實圖片不受影響）')) return
    setBusy(true)
    try {
      if (window.WORKS_DEFAULT_IMAGES?.rerollSeeds) {
        window.WORKS_DEFAULT_IMAGES.rerollSeeds()
        const newMap = window.WORKS_DEFAULT_IMAGES.refresh()
        // Bump a marker so listeners (cases.jsx / about.jsx) can re-read
        localStorage.setItem('works-default-images-version', String(Date.now()))
        const preview = Object.values(newMap.cases)[0]
        setSeed(preview)
        show('✓ 已重新隨機所有預設圖片 — 切回前台 reload 看新圖')
      } else {
        show('找不到 WORKS_DEFAULT_IMAGES，請確認 default-images.jsx 已載入', 'err')
      }
    } catch (e) {
      show('重新隨機失敗：' + e.message, 'err')
    }
    setBusy(false)
  }

  return (
    <div className="w-admin-wrap">
      <div className="w-admin-bar">
        <div>
          <h1>預設圖素材管理</h1>
          <div className="w-meta" style={{ marginTop: 4 }}>
            Picsum seed 控制 16 個案例 + 2 個素材的隨機占位圖
          </div>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <button onClick={onBack} style={{ background: 'transparent', color: 'var(--w-text-mute)', border: '1px solid var(--w-line)', padding: '8px 14px', cursor: 'pointer', fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase' }}>← 回到作品集</button>
        </div>
      </div>

      <div className="w-admin-form" style={{ maxWidth: 640, margin: '40px auto' }}>
        <h3>🎲 重新隨機所有預設圖</h3>
        <div className="w-form-sub">
          Picsum 是 Flickr 上的真實照片（隨機），不是真實活動照片。<br />
          按下「重新隨機」會洗牌 18 個 seed → 全部換成新照片。
        </div>

        <div style={{ marginTop: 20, padding: 16, background: 'var(--w-ink-3)', borderRadius: 2, fontSize: 13, lineHeight: 1.7, color: 'var(--w-text-soft)' }}>
          <strong style={{ color: 'var(--w-text)' }}>注意事項：</strong>
          <ul style={{ margin: '8px 0 0 16px', padding: 0 }}>
            <li>目前 Picsum 圖庫無法 keyword 過濾（例如無法保證都是「展場」或「戶外活動」）</li>
            <li>隨機到的照片可能跟案例主題無關 — 屬於占位性質</li>
            <li><strong>要真實的活動照片：</strong> 請到「作品集管理」逐個 case 編輯上傳</li>
            <li>已上傳的真實圖片不受「重新隨機」影響</li>
          </ul>
        </div>

        {seed && (
          <div style={{ marginTop: 20, padding: 12, background: 'rgba(224,87,32,0.08)', border: '1px solid var(--w-accent)', borderRadius: 2, fontSize: 12, color: 'var(--w-text)' }}>
            <strong>範例新 URL：</strong><br />
            <code style={{ wordBreak: 'break-all', fontSize: 11 }}>{seed}</code>
          </div>
        )}

        <div className="w-form-row" style={{ marginTop: 24 }}>
          <button type="button" className="w-btn-primary" onClick={handleReroll} disabled={busy}>
            {busy ? '隨機中...' : '🎲 重新隨機全部預設圖'}
          </button>
        </div>
      </div>
    </div>
  )
}

function ImageAssetManager({ show, onBack }) {
  const [assets, setAssets] = useState(loadImageAssets())
  const [editing, setEditing] = useState(null) // {key, name, img} | null
  const fileRef = useRef(null)

  const refresh = () => setAssets(loadImageAssets())

  const handleFile = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 1.5 * 1024 * 1024) {
      alert('圖片太大，請壓縮到 1.5MB 以下')
      return
    }
    const reader = new FileReader()
    reader.onload = (ev) => {
      setEditing((s) => ({ ...(s || { key: '', name: '', desc: '' }), img: ev.target.result }))
    }
    reader.readAsDataURL(file)
  }

  const handleSave = (data) => {
    if (!data.key) { alert('請選擇素材類型'); return }
    const map = loadImageAssets()
    map[data.key] = {
      name: data.name,
      desc: data.desc,
      img: data.img,
      updatedAt: Date.now(),
    }
    saveImageAssets(map)
    setEditing(null)
    refresh()
    show(`✓ 已儲存「${data.name}」`)
  }

  const handleRemove = (key, name) => {
    if (!confirm(`確定刪除「${name}」？恢復後前台會顯示原本的占位格。`)) return
    const map = loadImageAssets()
    delete map[key]
    saveImageAssets(map)
    refresh()
    show('✓ 已刪除素材')
  }

  return (
    <div className="w-admin-wrap">
      <div className="w-admin-bar">
        <div>
          <h1>圖片素材庫</h1>
          <div className="w-meta" style={{ marginTop: 4 }}>
            管理前端非案例區塊的圖片（About、Hero 等位置）
          </div>
        </div>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <button onClick={onBack} style={{ background: 'transparent', color: 'var(--w-text-mute)', border: '1px solid var(--w-line)', padding: '8px 14px', cursor: 'pointer', fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase' }}>← 回到作品集</button>
        </div>
      </div>

      <div className="w-admin-grid">
        <div>
          {editing ? (
            <form className="w-admin-form" onSubmit={(e) => { e.preventDefault(); handleSave(editing) }}>
              <h3>編輯素材</h3>
              <div className="w-form-sub">上傳圖片後點儲存，前台會立即套用</div>
              <label>素材類型</label>
              <select value={editing.key} onChange={(e) => {
                const k = ASSET_KEYS.find((a) => a.key === e.target.value)
                if (k) setEditing((s) => ({ ...s, key: k.key, name: k.name, desc: k.desc }))
              }}>
                <option value="">— 選擇素材類型 —</option>
                {ASSET_KEYS.map((a) => (
                  <option key={a.key} value={a.key}>{a.name}</option>
                ))}
              </select>
              {editing.desc && <div style={{ color: 'var(--w-text-mute)', fontSize: 12, marginTop: 6 }}>{editing.desc}</div>}
              <label>顯示名稱</label>
              <input type="text" value={editing.name || ''} onChange={(e) => setEditing((s) => ({ ...s, name: e.target.value }))} placeholder="素材名稱" />

              <label>圖片</label>
              <div
                className="w-image-preview"
                style={editing.img ? { backgroundImage: `url('${editing.img}')` } : {}}
                onClick={() => fileRef.current?.click()}
                role="button"
                tabIndex={0}
              >
                {!editing.img && '+ 點擊上傳圖片'}
              </div>
              <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={handleFile} style={{ display: 'none' }} />
              {editing.img && (
                <button type="button" className="w-btn-ghost" style={{ width: '100%', marginTop: 8 }} onClick={() => setEditing((s) => ({ ...s, img: null }))}>
                  移除圖片
                </button>
              )}

              <div className="w-form-row">
                <button type="button" className="w-btn-ghost" onClick={() => setEditing(null)}>取消</button>
                <button type="submit" className="w-btn-primary">儲存</button>
              </div>
            </form>
          ) : (
            <div className="w-admin-form">
              <h3>新增 / 替換素材</h3>
              <div className="w-form-sub">每個素材類型只保留最新一張</div>
              <div className="w-form-row">
                <button type="button" className="w-btn-primary" onClick={() => setEditing({ key: '', name: '', desc: '', img: null })}>
                  + 上傳圖片素材
                </button>
              </div>
              <div style={{ marginTop: 20, padding: 14, background: 'var(--w-ink-3)', borderRadius: 2, fontSize: 12, color: 'var(--w-text-mute)', lineHeight: 1.6 }}>
                <strong style={{ color: 'var(--w-text)' }}>使用說明：</strong><br />
                • 每個素材 key 只會保留最新一張<br />
                • 案例圖請用「作品集管理」<br />
                • 圖片 1.5MB 以下，base64 存 localStorage
              </div>
            </div>
          )}
        </div>

        <div>
          <div className="w-list-bar">
            <h2>已綁定的素材位置</h2>
            <div className="w-meta">橘色 = 已上傳 / 灰色 = 顯示占位格</div>
          </div>
          <div className="w-admin-list">
            {ASSET_KEYS.map((a) => {
              const asset = assets[a.key]
              return (
                <div key={a.key} className="w-case-row" style={asset ? { borderLeft: '3px solid var(--w-accent)' } : { opacity: 0.6 }}>
                  <div className="w-thumb" style={asset?.img ? { backgroundImage: `url('${asset.img}')` } : {}}>
                    {!asset?.img && '占位'}
                  </div>
                  <div className="w-info">
                    <h4>{a.name}</h4>
                    <div className="w-en">{a.desc}</div>
                    <div className="w-tags">
                      <span className="w-tag">key: {a.key}</span>
                      {asset && <span className="w-tag" style={{ color: 'var(--w-accent)' }}>✓ 已上傳</span>}
                      {asset?.updatedAt && <span className="w-tag">{new Date(asset.updatedAt).toLocaleDateString('zh-TW')}</span>}
                    </div>
                  </div>
                  <div className="w-actions">
                    <button onClick={() => setEditing({
                      key: a.key,
                      name: asset?.name || a.name,
                      desc: a.desc,
                      img: asset?.img || null,
                    })}>
                      {asset ? '替換' : '上傳'}
                    </button>
                    {asset && <button className="w-del" onClick={() => handleRemove(a.key, a.name)}>刪除</button>}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

function AdminApp({ user, onLogout }) {
  const [view, setView] = useState('cases') // 'cases' | 'assets' | 'reroll'
  const [cases, setCases] = useState(getEffectiveCases())
  const [editing, setEditing] = useState(null) // 'new' | {case}
  const { toast, show } = useToast()

  const refresh = () => setCases(getEffectiveCases())

  const handleAdd = (data) => {
    const customs = loadCustomCases()
    customs[data.num] = { ...data, _custom: true }
    saveCustomCases(customs)
    setEditing(null)
    refresh()
    show(`✓ 已新增「${data.zh}」到前台`)
  }

  const handleEdit = (data) => {
    const customs = loadCustomCases()
    customs[data.num] = { ...data, _custom: true }
    saveCustomCases(customs)
    setEditing(null)
    refresh()
    show(`✓ 已更新「${data.zh}」`)
  }

  const handleDelete = (c) => {
    if (!confirm(`確定刪除「${c.zh}」？此操作無法復原。`)) return
    if (c._custom) {
      // Remove from customs map
      const customs = loadCustomCases()
      delete customs[c.num]
      saveCustomCases(customs)
    } else {
      const deleted = loadDeletedDefaults()
      if (!deleted.includes(c.num)) deleted.push(c.num)
      saveDeletedDefaults(deleted)
    }
    setEditing(null)
    refresh()
    show('✓ 已刪除')
  }

  const handleRestoreDefault = (c) => {
    const deleted = loadDeletedDefaults().filter((n) => n !== c.num)
    saveDeletedDefaults(deleted)
    refresh()
    show('✓ 已恢復預設案例')
  }

  const defaults = cases.filter((c) => !c._custom)
  const customs = cases.filter((c) => c._custom)

  if (view === 'assets') {
    return (
      <>
        <ImageAssetManager show={show} onBack={() => setView('cases')} />
        {toast && <div className={`w-toast${toast.type === 'err' ? ' err' : ''}`}>{toast.msg}</div>}
      </>
    )
  }

  if (view === 'reroll') {
    return (
      <>
        <RerollPanel show={show} onBack={() => setView('cases')} />
        {toast && <div className={`w-toast${toast.type === 'err' ? ' err' : ''}`}>{toast.msg}</div>}
      </>
    )
  }

  return (
    <div className="w-admin-wrap">
      <div className="w-admin-bar">
        <div>
          <h1>作品集管理</h1>
          <div className="w-meta" style={{ marginTop: 4 }}>
            目前登入：<strong style={{ color: 'var(--w-accent)' }}>{user}</strong> · 共 {cases.length} 個案例（{customs.length} 自訂 / {defaults.length} 預設）
          </div>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
          <button onClick={() => setView('assets')} style={{ background: 'transparent', color: 'var(--w-accent)', border: '1px solid var(--w-accent)', padding: '8px 14px', cursor: 'pointer', fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase' }}>🖼 圖片素材庫</button>
          <button onClick={() => setView('reroll')} style={{ background: 'transparent', color: 'var(--w-text-mute)', border: '1px solid var(--w-line)', padding: '8px 14px', cursor: 'pointer', fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase' }}>🎲 預設圖管理</button>
          <a href="works.html" target="_blank" rel="noopener" style={{ color: 'var(--w-text-mute)', fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase', textDecoration: 'none' }}>查看前台 ↗</a>
          <button onClick={onLogout} style={{ background: 'transparent', color: 'var(--w-text-mute)', border: '1px solid var(--w-line)', padding: '8px 14px', cursor: 'pointer', fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase' }}>登出</button>
        </div>
      </div>

      <div className="w-admin-grid">
        <div>
          {editing === 'new' ? (
            <CaseForm
              initial={{ num: nextCaseNum(), year: new Date().getFullYear().toString(), cat: 'BRAND', img: null, zh: '', en: '' }}
              onSubmit={handleAdd}
              onCancel={() => setEditing(null)}
              submitLabel="新增到前台"
            />
          ) : editing ? (
            <CaseForm
              initial={editing}
              isCustom={editing._custom}
              onSubmit={handleEdit}
              onCancel={() => setEditing(null)}
              onDelete={() => handleDelete(editing)}
              submitLabel="儲存變更"
            />
          ) : (
            <div className="w-admin-form">
              <h3>新增作品集</h3>
              <div className="w-form-sub">把你新完成的案例加到前台</div>
              <div className="w-form-row">
                <button type="button" className="w-btn-primary" onClick={() => setEditing('new')}>
                  + 新增作品集
                </button>
              </div>
              <div style={{ marginTop: 20, padding: 14, background: 'var(--w-ink-3)', borderRadius: 2, fontSize: 12, color: 'var(--w-text-mute)', lineHeight: 1.6 }}>
                <strong style={{ color: 'var(--w-text)' }}>使用提示：</strong><br />
                • 圖片用 JPG/PNG/WebP，1.5MB 以下<br />
                • 編號自動產生，可手動改<br />
                • 自訂案例刪除後仍可從預設恢復
              </div>
            </div>
          )}
        </div>

        <div>
          <div className="w-list-bar">
            <h2>自訂案例 ({customs.length})</h2>
            <div className="w-meta">橘色左邊框 = 透過後台新增</div>
          </div>
          <div className="w-admin-list">
            {customs.length === 0 ? (
              <div className="w-empty" style={{ background: 'var(--w-ink-2)', border: '1px solid var(--w-line)', borderRadius: 2 }}>
                <h3>還沒有自訂案例</h3>
                <p>點左側「+ 新增作品集」開始建立你的第一個案例</p>
              </div>
            ) : customs.map((c) => (
              <div key={c.num} className="w-case-row w-custom">
                <div className="w-thumb" style={c.img ? { backgroundImage: `url('${c.img}')` } : {}}>{!c.img && 'NO IMG'}</div>
                <div className="w-info">
                  <h4>{c.zh}</h4>
                  <div className="w-en">{c.en}</div>
                  <div className="w-tags">
                    <span className="w-tag">#{c.num}</span>
                    <span className="w-tag">{c.cat}</span>
                    <span className="w-tag">{c.year}</span>
                  </div>
                </div>
                <div className="w-actions">
                  <button onClick={() => setEditing(c)}>編輯</button>
                  <button className="w-del" onClick={() => handleDelete(c)}>刪除</button>
                </div>
              </div>
            ))}
          </div>

          <div className="w-list-bar" style={{ marginTop: 40 }}>
            <h2>預設案例 ({defaults.length})</h2>
            <div className="w-meta">PDF 規格內建 — 可隱藏但無法永久刪除</div>
          </div>
          <div className="w-admin-list">
            {defaults.length === 0 ? (
              <div className="w-empty" style={{ background: 'var(--w-ink-2)', border: '1px solid var(--w-line)', borderRadius: 2 }}>
                <h3>所有預設案例都已隱藏</h3>
                <p>點右側「恢復」可重新顯示</p>
              </div>
            ) : defaults.map((c) => (
              <div key={c.num} className="w-case-row w-default">
                <div className="w-thumb" style={c.img ? { backgroundImage: `url('${c.img}')` } : {}}>{!c.img && 'NO IMG'}</div>
                <div className="w-info">
                  <h4>{c.zh}</h4>
                  <div className="w-en">{c.en}</div>
                  <div className="w-tags">
                    <span className="w-tag">#{c.num}</span>
                    <span className="w-tag">{c.cat}</span>
                    <span className="w-tag">{c.year}</span>
                  </div>
                </div>
                <div className="w-actions">
                  <button onClick={() => setEditing(c)}>編輯</button>
                  <button className="w-del" onClick={() => handleDelete(c)}>隱藏</button>
                </div>
              </div>
            ))}
            {loadDeletedDefaults().length > 0 && (
              <details style={{ marginTop: 12, color: 'var(--w-text-mute)', fontSize: 12 }}>
                <summary style={{ cursor: 'pointer', padding: 12 }}>查看已隱藏的預設案例 ({loadDeletedDefaults().length})</summary>
                <div className="w-admin-list" style={{ marginTop: 8 }}>
                  {(window.WORKS_DATA.cases || []).filter((c) => loadDeletedDefaults().includes(c.num)).map((c) => (
                    <div key={c.num} className="w-case-row w-default" style={{ opacity: 0.4 }}>
                      <div className="w-thumb" style={c.img ? { backgroundImage: `url('${c.img}')` } : {}}>{!c.img && 'NO IMG'}</div>
                      <div className="w-info">
                        <h4>{c.zh}</h4>
                        <div className="w-en">{c.en}</div>
                        <div className="w-tags">
                          <span className="w-tag">#{c.num}</span>
                          <span className="w-tag">{c.cat}</span>
                          <span className="w-tag">{c.year}</span>
                        </div>
                      </div>
                      <div className="w-actions">
                        <button onClick={() => handleRestoreDefault(c)}>恢復</button>
                      </div>
                    </div>
                  ))}
                </div>
              </details>
            )}
          </div>
        </div>
      </div>

      {toast && <div className={`w-toast${toast.type === 'err' ? ' err' : ''}`}>{toast.msg}</div>}
    </div>
  )
}

// ── Root ──────────────────────────────────────────────────────
function Root() {
  const [session, setSession] = useState(() => {
    try {
      const s = JSON.parse(localStorage.getItem(STORAGE_KEYS.AUTH) || 'null')
      if (s && s.user) return s
    } catch {}
    return null
  })

  const handleLogout = () => {
    localStorage.removeItem(STORAGE_KEYS.AUTH)
    setSession(null)
  }

  // Expose to works.html — components can pull effective cases / image assets
  // via these global helpers without needing to re-implement localStorage logic.
  window.WORKS_getEffectiveCases = getEffectiveCases
  // Image assets: also expose a synchronous getter that works without
  // having to load admin-app.jsx on the public-facing works.html
  window.WORKS_getImageAsset = (key) => {
    try {
      const assets = JSON.parse(localStorage.getItem('works-image-assets') || '{}')
      return assets[key]?.img || null
    } catch { return null }
  }

  if (!session) return <LoginView onLogin={(user) => setSession({ user, ts: Date.now() })} />
  return <AdminApp user={session.user} onLogout={handleLogout} />
}

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(<Root />)
