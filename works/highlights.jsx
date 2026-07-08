// WORKS — Highlights (PDF 區塊 2：核心專長 — 4 大關鍵)

const WHighlights = () => {
  const D = window.WORKS_DATA;
  const hlMap = window.WORKS_DEFAULT_IMAGES?.highlights || {}
  const refs = React.useRef([])
  React.useEffect(() => {
    D.highlights.forEach((h, i) => {
      const el = refs.current[i]
      if (!el) return
      const url = hlMap[h.num] || hlMap['H' + h.num] || hlMap['H0' + h.num]
      if (url) {
        el.style.position = 'absolute'
        el.style.inset = '0'
        el.style.backgroundImage = `url('${url}')`
        el.style.backgroundSize = 'cover'
        el.style.backgroundPosition = 'center'
        el.style.opacity = '0.35'
        el.style.zIndex = '0'
        el.style.filter = 'grayscale(0.4) contrast(1.15) brightness(0.9)'
        el.style.pointerEvents = 'none'
      }
    })
  }, [])
  return (
    <section id="w-highlights" className="w-section" style={{background: 'var(--w-ink-2)'}}>
      <style>{`
        .w-hl-head {
          display: grid;
          grid-template-columns: 1fr 1.4fr;
          gap: 64px;
          align-items: end;
          padding-bottom: 56px;
          border-bottom: 1px solid var(--w-line);
          margin-bottom: 64px;
        }
        .w-hl-head h2 {
          font-family: "Noto Serif TC", serif;
          font-weight: 600;
          font-size: 88px;
          line-height: 0.96;
          letter-spacing: -0.02em;
          margin: 0;
        }
        .w-hl-head h2 em {
          font-style: italic;
          color: var(--w-accent);
          font-weight: 500;
        }
        .w-hl-head .right {
          font-family: "Noto Serif TC", serif;
          font-size: 16px;
          line-height: 1.85;
          color: var(--w-text-soft);
        }
        .w-hl-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0;
          border-top: 1px solid var(--w-line);
        }
        .w-hl-card {
          padding: 48px 40px;
          border-right: 1px solid var(--w-line);
          border-bottom: 1px solid var(--w-line);
          position: relative;
          transition: background .35s;
          cursor: pointer;
        }
        .w-hl-card:nth-child(2n) { border-right: none; }
        .w-hl-card:hover { background: rgba(224,87,32,0.06); }
        .w-hl-card:hover .w-hl-num { color: var(--w-accent); }
        .w-hl-card:hover .w-hl-tags span { border-color: var(--w-accent); color: var(--w-accent); }
        .w-hl-num {
          font-family: "JetBrains Mono", monospace;
          font-size: 13px;
          letter-spacing: 0.2em;
          color: var(--w-text-mute);
          margin-bottom: 32px;
          transition: color .3s;
        }
        .w-hl-zh {
          font-family: "Noto Serif TC", serif;
          font-weight: 600;
          font-size: 38px;
          line-height: 1.15;
          margin: 0 0 8px;
          letter-spacing: 0.005em;
        }
        .w-hl-en {
          font-family: "Inter", sans-serif;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.22em;
          color: var(--w-accent-2);
          text-transform: uppercase;
          margin-bottom: 24px;
        }
        .w-hl-desc {
          font-family: "Noto Serif TC", serif;
          font-size: 16px;
          line-height: 1.85;
          color: var(--w-text-soft);
          margin: 0 0 32px;
        }
        .w-hl-tags {
          display: flex; flex-wrap: wrap; gap: 8px;
        }
        .w-hl-tags span {
          font-family: "Inter", sans-serif;
          font-size: 13px;
          padding: 8px 14px;
          border: 1px solid var(--w-line);
          color: var(--w-text-soft);
          letter-spacing: 0.04em;
          transition: border-color .3s, color .3s;
        }

        /* === MOBILE === */
        @media (max-width: 768px) {
          .w-hl-head {
            grid-template-columns: 1fr;
            gap: 20px;
            padding-bottom: 32px;
            margin-bottom: 32px;
          }
          .w-hl-head h2 { font-size: 42px; }
          .w-hl-head .right { font-size: 16px; line-height: 1.7; }

          .w-hl-grid { grid-template-columns: 1fr; }
          .w-hl-card {
            padding: 32px 24px;
            border-right: none;
          }
          .w-hl-card:nth-child(2n) { border-right: none; }
          .w-hl-num { font-size: 13px; margin-bottom: 16px; }
          .w-hl-zh { font-size: 30px; line-height: 1.2; margin-bottom: 10px; }
          .w-hl-en { font-size: 13px; letter-spacing: 0.18em; margin-bottom: 18px; }
          .w-hl-desc { font-size: 16px; line-height: 1.75; margin-bottom: 24px; }
          .w-hl-tags { gap: 8px; }
          .w-hl-tags span { font-size: 14px; padding: 8px 14px; }
        }
        @media (max-width: 480px) {
          .w-hl-head h2 { font-size: 36px; }
          .w-hl-card { padding: 28px 20px; }
          .w-hl-zh { font-size: 26px; }
          .w-hl-en { font-size: 12px; }
          .w-hl-tags span { font-size: 13px; padding: 7px 12px; }
        }
      `}</style>

      <div className="w-hl-head">
        <div>
          <div className="w-eyebrow" style={{marginBottom: 24}}>FOUR PILLARS · 核心專長</div>
          <h2>
            將<em>創意</em>完美<br/>
            落地的<em>四大關鍵</em>。
          </h2>
        </div>
        <div className="right">
          專注高壓大型展會、高端品牌公關與專業派遣。解決現場繁瑣細節，讓創意零落差呈現。
        </div>
      </div>

      <div className="w-hl-grid">
        {D.highlights.map((h, i) => (
          <article key={h.num} className="w-hl-card">
            <div className="w-hl-card-bg" ref={el => refs.current[i] = el} />
            <div className="w-hl-num">— PILLAR / {h.num} —</div>
            <h3 className="w-hl-zh">{h.zh}</h3>
            <div className="w-hl-en">{h.en}</div>
            <p className="w-hl-desc">{h.desc}</p>
            <div className="w-hl-tags">
              {h.tags.map(t => <span key={t}>{t}</span>)}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

window.WHighlights = WHighlights;
