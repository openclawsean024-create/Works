// WORKS — Admin backend
// Login (default admin / admin) + Case CRUD with localStorage persistence.

const { useState, useEffect, useRef } = React

// ── Storage keys ──────────────────────────────────────────────
const STORAGE_KEYS = {
  AUTH: 'works-admin-session',
  CRED: 'works-admin-creds',
  CASES: 'works-custom-cases',
  DELETED: 'works-deleted-defaults',
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
function loadCustomCases() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEYS.CASES) || '[]') } catch { return [] }
}
function saveCustomCases(cases) { localStorage.setItem(STORAGE_KEYS.CASES, JSON.stringify(cases)) }
function loadDeletedDefaults() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEYS.DELETED) || '[]') } catch { return [] }
}
function saveDeletedDefaults(nums) { localStorage.setItem(STORAGE_KEYS.DELETED, JSON.stringify(nums)) }

// Effective cases = data.jsx defaults (minus deleted) + custom cases
function getEffectiveCases() {
  const D = window.WORKS_DATA
  const deleted = new Set(loadDeletedDefaults())
  const defaults = (D.cases || []).filter((c) => !deleted.has(c.num))
  const customs = loadCustomCases()
  return [...customs, ...defaults]
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
function AdminApp({ user, onLogout }) {
  const [cases, setCases] = useState(getEffectiveCases())
  const [editing, setEditing] = useState(null) // 'new' | {case}
  const { toast, show } = useToast()

  const refresh = () => setCases(getEffectiveCases())

  const handleAdd = (data) => {
    const customs = loadCustomCases()
    customs.unshift({ ...data, _custom: true })
    saveCustomCases(customs)
    setEditing(null)
    refresh()
    show(`✓ 已新增「${data.zh}」到前台`)
  }

  const handleEdit = (data) => {
    const customs = loadCustomCases()
    const idx = customs.findIndex((c) => c.num === data.num)
    if (idx >= 0) customs[idx] = { ...data, _custom: true }
    else customs.unshift({ ...data, _custom: true })
    saveCustomCases(customs)
    setEditing(null)
    refresh()
    show(`✓ 已更新「${data.zh}」`)
  }

  const handleDelete = (c) => {
    if (!confirm(`確定刪除「${c.zh}」？此操作無法復原。`)) return
    if (c._custom) {
      const customs = loadCustomCases().filter((x) => x.num !== c.num)
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

  return (
    <div className="w-admin-wrap">
      <div className="w-admin-bar">
        <div>
          <h1>作品集管理</h1>
          <div className="w-meta" style={{ marginTop: 4 }}>
            目前登入：<strong style={{ color: 'var(--w-accent)' }}>{user}</strong> · 共 {cases.length} 個案例（{customs.length} 自訂 / {defaults.length} 預設）
          </div>
        </div>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <a href="works.html" target="_blank" rel="noopener">查看前台 ↗</a>
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

  // Expose to works.html — it can pull effective cases via this global function
  window.WORKS_getEffectiveCases = getEffectiveCases

  if (!session) return <LoginView onLogin={(user) => setSession({ user, ts: Date.now() })} />
  return <AdminApp user={session.user} onLogout={handleLogout} />
}

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(<Root />)
