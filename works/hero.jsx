// WORKS — Hero (Spotlight)

const WHero = () => {
  const D = window.WORKS_DATA;
  const [idx, setIdx] = React.useState(0);

  // Use the same effective cases logic as the cases section,
  // so admin edits (overrides/hides/custom cases) flow through.
  const [featured, setFeatured] = React.useState(() => {
    try {
      const customsMap = JSON.parse(localStorage.getItem('works-custom-cases') || '{}')
      const deleted = new Set(JSON.parse(localStorage.getItem('works-deleted-defaults') || '[]'))
      const defaults = (D.cases || []).filter((c) => !deleted.has(c.num))
      const mergedDefaults = defaults.map((c) => customsMap[c.num] ? { ...c, ...customsMap[c.num] } : c)
      const customOnly = Object.entries(customsMap)
        .filter(([num]) => !defaults.some((d) => d.num === num))
        .map(([num, data]) => ({ ...data, num }))
      // Featured = first 4 (custom cases on top, then defaults)
      return [...customOnly, ...mergedDefaults].slice(0, 4)
    } catch { return D.cases.slice(0, 4) }
  })

  React.useEffect(() => {
    const refresh = () => {
      try {
        const customsMap = JSON.parse(localStorage.getItem('works-custom-cases') || '{}')
        const deleted = new Set(JSON.parse(localStorage.getItem('works-deleted-defaults') || '[]'))
        const defaults = (D.cases || []).filter((c) => !deleted.has(c.num))
        const mergedDefaults = defaults.map((c) => customsMap[c.num] ? { ...c, ...customsMap[c.num] } : c)
        const customOnly = Object.entries(customsMap)
          .filter(([num]) => !defaults.some((d) => d.num === num))
          .map(([num, data]) => ({ ...data, num }))
        setFeatured([...customOnly, ...mergedDefaults].slice(0, 4))
      } catch {}
    }
    const onFocus = () => refresh()
    window.addEventListener('focus', onFocus)
    return () => window.removeEventListener('focus', onFocus)
  }, [])

  // Auto-rotate
  React.useEffect(() => {
    if (featured.length === 0) return
    const t = setInterval(() => setIdx(i => (i + 1) % featured.length), 4500)
    return () => clearInterval(t)
  }, [featured.length])

  if (featured.length === 0) {
    return (
      <section id="w-home" className="w-hero">
        <p>目前沒有作品集。請到後台新增。</p>
      </section>
    )
  }

  // Clamp idx if featured shrank (e.g. all cases deleted)
  const safeIdx = idx % featured.length
  const s = featured[safeIdx]
  // Resolve hero image: customs override → default placeholder
  // Use the hero featured set (hero1..hero4) for variety, then case default
  const heroList = window.WORKS_DEFAULT_IMAGES?.hero || []
  const heroImg = s.img || heroList[safeIdx] || window.WORKS_DEFAULT_IMAGES?.cases?.[s.num]

  return (
    <section id="w-home" className="w-hero">
      <style>{`
        .w-hero {
          position: relative;
          min-height: calc(100vh - 80px);
          padding: 80px 64px 64px;
          overflow: hidden;
          display: grid;
          grid-template-rows: 1fr auto;
        }
        .w-hero-bg {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(ellipse 60% 80% at 25% 15%, rgba(232,255,58,0.18), transparent 55%),
            radial-gradient(ellipse 50% 70% at 80% 90%, rgba(232,255,58,0.10), transparent 55%);
          pointer-events: none;
        }
        .w-hero-grain {
          position: absolute; inset: 0;
          background:
            repeating-linear-gradient(135deg, rgba(244,241,234,0.025) 0 8px, transparent 8px 16px);
          pointer-events: none;
        }

        .w-hero-meta {
          position: relative; z-index: 2;
          display: flex; gap: 32px;
          margin-bottom: 56px;
        }
        .w-hero-meta span:first-child { color: var(--w-accent); }
        .w-hero-content {
          position: relative;
          z-index: 2;
          align-self: center;
        }
        .w-hero h1 {
          font-family: "Noto Serif TC", serif;
          font-weight: 600;
          font-size: clamp(40px, 9vw, 156px);
          line-height: 0.95;
          letter-spacing: -0.03em;
          margin: 0;
          max-width: 1500px;
          overflow-wrap: break-word;
          word-break: break-word;
        }
        .w-hero h1 .y { color: var(--w-accent); }
        .w-hero h1 .it { font-style: italic; font-weight: 400; color: var(--w-text-mute); }

        .w-hero-foot {
          position: relative; z-index: 2;
          display: grid;
          grid-template-columns: 1fr 1.2fr 1fr;
          gap: 40px;
          align-items: end;
          padding-top: 56px;
          border-top: 1px solid var(--w-line);
        }
        .w-hero-tagline {
          font-family: "Noto Serif TC", serif;
          font-style: italic;
          font-size: 18px;
          line-height: 1.55;
          color: var(--w-text-soft);
          max-width: 360px;
        }

        .w-hero-card {
          padding: 24px 28px;
          border: 1px solid var(--w-line);
          background: rgba(244,241,234,0.025);
          position: relative;
          transition: border-color .35s;
          overflow: hidden;
        }
        .w-hero-card:hover { border-color: var(--w-accent); }
        .w-hero-card-bg {
          position: absolute; inset: 0;
          background-size: cover; background-position: center;
          opacity: 0.18;
          transition: opacity .4s;
        }
        .w-hero-card:hover .w-hero-card-bg { opacity: 0.28; }
        .w-hero-card-num {
          font-family: "JetBrains Mono", monospace;
          font-size: 10px;
          letter-spacing: 0.2em;
          color: var(--w-accent);
          text-transform: uppercase;
        }
        .w-hero-card-zh {
          font-family: "Noto Serif TC", serif;
          font-weight: 600;
          font-size: 24px;
          margin: 8px 0 4px;
          color: var(--w-text);
        }
        .w-hero-card-en {
          font-family: "Inter", sans-serif;
          font-size: 11px;
          letter-spacing: 0.22em;
          color: var(--w-text-mute);
          text-transform: uppercase;
        }
        .w-hero-card-cat {
          display: inline-block;
          margin-top: 14px;
          padding: 4px 10px;
          background: var(--w-accent);
          color: #0A1628;
          font-family: "Inter", sans-serif;
          font-size: 9px;
          font-weight: 600;
          letter-spacing: 0.2em;
        }
        .w-hero-dots {
          display: flex; gap: 6px;
          margin-top: 16px;
        }
        .w-hero-dot {
          width: 22px; height: 2px;
          background: var(--w-line);
          cursor: pointer;
          transition: background .3s;
        }
        .w-hero-dot.active { background: var(--w-accent); }

        .w-hero-cta {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 14px;
        }
        .w-hero-cta-lab {
          font-family: "JetBrains Mono", monospace;
          font-size: 11px;
          letter-spacing: 0.18em;
          color: var(--w-text-mute);
          text-transform: uppercase;
        }

        /* Side scroll hint */
        .w-hero-side {
          position: absolute;
          left: 24px;
          top: 50%;
          transform: rotate(-90deg) translateX(50%);
          transform-origin: 0 0;
          font-family: "Inter", sans-serif;
          font-size: 10px;
          letter-spacing: 0.36em;
          color: var(--w-text-mute);
          text-transform: uppercase;
          pointer-events: none;
          z-index: 3;
        }
      `}</style>

      <div className="w-hero-bg" />
      <div className="w-hero-grain" />
      <div className="w-hero-side">SCROLL ↓ &nbsp; / &nbsp; EST. 2024 &nbsp; / &nbsp; TAIPEI</div>

      <div className="w-hero-content">
        <div className="w-hero-meta w-mono">
          <span>★ WORKS · 沃克思國際</span>
          <span>EVENT · DESIGN · MARKETING</span>
          <span>— EST. 2024 · TAIPEI</span>
        </div>

        <h1>
          你的<em>線下活動</em><br/>
          <span className="y">神隊友</span>。
        </h1>
      </div>

      <div className="w-hero-foot">
        <div>
          <div className="w-eyebrow" style={{marginBottom: 20}}>FOUR PILLARS</div>
          <p className="w-hero-tagline">
            從精準人力到現場整合，<br/>
            一站完美落地。
          </p>
        </div>

        <div>
          <div className="w-meta" style={{marginBottom: 12}}>★ FEATURED CASE / {String(safeIdx + 1).padStart(2, '0')} · 0{featured.length}</div>
          <div className="w-hero-card" key={safeIdx}>
            {heroImg && <div className="w-hero-card-bg" style={{backgroundImage: `url('${heroImg}')`}} />}
            <div className="w-hero-card-num" style={{position:'relative'}}>CASE #{s.num} · {s.year}</div>
            <div className="w-hero-card-zh" style={{position:'relative'}}>{s.zh}</div>
            <div className="w-hero-card-en" style={{position:'relative'}}>{s.en}</div>
            <span className="w-hero-card-cat" style={{position:'relative'}}>{s.cat}</span>
          </div>
          <div className="w-hero-dots">
            {featured.map((_, i) => (
              <div key={i}
                   className={'w-hero-dot' + (i === safeIdx ? ' active' : '')}
                   onClick={() => setIdx(i)} />
            ))}
          </div>
        </div>

        <div className="w-hero-cta">
          <div className="w-hero-cta-lab">START A PROJECT →</div>
          <button className="w-btn"
                  onClick={() => document.getElementById('w-contact')?.scrollIntoView({behavior:'smooth'})}>
            獲取專案報價 / QUOTE
          </button>
          <button className="w-btn-ghost"
                  onClick={() => document.getElementById('w-case')?.scrollIntoView({behavior:'smooth'})}>
            瀏覽精選實績 / PORTFOLIO
          </button>
        </div>
      </div>
    </section>
  );
};

window.WHero = WHero;
