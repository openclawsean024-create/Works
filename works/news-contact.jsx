// WORKS — News + Contact + Footer

const WNews = () => {
  const D = window.WORKS_DATA;
  return (
    <section id="w-news" className="w-section" style={{background: 'var(--w-ink-2)'}}>
      <style>{`
        .w-news-list {
          border-top: 1px solid var(--w-line);
        }
        .w-news-row {
          display: grid;
          grid-template-columns: 130px 100px 1fr 60px;
          gap: 32px;
          padding: 24px 0;
          border-bottom: 1px solid var(--w-line);
          align-items: baseline;
          cursor: pointer;
          transition: padding .3s, background .3s;
        }
        .w-news-row:hover {
          padding-left: 16px;
          background: rgba(232,255,58,0.04);
        }
        .w-news-row:hover .w-news-arrow { color: var(--w-accent); transform: translateX(6px); }
        .w-news-date {
          font-family: "JetBrains Mono", monospace;
          font-size: 12px;
          letter-spacing: 0.06em;
          color: var(--w-text-mute);
        }
        .w-news-tag {
          font-family: "Inter", sans-serif;
          font-size: 9px;
          font-weight: 600;
          letter-spacing: 0.22em;
          padding: 4px 10px;
          border: 1px solid var(--w-text-soft);
          color: var(--w-text-soft);
          text-transform: uppercase;
          justify-self: start;
        }
        .w-news-zh {
          font-family: "Noto Serif TC", serif;
          font-weight: 500;
          font-size: 22px;
          color: var(--w-text);
          margin: 0;
        }
        .w-news-zh small {
          display: block;
          font-family: "Inter", sans-serif;
          font-weight: 300;
          font-size: 11px;
          letter-spacing: 0.18em;
          color: var(--w-text-mute);
          margin-top: 4px;
          text-transform: uppercase;
        }
        .w-news-arrow {
          justify-self: end;
          font-family: "Inter", sans-serif;
          font-size: 18px;
          color: var(--w-text-soft);
          transition: color .25s, transform .25s;
        }
      `}</style>

      <div className="w-section-head">
        <div>
          <div className="w-eyebrow" style={{marginBottom: 24}}>NEWS · 消息公告</div>
          <h2>最新<em>動態</em>。</h2>
        </div>
        <div className="right">
          專案進度、徵才公告、公司里程碑 — 跟著沃克思一起走。
        </div>
      </div>

      <div className="w-news-list">
        {D.news.map((n, i) => (
          <div key={i} className="w-news-row">
            <span className="w-news-date">{n.date}</span>
            <span className="w-news-tag">{n.tag}</span>
            <h3 className="w-news-zh">{n.zh}<small>{n.en}</small></h3>
            <span className="w-news-arrow">↗</span>
          </div>
        ))}
      </div>
    </section>
  );
};

// ── 填入你的 Formspree endpoint ──────────────────────────────────────
// 1. 前往 https://formspree.io → 免費註冊 → New Form
// 2. 在 Form Settings → Email 填入 hello@works.tw
// 3. 複製 endpoint（格式：https://formspree.io/f/xxxxxxxx）貼到下方
// 4. sean0407@gmail.com 會透過 _cc 欄位自動收到副本
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/YOUR_FORM_ID';

