// WORKS — Hero (Spotlight)

const WHero = () => {
  const D = window.WORKS_DATA;
  const [idx, setIdx] = React.useState(0);
  const featured = D.cases.slice(0, 4);

  React.useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % featured.length), 4500);
    return () => clearInterval(t);
  }, []);

  const s = featured[idx];

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
          font-size: clamp(72px, 9vw, 156px);
          line-height: 0.92;
          letter-spacing: -0.025em;
          margin: 0;
          max-width: 1500px;
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
        }
        .w-hero-card:hover { border-color: var(--w-accent); }
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
        .w-hero-dots { display: flex; gap: 6px; margin-top: 16px; }
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
          <span>— 2026 EDITION</span>
        </div>
        <h1>
          光<span className="it">、</span>聲<span className="it">、</span>人<span className="it">、</span><br/>
          一場活動的<br/>
          <span className="y">每一秒</span>都被計算。
        </h1>
      </div>

      <div className="w-hero-foot">
        <div>
          <div className="w-eyebrow" style={{marginBottom: 20}}>FROM PORTFOLIO</div>
          <p className="w-hero-tagline">
            從一張提案簡報到收場那一刻，<br/>
            我們是同一支團隊。
          </p>
        </div>
        <div>
          <div className="w-meta" style={{marginBottom: 12}}>★ FEATURED CASE / {String(idx + 1).padStart(2, '0')} · 0{featured.length}</div>
          <div className="w-hero-card" key={idx}>
            <div className="w-hero-card-num">CASE #{s.num} · {s.year}</div>
            <div className="w-hero-card-zh">{s.zh}</div>
            <div className="w-hero-card-en">{s.en}</div>
            <span className="w-hero-card-cat">{s.cat}</span>
          </div>
          <div className="w-hero-dots">
            {featured.map((_, i) => (
              <div key={i}
                   className={'w-hero-dot' + (i === idx ? ' active' : '')}
                   onClick={() => setIdx(i)} />
            ))}
          </div>
        </div>
        <div className="w-hero-cta">
          <div className="w-hero-cta-lab">START A PROJECT →</div>
          <button className="w-btn"
                  onClick={() => document.getElementById('w-contact')?.scrollIntoView({behavior:'smooth'})}>
            聯絡我們 / CONTACT
          </button>
        </div>
      </div>
    </section>
  );
};

window.WHero = WHero;
