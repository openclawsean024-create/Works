// WORKS — Cases (filterable grid) — Lazy load images via IntersectionObserver

const WCases = () => {
  const D = window.WORKS_DATA;
  const [filter, setFilter] = React.useState('ALL');

  // Merge data.jsx defaults with localStorage custom cases.
  // Customs are stored as a map { num: data } so editing a default
  // case overrides it (by num) instead of duplicating.
  // (admin-app.jsx writes to these keys; keep logic in sync)
  const getEffectiveCases = () => {
    let customsMap = {};
    let deleted = [];
    try { customsMap = JSON.parse(localStorage.getItem('works-custom-cases') || '{}') } catch {}
    try { deleted = JSON.parse(localStorage.getItem('works-deleted-defaults') || '[]') } catch {}
    const deletedSet = new Set(deleted);
    const defaults = (D.cases || []).filter((c) => !deletedSet.has(c.num));
    const mergedDefaults = defaults.map((c) => customsMap[c.num] ? { ...c, ...customsMap[c.num] } : c);
    const customOnly = Object.entries(customsMap)
      .filter(([num]) => !defaults.some((d) => d.num === num))
      .map(([num, data]) => ({ ...data, num }));
    return [...customOnly, ...mergedDefaults];
  };

  const cats = ['ALL', 'BRAND', 'CAMPUS', 'CONCERT', 'EVENT', 'AUCTION'];
  const [cases, setCases] = React.useState(getEffectiveCases());
  const [activeCase, setActiveCase] = React.useState(null) // modal state

  // Close modal on ESC + lock body scroll when open
  React.useEffect(() => {
    if (!activeCase) return
    const onKey = (e) => { if (e.key === 'Escape') setActiveCase(null) }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = '' }
  }, [activeCase])

  // Lazy-load background images with IntersectionObserver
  const imgRefs = React.useRef([]);
  React.useEffect(() => {
    if (!('IntersectionObserver' in window)) {
      // Fallback: load all immediately
      imgRefs.current.forEach(el => { if (el && el.dataset.bg) el.style.backgroundImage = `url('${el.dataset.bg}')` })
      return
    }
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const el = e.target
          if (el.dataset.bg) el.style.backgroundImage = `url('${el.dataset.bg}')`
          obs.unobserve(el)
        }
      })
    }, { rootMargin: '200px' })
    imgRefs.current.forEach(el => { if (el) obs.observe(el) })
    return () => obs.disconnect()
  }, [cases, filter])

  // Re-read on focus (in case admin wrote to localStorage in another tab)
  React.useEffect(() => {
    const onFocus = () => setCases(getEffectiveCases());
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, []);

  const list = filter === 'ALL' ? cases : cases.filter(c => c.cat === filter);

  return (
    <section id="w-case" className="w-section" style={{background: 'var(--w-ink)'}}>
      <style>{`
        .w-case-tools {
          display: flex; justify-content: space-between; align-items: end;
          margin-bottom: 40px;
          flex-wrap: wrap;
          gap: 24px;
        }
        .w-case-filters {
          display: flex; gap: 8px; flex-wrap: wrap;
        }
        .w-case-filter {
          padding: 10px 16px;
          background: transparent;
          border: 1px solid var(--w-line);
          color: var(--w-text-soft);
          font-family: "Inter", sans-serif;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all .25s;
        }
        .w-case-filter:hover { border-color: var(--w-text); color: var(--w-text); }
        .w-case-filter.active {
          background: var(--w-accent);
          color: #0A1628;
          border-color: var(--w-accent);
        }

        .w-case-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 24px;
        }
        .w-case {
          position: relative;
          background: var(--w-ink-2);
          border: 1px solid var(--w-line);
          overflow: hidden;
          aspect-ratio: 4/5;
          cursor: pointer;
          transition: transform .4s cubic-bezier(.2,.7,.2,1), border-color .25s;
        }
        .w-case:hover { transform: translateY(-6px); border-color: var(--w-accent); }
        .w-case:hover .w-case-img { transform: scale(1.04); }
        .w-case:hover .w-case-overlay { opacity: 1; }
        .w-case-img {
          position: absolute; inset: 0;
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          transition: transform .6s cubic-bezier(.2,.7,.2,1);
          display: flex; align-items: center; justify-content: center;
        }
        .w-case-img.no-photo {
          background-image: repeating-linear-gradient(135deg, rgba(244,241,234,0.05) 0 8px, rgba(244,241,234,0.01) 8px 16px);
          background-color: var(--w-ink-3);
        }
        .w-case-img-tag {
          font-family: "JetBrains Mono", monospace;
          font-size: 10px;
          letter-spacing: 0.18em;
          color: var(--w-text-mute);
          padding: 4px 10px;
          border: 1px solid var(--w-line);
          text-transform: uppercase;
        }
        .w-case-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, transparent 30%, rgba(10,22,40,0.92) 100%);
          opacity: 0.85;
          transition: opacity .3s;
        }
        .w-case-content {
          position: absolute;
          inset: 0;
          padding: 24px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        .w-case-top {
          display: flex; justify-content: space-between; align-items: start;
        }
        .w-case-num {
          font-family: "JetBrains Mono", monospace;
          font-size: 10px;
          letter-spacing: 0.16em;
          color: var(--w-accent);
          background: rgba(10,22,40,0.7);
          padding: 4px 8px;
          backdrop-filter: blur(8px);
        }
        .w-case-cat {
          font-family: "Inter", sans-serif;
          font-size: 9px;
          font-weight: 600;
          letter-spacing: 0.22em;
          padding: 4px 10px;
          background: var(--w-accent);
          color: #0A1628;
        }
        .w-case-bot { z-index: 2; }
        .w-case-zh {
          font-family: "Noto Serif TC", serif;
          font-weight: 600;
          font-size: 22px;
          line-height: 1.3;
          color: var(--w-text);
          margin: 0 0 6px;
        }
        .w-case-en {
          font-family: "Inter", sans-serif;
          font-size: 10px;
          letter-spacing: 0.2em;
          color: var(--w-text-mute);
          text-transform: uppercase;
        }

        /* === Case detail modal/lightbox === */
        .w-case-modal {
          position: fixed; inset: 0;
          background: rgba(0,0,0,0.92);
          backdrop-filter: blur(8px);
          z-index: 999;
          display: flex; align-items: center; justify-content: center;
          padding: 24px;
          animation: w-modal-in .25s ease-out;
        }
        @keyframes w-modal-in {
          from { opacity: 0; transform: scale(0.96); }
          to   { opacity: 1; transform: scale(1); }
        }
        .w-case-modal-box {
          position: relative;
          max-width: 920px; width: 100%;
          max-height: 90vh;
          background: var(--w-ink-2);
          border: 1px solid var(--w-line);
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          overflow: hidden;
          animation: w-modal-pop .35s cubic-bezier(.2,.7,.2,1);
        }
        @keyframes w-modal-pop {
          from { transform: translateY(20px); opacity: 0; }
          to   { transform: translateY(0); opacity: 1; }
        }
        .w-case-modal-close {
          position: absolute; top: 12px; right: 12px;
          width: 36px; height: 36px;
          background: rgba(0,0,0,0.7); color: var(--w-text);
          border: 1px solid var(--w-line);
          font-size: 16px; cursor: pointer;
          z-index: 2;
          display: flex; align-items: center; justify-content: center;
          transition: background .2s, border-color .2s;
        }
        .w-case-modal-close:hover { background: var(--w-accent); color: #0A1628; border-color: var(--w-accent); }
        .w-case-modal-img {
          background-size: cover;
          background-position: center;
          background-color: var(--w-ink-3);
          min-height: 400px;
        }
        .w-case-modal-body {
          padding: 36px 32px;
          display: flex; flex-direction: column;
          gap: 16px;
          overflow-y: auto;
        }
        .w-case-modal-meta {
          display: flex; align-items: center; gap: 10px;
          font-family: "JetBrains Mono", monospace;
          font-size: 11px; letter-spacing: 0.16em;
        }
        .w-case-modal-meta .w-case-year { color: var(--w-text-mute); }
        .w-case-modal-zh {
          font-family: "Noto Serif TC", serif;
          font-weight: 600;
          font-size: 32px; line-height: 1.2;
          margin: 0;
        }
        .w-case-modal-en {
          font-family: "Inter", sans-serif;
          font-size: 12px; letter-spacing: 0.2em;
          color: var(--w-text-mute);
          text-transform: uppercase;
        }
        .w-case-modal-tags {
          display: flex; flex-wrap: wrap; gap: 8px;
          margin-top: 8px;
        }
        .w-case-modal-tags span {
          font-family: "Inter", sans-serif;
          font-size: 12px; padding: 6px 12px;
          border: 1px solid var(--w-line);
          color: var(--w-accent);
          letter-spacing: 0.04em;
        }
        .w-case-modal-hint {
          font-family: "JetBrains Mono", monospace;
          font-size: 10px; letter-spacing: 0.18em;
          color: var(--w-text-mute);
          margin: auto 0 0;
          text-transform: uppercase;
        }
        @media (max-width: 768px) {
          .w-case-modal-box { grid-template-columns: 1fr !important; max-height: 95vh !important; }
          .w-case-modal-img { min-height: 240px !important; }
          .w-case-modal-body { padding: 24px 20px !important; }
          .w-case-modal-zh { font-size: 24px !important; }
        }
      `}</style>

      <div className="w-section-head">
        <div>
          <div className="w-eyebrow" style={{marginBottom: 24}}>CASE · 歷年案例</div>
          <h2>
            <em>作品集</em>，<br/>不說也行。
          </h2>
        </div>
        <div className="right">
          從 DCARD 校園到中華電信燈節，從 Super Junior 周年快閃到藝術品拍賣會 — 每一場活動都是一次完整的演出。以下是部分代表案例。
        </div>
      </div>

      <div className="w-case-tools">
        <div className="w-case-filters">
          {cats.map(c => (
            <button key={c}
                    className={'w-case-filter' + (filter === c ? ' active' : '')}
                    onClick={() => setFilter(c)}>
              {c}
            </button>
          ))}
        </div>
        <div className="w-meta">[ {String(list.length).padStart(2, '0')} OF {String(cases.length).padStart(2, '0')} ]</div>
      </div>

      <div className="w-case-grid">
        {list.map((c, i) => {
          // Resolve image: customs override → default placeholder
          const img = c.img || (window.WORKS_DEFAULT_IMAGES?.cases?.[c.num])
          return (
            <article key={c.num} className="w-case" onClick={() => setActiveCase(c)}>
              <div
                ref={el => imgRefs.current[i] = el}
                data-bg={img || ''}
                className={'w-case-img' + (img ? '' : ' no-photo')}
              >
                {!img && <span className="w-case-img-tag">{c.cat} · {c.year}</span>}
              </div>
              <div className="w-case-overlay" />
              <div className="w-case-content">
                <div className="w-case-top">
                  <span className="w-case-num">#{c.num}</span>
                  <span className="w-case-cat">{c.cat}</span>
                </div>
                <div className="w-case-bot">
                  <h3 className="w-case-zh">{c.zh}</h3>
                  <div className="w-case-en">{c.en} · {c.year}</div>
                </div>
              </div>
            </article>
          )
        })}
      </div>

      {activeCase && (() => {
        const mImg = activeCase.img || window.WORKS_DEFAULT_IMAGES?.cases?.[activeCase.num]
        return (
          <div className="w-case-modal" onClick={() => setActiveCase(null)}>
            <div className="w-case-modal-box" onClick={e => e.stopPropagation()}>
              <button className="w-case-modal-close" onClick={() => setActiveCase(null)} aria-label="關閉">✕</button>
              <div className="w-case-modal-img" style={mImg ? {backgroundImage: `url('${mImg}')`} : {}} />
              <div className="w-case-modal-body">
                <div className="w-case-modal-meta">
                  <span className="w-case-num">#{activeCase.num}</span>
                  <span className="w-case-cat">{activeCase.cat}</span>
                  <span className="w-case-year">· {activeCase.year}</span>
                </div>
                <h3 className="w-case-modal-zh">{activeCase.zh}</h3>
                <div className="w-case-modal-en">{activeCase.en}</div>
                {activeCase.tags && activeCase.tags.length > 0 && (
                  <div className="w-case-modal-tags">
                    {activeCase.tags.map(t => <span key={t}>{t}</span>)}
                  </div>
                )}
                <p className="w-case-modal-hint">ESC 或點外部關閉</p>
              </div>
            </div>
          </div>
        )
      })()}
    </section>
  );
};

window.WCases = WCases;