const WContact = () => {
  const D = window.WORKS_DATA;
  const [form, setForm] = React.useState({ name: '', company: '', type: '', date: '', budget: '', msg: '' });
  const [status, setStatus] = React.useState('idle'); // idle | sending | sent | error

  const update = (k) => (e) => setForm(f => ({...f, [k]: e.target.value}));

  const submit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({
          姓名: form.name,
          公司: form.company,
          活動類型: form.type,
          預計日期: form.date,
          預算範圍: form.budget,
          需求說明: form.msg,
          _cc: 'sean0407@gmail.com',
          _subject: `[WORKS 詢價] ${form.name}${form.company ? ' / ' + form.company : ''} — ${form.type || '專案詢問'}`,
        }),
      });
      if (res.ok) {
        setStatus('sent');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  const types = ['新品上市', '消費者活動', '記者會', '校園活動', '展場', '尾牙年會', '其他'];

  return (
    <section id="w-contact" className="w-section" style={{paddingBottom: 80}}>
      <style>{`
        .w-contact-grid {
          display: grid;
          grid-template-columns: 5fr 7fr;
          gap: 80px;
        }
        .w-contact-info h3 {
          font-family: "Noto Serif TC", serif;
          font-weight: 600;
          font-size: 48px;
          line-height: 1.1;
          margin: 0 0 32px;
          letter-spacing: -0.01em;
        }
        .w-contact-info h3 em { font-style: italic; color: var(--w-accent); }
        .w-contact-block {
          padding: 24px 0;
          border-top: 1px solid var(--w-line);
        }
        .w-contact-block:last-child { border-bottom: 1px solid var(--w-line); }
        .w-contact-block-lab {
          font-family: "Inter", sans-serif;
          font-size: 10px;
          letter-spacing: 0.22em;
          color: var(--w-text-mute);
          text-transform: uppercase;
          margin-bottom: 6px;
        }
        .w-contact-block-val {
          font-family: "Noto Serif TC", serif;
          font-size: 20px;
          color: var(--w-text);
          line-height: 1.5;
        }
        .w-contact-block-val small {
          display: block;
          font-family: "JetBrains Mono", monospace;
          font-size: 11px;
          color: var(--w-text-mute);
          margin-top: 4px;
        }

        /* Form */
        .w-form {
          background: var(--w-ink-2);
          padding: 40px;
          border: 1px solid var(--w-line);
        }
        .w-form-head {
          display: flex; justify-content: space-between; align-items: end;
          padding-bottom: 24px;
          border-bottom: 1px solid var(--w-line);
          margin-bottom: 32px;
        }
        .w-form-head h4 {
          font-family: "Noto Serif TC", serif;
          font-weight: 600;
          font-size: 24px;
          margin: 0;
        }
        .w-form-row { margin-bottom: 24px; }
        .w-form-row .lab {
          font-family: "Inter", sans-serif;
          font-size: 10px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--w-text-mute);
          margin-bottom: 8px;
        }
        .w-form-row .lab .req { color: var(--w-accent); margin-left: 4px; }
        .w-form input, .w-form textarea, .w-form select {
          width: 100%;
          padding: 12px 14px;
          background: var(--w-ink);
          border: 1px solid var(--w-line);
          color: var(--w-text);
          font-family: "Noto Serif TC", serif;
          font-size: 15px;
          outline: none;
          transition: border-color .25s;
        }
        .w-form input:focus, .w-form textarea:focus, .w-form select:focus {
          border-color: var(--w-accent);
        }
        .w-form textarea {
          resize: vertical;
          min-height: 96px;
          font-family: "Noto Serif TC", serif;
        }
        .w-form-grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .w-types { display: flex; flex-wrap: wrap; gap: 6px; }
        .w-type {
          padding: 8px 14px;
          background: transparent;
          border: 1px solid var(--w-line);
          color: var(--w-text-soft);
          font-family: "Inter", sans-serif;
          font-size: 12px;
          letter-spacing: 0.04em;
          cursor: pointer;
          transition: all .2s;
        }
        .w-type:hover { border-color: var(--w-text); color: var(--w-text); }
        .w-type.active {
          background: var(--w-accent);
          color: #0A1628;
          border-color: var(--w-accent);
        }
        .w-form-foot {
          display: flex; justify-content: space-between; align-items: center;
          margin-top: 16px;
        }
        .w-form-note {
          font-family: "JetBrains Mono", monospace;
          font-size: 10px;
          letter-spacing: 0.06em;
          color: var(--w-text-mute);
          line-height: 1.6;
        }
        .w-form-sent {
          padding: 32px;
          background: var(--w-accent);
          color: #0A1628;
          font-family: "Noto Serif TC", serif;
          font-size: 22px;
          font-weight: 600;
          text-align: center;
          line-height: 1.4;
        }
        .w-form-sent small {
          display: block;
          font-family: "Inter", sans-serif;
          font-weight: 400;
          font-size: 11px;
          letter-spacing: 0.18em;
          margin-top: 8px;
          text-transform: uppercase;
        }
      `}</style>

      <div className="w-section-head">
        <div>
          <div className="w-eyebrow" style={{marginBottom: 24}}>CONTACT · 聯絡我們</div>
          <h2>下一場活動，<br/><em>從這裡開始。</em></h2>
        </div>
        <div className="right">
          告訴我們活動的初步想法，24 小時內回覆。也歡迎直接致電或來信討論——我們相信好的提案需要面對面。
        </div>
      </div>

      <div className="w-contact-grid">
        <div className="w-contact-info">
          <h3>把<em>初衷</em>，<br/>交給我們。</h3>

          <div className="w-contact-block">
            <div className="w-contact-block-lab">★ EMAIL</div>
            <div className="w-contact-block-val">
              hello@works.tw
              <small>提案・合作・媒體洽詢</small>
            </div>
          </div>
          <div className="w-contact-block">
            <div className="w-contact-block-lab">★ PHONE</div>
            <div className="w-contact-block-val">
              02-2311-0000
              <small>週一至五 10:00 — 18:30</small>
            </div>
          </div>
          <div className="w-contact-block">
            <div className="w-contact-block-lab">★ ADDRESS</div>
            <div className="w-contact-block-val">
              {D.brand.address}
              <small>{D.brand.addressEn}</small>
            </div>
          </div>
          <div className="w-contact-block">
            <div className="w-contact-block-lab">★ COMPANY</div>
            <div className="w-contact-block-val">
              {D.brand.full}
              <small>統一編號 {D.brand.taxid} / EST. 2024</small>
            </div>
          </div>
        </div>

        {status === 'sent' ? (
          <div className="w-form" style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <div className="w-form-sent">
              ★ 已收到您的需求<br/>
              我們會在 24 小時內回覆
              <small>THANK YOU — WE'LL BE IN TOUCH</small>
            </div>
          </div>
        ) : (
          <form className="w-form" onSubmit={submit}>
            <div className="w-form-head">
              <h4>專案詢問 / Project Inquiry</h4>
              <div className="w-meta">[ FORM 01 / 01 ]</div>
            </div>

            <div className="w-form-grid2">
              <div className="w-form-row">
                <div className="lab">姓名 / NAME<span className="req">★</span></div>
                <input value={form.name} onChange={update('name')} required placeholder="王小明" />
              </div>
              <div className="w-form-row">
                <div className="lab">公司 / COMPANY</div>
                <input value={form.company} onChange={update('company')} placeholder="公司名稱（選填）" />
              </div>
            </div>

            <div className="w-form-row">
              <div className="lab">活動類型 / TYPE</div>
              <div className="w-types">
                {types.map(t => (
                  <button type="button" key={t}
                          className={'w-type' + (form.type === t ? ' active' : '')}
                          onClick={() => setForm(f => ({...f, type: t}))}>
                    {t}
                  </button>
                ))}
              </div>
            </div>

            <div className="w-form-grid2">
              <div className="w-form-row">
                <div className="lab">預計日期 / DATE</div>
                <input type="text" value={form.date} onChange={update('date')} placeholder="2026.06" />
              </div>
              <div className="w-form-row">
                <div className="lab">預算範圍 / BUDGET</div>
                <select value={form.budget} onChange={update('budget')}>
                  <option value="">— 請選擇 —</option>
                  <option>NT$ 30 萬以下</option>
                  <option>NT$ 30 — 80 萬</option>
                  <option>NT$ 80 — 150 萬</option>
                  <option>NT$ 150 萬以上</option>
                  <option>尚未確定</option>
                </select>
              </div>
            </div>

            <div className="w-form-row">
              <div className="lab">需求說明 / BRIEF<span className="req">★</span></div>
              <textarea value={form.msg} onChange={update('msg')} required
                        placeholder="活動初步想法、規模、目標受眾..." />
            </div>

            <div className="w-form-foot">
              <div className="w-form-note">
                ※ 24 小時內回覆<br/>
                ※ 提案內容嚴格保密
                {status === 'error' && (
                  <div style={{color:'#ff6b6b', marginTop: 8}}>送出失敗，請稍後再試。</div>
                )}
              </div>
              <button type="submit" className="w-btn" disabled={status === 'sending'}>
                {status === 'sending' ? '送出中...' : '送出詢問 / SEND →'}
              </button>
            </div>
          </form>
        )}
      </div>
    </section>
  );
};

