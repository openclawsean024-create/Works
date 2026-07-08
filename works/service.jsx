// WORKS — Service section (4 pillars + 7 services grid)

const WService = () => {
  const D = window.WORKS_DATA;
  const [tab, setTab] = React.useState('pillars'); // pillars | seven

  return (
    <section id="w-service" className="w-section">
      <style>{`
        .w-svc-tabs {
          display: flex; gap: 0;
          margin-bottom: 56px;
          border-top: 1px solid var(--w-line);
          border-bottom: 1px solid var(--w-line);
        }
        .w-svc-tab {
          flex: 1;
          padding: 24px 28px;
          background: transparent;
          border: none;
          border-right: 1px solid var(--w-line);
          font-family: "Inter", sans-serif;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.22em;
          color: var(--w-text-mute);
          cursor: pointer;
          text-align: left;
          text-transform: uppercase;
          position: relative;
          transition: color .25s, background .25s;
        }
        .w-svc-tab:last-child { border-right: none; }
        .w-svc-tab:hover { color: var(--w-text); }
        .w-svc-tab.active { color: var(--w-text); background: rgba(232,255,58,0.04); }
        .w-svc-tab.active::before {
          content: '';
          position: absolute; top: -1px; left: 0; right: 0; height: 2px;
          background: var(--w-accent);
        }
        .w-svc-tab strong {
          display: block;
          font-family: "Noto Serif TC", serif;
          font-weight: 600;
          font-size: 26px;
          color: inherit;
          letter-spacing: 0;
          margin-top: 6px;
          text-transform: none;
        }

        /* Pillars */
        .w-pillars {
          display: grid;
          grid-template-columns: 1fr;
        }
        .w-pillar {
          display: grid;
          grid-template-columns: 100px 1.4fr 2fr 90px;
          gap: 40px;
          padding: 36px 0;
          border-bottom: 1px solid var(--w-line);
          align-items: start;
          cursor: pointer;
          transition: padding .35s, background .35s;
        }
        .w-pillar:hover {
          padding-left: 16px;
          background: rgba(232,255,58,0.04);
        }
        .w-pillar:hover .w-pillar-zh { color: var(--w-accent); }
        .w-pillar:hover .w-pillar-arrow { background: var(--w-accent); color: #0A1628; transform: translateX(8px); }
        .w-pillar-num {
          font-family: "JetBrains Mono", monospace;
          font-size: 13px;
          letter-spacing: 0.12em;
          color: var(--w-text-mute);
          padding-top: 12px;
        }
        .w-pillar-zh {
          font-family: "Noto Serif TC", serif;
          font-weight: 600;
          font-size: 44px;
          line-height: 1.05;
          margin: 0 0 6px;
          letter-spacing: 0.02em;
          transition: color .3s;
        }
        .w-pillar-en {
          font-family: "Inter", sans-serif;
          font-size: 11px;
          font-weight: 300;
          letter-spacing: 0.22em;
          color: var(--w-text-mute);
          text-transform: uppercase;
        }
        .w-pillar-sub {
          padding-top: 14px;
          display: flex; flex-wrap: wrap; gap: 6px;
        }
        .w-pillar-sub span {
          font-family: "Inter", sans-serif;
          font-size: 11px;
          padding: 5px 12px;
          border: 1px solid var(--w-line);
          color: var(--w-text-soft);
          letter-spacing: 0.04em;
        }
        .w-pillar-arrow {
          justify-self: end;
          width: 44px; height: 44px;
          border: 1.5px solid var(--w-text);
          color: var(--w-text);
          display: flex; align-items: center; justify-content: center;
          font-family: "Inter", sans-serif;
          transition: all .35s cubic-bezier(.2,.7,.2,1);
        }

        /* Seven */
        .w-seven {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0;
        }
        .w-svc7 {
          padding: 32px 24px;
          border-right: 1px solid var(--w-line);
          border-bottom: 1px solid var(--w-line);
          min-height: 240px;
          display: flex;
          flex-direction: column;
          cursor: pointer;
          transition: background .3s;
          position: relative;
        }
        .w-svc7:hover { background: rgba(232,255,58,0.06); }
        .w-svc7:hover .w-svc7-zh::after { width: 100%; }
        .w-svc7:nth-child(4n) { border-right: none; }
        .w-svc7-num {
          font-family: "JetBrains Mono", monospace;
          font-size: 10px;
          letter-spacing: 0.18em;
          color: var(--w-text-mute);
          margin-bottom: 24px;
        }
        .w-svc7-zh {
          font-family: "Noto Serif TC", serif;
          font-weight: 600;
          font-size: 26px;
          letter-spacing: 0.02em;
          margin: 0 0 4px;
          position: relative;
          display: inline-block;
        }
        .w-svc7-zh::after {
          content: '';
          position: absolute;
          bottom: -3px; left: 0;
          width: 20px; height: 2px;
          background: var(--w-accent);
          transition: width .4s cubic-bezier(.2,.7,.2,1);
        }
        .w-svc7-en {
          font-family: "Inter", sans-serif;
          font-size: 10px;
          letter-spacing: 0.2em;
          color: var(--w-text-mute);
          text-transform: uppercase;
          margin-top: 12px;
        }
        .w-svc7-kw {
          margin-top: auto;
          padding-top: 20px;
          display: flex; flex-wrap: wrap; gap: 5px;
        }
        .w-svc7-kw span {
          font-family: "Inter", sans-serif;
          font-size: 10px;
          padding: 3px 8px;
          border: 1px solid var(--w-line);
          color: var(--w-text-soft);
        }

        /* === MOBILE RESPONSIVE === */
        @media (max-width: 768px) {
          .w-svc-tabs {
            flex-direction: column;
            margin-bottom: 32px;
          }
          .w-svc-tab {
            border-right: none;
            border-bottom: 1px solid var(--w-line);
            padding: 18px 20px;
          }
          .w-svc-tab strong { font-size: 20px; margin-top: 4px; }

          /* Pillar 4-col → 1-col stack */
          .w-pillar {
            grid-template-columns: 1fr;
            gap: 16px;
            padding: 28px 0;
          }
          .w-pillar-num { padding-top: 0; }
          .w-pillar-zh { font-size: 32px; }
          .w-pillar-sub {
            padding-top: 4px;
            gap: 8px;
          }
          .w-pillar-sub span {
            font-size: 12px;
            padding: 6px 14px;
          }
          .w-pillar-arrow {
            justify-self: start;
            width: 36px; height: 36px;
            font-size: 14px;
          }

          /* Seven 4-col → 2-col */
          .w-seven {
            grid-template-columns: repeat(2, 1fr);
          }
          .w-svc7 { padding: 24px 18px; min-height: 200px; }
          .w-svc7:nth-child(4n) { border-right: 1px solid var(--w-line); }
          .w-svc7:nth-child(2n) { border-right: none; }
          .w-svc7-zh { font-size: 20px; }
        }
        @media (max-width: 480px) {
          .w-svc-tab strong { font-size: 18px; }
          .w-pillar-zh { font-size: 26px; }
          .w-pillar-sub span { font-size: 11px; padding: 5px 12px; }
          .w-seven { grid-template-columns: 1fr; }
          .w-svc7 { min-height: 160px; padding: 20px 16px; }
          .w-svc7:nth-child(n) { border-right: none; }
        }
      `}</style>

      <div className="w-section-head">
        <div>
          <div className="w-eyebrow" style={{marginBottom: 24}}>SERVICE · 服務介紹</div>
          <h2>
            四大領域，<br/>
            <em>七大服務。</em>
          </h2>
        </div>
        <div className="right">
          沃克思以「四大領域」為核心 — 活動企劃、視覺設計、展會規劃、整合行銷。下游延伸到「七大專業服務」，從人力、硬體到舞台燈光，皆能一條龍執行。
        </div>
      </div>

      <div className="w-svc-tabs">
        <button className={'w-svc-tab' + (tab === 'pillars' ? ' active' : '')} onClick={() => setTab('pillars')}>
          A · CORE PILLARS
          <strong>四大領域</strong>
        </button>
        <button className={'w-svc-tab' + (tab === 'seven' ? ' active' : '')} onClick={() => setTab('seven')}>
          B · SEVEN DISCIPLINES
          <strong>七大專業服務</strong>
        </button>
      </div>

      {tab === 'pillars' && (
        <div className="w-pillars">
          {D.servicePillars.map(p => (
            <div key={p.num} className="w-pillar">
              <span className="w-pillar-num">— {p.num} —</span>
              <div>
                <h3 className="w-pillar-zh">{p.zh}</h3>
                <div className="w-pillar-en">{p.en}</div>
              </div>
              <div className="w-pillar-sub">
                {p.sub.map(s => <span key={s}>{s}</span>)}
              </div>
              <div className="w-pillar-arrow">→</div>
            </div>
          ))}
        </div>
      )}

      {tab === 'seven' && (
        <div className="w-seven">
          {D.serviceSeven.map(s => (
            <div key={s.num} className="w-svc7">
              <div className="w-svc7-num">SERVICE / {s.num}</div>
              <h3 className="w-svc7-zh">{s.zh}</h3>
              <div className="w-svc7-en">{s.en}</div>
              <div className="w-svc7-kw">
                {s.kw.map(k => <span key={k}>{k}</span>)}
              </div>
            </div>
          ))}
          {/* Quote cell */}
          <div className="w-svc7" style={{cursor: 'default', background: 'rgba(232,255,58,0.04)', display: 'flex', alignItems: 'flex-end'}}>
            <div>
              <div style={{fontFamily: 'Noto Serif TC, serif', fontStyle: 'italic', fontSize: 20, lineHeight: 1.4, color: 'var(--w-accent)'}}>
                「細節，是<br/>沃克思唯一<br/>不打折的東西。」
              </div>
              <div className="w-meta" style={{marginTop: 24}}>— FOUNDER'S NOTE</div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

window.WService = WService;
