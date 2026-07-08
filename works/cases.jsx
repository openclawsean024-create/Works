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
            <article key={c.num} className="w-case">
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
    </section>
  );
};

window.WCases = WCases;