const WFooter = () => {
  const D = window.WORKS_DATA;
  return (
    <footer className="w-footer" style={{padding: '64px 64px 36px', borderTop: '1px solid rgba(244,241,234,0.14)'}}>
      <style>{`
        .w-footer {
          background: #050D1A;
          color: #F4F1EA;
        }
        .w-footer .w-meta { color: rgba(244,241,234,0.55); }
        .w-footer .w-foot-mark { color: #F4F1EA !important; }
        .w-footer .w-foot-mark em { color: #E8FF3A !important; }
        .w-footer p { color: rgba(244,241,234,0.78) !important; }
        .w-footer .w-foot-col h5 { color: #E8FF3A !important; }
        .w-footer .w-foot-col li { color: rgba(244,241,234,0.78) !important; }
        .w-footer .w-foot-col li:hover { color: #E8FF3A !important; }
        .w-footer .w-foot-bot { color: rgba(244,241,234,0.55) !important; border-top: 1px solid rgba(244,241,234,0.12); padding-top: 20px; }
        .w-footer .w-foot-top { border-bottom-color: rgba(244,241,234,0.14) !important; }
        .w-footer .w-foot-col span { border-color: rgba(244,241,234,0.25) !important; color: rgba(244,241,234,0.78); }

        [data-theme="light"] .w-footer { background: #0A1628; }

        .w-foot-top {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr;
          gap: 48px;
          padding-bottom: 56px;
          border-bottom: 1px solid var(--w-line);
        }
        .w-foot-mark {
          font-family: "Noto Serif TC", serif;
          font-weight: 700;
          font-size: 88px;
          line-height: 0.9;
          letter-spacing: -0.04em;
          color: var(--w-text);
          margin: 0;
        }
        .w-foot-mark em { font-style: italic; color: var(--w-accent); font-weight: 600; }
        .w-foot-col h5 {
          font-family: "Inter", sans-serif;
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.22em;
          color: var(--w-text-mute);
          text-transform: uppercase;
          margin: 0 0 16px;
        }
        .w-foot-col ul { list-style: none; padding: 0; margin: 0; }
        .w-foot-col li {
          font-family: "Noto Serif TC", serif;
          font-size: 14px;
          color: var(--w-text-soft);
          padding: 4px 0;
          cursor: pointer;
          transition: color .2s;
        }
        .w-foot-col li:hover { color: var(--w-accent); }
        .w-foot-bot {
          display: flex; justify-content: space-between; align-items: center;
          margin-top: 28px;
          font-family: "JetBrains Mono", monospace;
          font-size: 11px;
          letter-spacing: 0.06em;
          color: var(--w-text-mute);
          text-transform: uppercase;
        }
      `}</style>
      <div className="w-foot-top">
        <div>
          <div className="w-meta" style={{marginBottom: 12}}>★ EST. 2024 · TAIPEI</div>
          <h4 className="w-foot-mark">WORKS<em>.</em></h4>
          <p style={{fontFamily: '"Noto Serif TC", serif', fontSize: 14, color: 'var(--w-text-soft)', maxWidth: 360, lineHeight: 1.7, marginTop: 24}}>
            一場活動，每一秒都被計算。<br/>
            從提案，到收場。
          </p>
        </div>
        <div className="w-foot-col">
          <h5>SITE MAP</h5>
          <ul>
            {D.nav.map(n => <li key={n.id}>{n.zh} / {n.en}</li>)}
          </ul>
        </div>
        <div className="w-foot-col">
          <h5>SERVICES</h5>
          <ul>
            {D.servicePillars.map(p => <li key={p.num}>{p.zh}</li>)}
          </ul>
        </div>
        <div className="w-foot-col">
          <h5>CONTACT</h5>
          <ul>
            <li>hello@works.tw</li>
            <li>02-2311-0000</li>
            <li>{D.brand.address}</li>
          </ul>
          <div style={{marginTop: 18, display: 'flex', gap: 8}}>
            <span style={{padding: '8px 12px', border: '1px solid var(--w-line)', fontFamily: 'Inter', fontSize: 11, letterSpacing: '0.18em'}}>IG</span>
            <span style={{padding: '8px 12px', border: '1px solid var(--w-line)', fontFamily: 'Inter', fontSize: 11, letterSpacing: '0.18em'}}>FB</span>
            <span style={{padding: '8px 12px', border: '1px solid var(--w-line)', fontFamily: 'Inter', fontSize: 11, letterSpacing: '0.18em'}}>LINE</span>
          </div>
        </div>
      </div>
      <div className="w-foot-bot">
        <span>© 2026 WORKS INTERNATIONAL — ALL RIGHTS RESERVED</span>
        <span>統一編號 {D.brand.taxid}</span>
        <span>BUILT WITH ★ IN TAIPEI</span>
      </div>
    </footer>
  );
};

window.WNews = WNews;
window.WContact = WContact;
window.WFooter = WFooter;
