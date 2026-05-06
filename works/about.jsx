// WORKS — About + Stats + Competencies + Marquee Clients

const WAbout = () => {
  const D = window.WORKS_DATA;
  return (
    <section id="w-about" className="w-section">
      <style>{`
        .w-about-grid {
          display: grid;
          grid-template-columns: 5fr 7fr;
          gap: 72px;
          align-items: start;
        }
        .w-about-img {
          aspect-ratio: 4/5;
          width: 100%;
          position: relative;
        }
        .w-about-img-tag {
          position: absolute;
          top: 16px; left: 16px;
          font-family: "JetBrains Mono", monospace;
          font-size: 10px;
          letter-spacing: 0.18em;
          padding: 6px 10px;
          background: var(--w-accent);
          color: #0A1628;
          text-transform: uppercase;
        }
        .w-about-text h3 {
          font-family: "Noto Serif TC", serif;
          font-weight: 600;
          font-size: 56px;
          line-height: 1.05;
          letter-spacing: -0.01em;
          margin: 0 0 32px;
        }
        .w-about-text h3 em { font-style: italic; color: var(--w-accent); font-weight: 500; }
        .w-about-text p {
          font-family: "Noto Serif TC", serif;
          font-size: 17px;
          line-height: 1.85;
          color: var(--w-text-soft);
          margin: 0 0 24px;
        }
        .w-about-text p::first-letter {
          font-size: 56px;
          float: left;
          font-weight: 600;
          line-height: 0.9;
          color: var(--w-accent);
          padding: 6px 10px 0 0;
        }
        .w-about-text p + p::first-letter { font-size: inherit; float: none; padding: 0; color: inherit; font-weight: inherit; line-height: inherit; }

        .w-info {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px 32px;
          margin-top: 40px;
          padding-top: 32px;
          border-top: 1px solid var(--w-line);
          font-family: "JetBrains Mono", monospace;
          font-size: 11px;
          letter-spacing: 0.06em;
          color: var(--w-text-soft);
          text-transform: uppercase;
        }
        .w-info dt { color: var(--w-text-mute); }
        .w-info dd { margin: 0; color: var(--w-text); }

        .w-stats-row {
          margin-top: 96px;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          border-top: 1px solid var(--w-line);
          border-bottom: 1px solid var(--w-line);
        }
        .w-stat {
          padding: 32px 24px;
          border-right: 1px solid var(--w-line);
        }
        .w-stat:last-child { border-right: none; }
        .w-stat .n {
          font-family: "Noto Serif TC", serif;
          font-weight: 600;
          font-size: 64px;
          line-height: 0.95;
          color: var(--w-accent);
          letter-spacing: -0.02em;
        }
        .w-stat .l {
          font-family: "Noto Serif TC", serif;
          font-size: 16px;
          margin-top: 12px;
          color: var(--w-text);
        }
        .w-stat .l small {
          display: block;
          font-family: "Inter", sans-serif;
          font-size: 9px;
          letter-spacing: 0.28em;
          color: var(--w-text-mute);
          margin-top: 4px;
          text-transform: uppercase;
        }
      `}</style>

      <div className="w-section-head">
        <div>
          <div className="w-eyebrow" style={{marginBottom: 24}}>ABOUT · 關於我們</div>
          <h2>
            從<em>提案</em>，<br/>
            到收場。
          </h2>
        </div>
        <div className="right">
          沃克思國際 (WORKS) 是一支結合活動企劃、視覺設計與整合行銷的團隊。我們相信好的活動不只是「被執行」，更是「被設計」——從紙面延伸到現場的每一個細節，都應該說同一個故事。
        </div>
      </div>

      <div className="w-about-grid">
        <div className="w-ph w-about-img">
          <span className="w-about-img-tag">★ TEAM 沃克思 / 2025</span>
          <span className="tag">PORTRAIT 720×900</span>
        </div>

        <div className="w-about-text">
          <h3>我們做活動，<br/>但更像在做<em>一本書。</em></h3>
          <p>
            一場活動是有節奏的——進場、暖身、高潮、餘韻。我們把每一個環節都當作章節去設計：視覺先行、空間結構、人流動線、現場互動，最後是收場那一刻觀眾帶走的記憶。
          </p>
          <p>
            自 2024 年成立以來，沃克思已陪伴 DCARD、Foodpanda、中華電信、VOLVO、安麗等品牌完成校園、商業與通路活動。我們的核心是設計與執行同源——in-house 的平面、3D、空間設計團隊，讓視覺一致性從紙本延續到現場。
          </p>

          <dl className="w-info">
            <dt>公司名稱</dt><dd>{D.brand.full}</dd>
            <dt>英文名</dt><dd>{D.brand.fullEn}</dd>
            <dt>負責人</dt><dd>{D.brand.rep} / {D.brand.repTitle}</dd>
            <dt>統一編號</dt><dd>{D.brand.taxid}</dd>
            <dt>設立日期</dt><dd>2024.02.17</dd>
            <dt>所在地</dt><dd>臺北市中正區</dd>
          </dl>
        </div>
      </div>

      <div className="w-stats-row">
        {D.stats.map(s => (
          <div key={s.l} className="w-stat">
            <div className="n">{s.n}</div>
            <div className="l">{s.l}<small>{s.en}</small></div>
          </div>
        ))}
      </div>
    </section>
  );
};

const WCompetencies = () => {
  const D = window.WORKS_DATA;
  return (
    <section className="w-section" style={{paddingTop: 80, paddingBottom: 80, background: 'var(--w-ink-2)'}}>
      <style>{`
        .w-comp-head {
          display: flex; justify-content: space-between; align-items: end;
          margin-bottom: 56px;
          padding-bottom: 24px;
          border-bottom: 1px solid var(--w-line);
        }
        .w-comp-head h3 {
          font-family: "Noto Serif TC", serif;
          font-weight: 600;
          font-size: 48px;
          margin: 0;
          letter-spacing: -0.01em;
        }
        .w-comp-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0;
        }
        .w-comp {
          padding: 36px 28px 28px;
          border-right: 1px solid var(--w-line);
          position: relative;
          transition: background .3s;
        }
        .w-comp:hover { background: rgba(232,255,58,0.04); }
        .w-comp:hover .w-comp-num { color: var(--w-accent); }
        .w-comp:last-child { border-right: none; }
        .w-comp-num {
          font-family: "JetBrains Mono", monospace;
          font-size: 11px;
          letter-spacing: 0.2em;
          color: var(--w-text-mute);
          margin-bottom: 28px;
          transition: color .3s;
        }
        .w-comp-zh {
          font-family: "Noto Serif TC", serif;
          font-weight: 600;
          font-size: 28px;
          line-height: 1.25;
          margin: 0 0 6px;
        }
        .w-comp-en {
          font-family: "Inter", sans-serif;
          font-size: 10px;
          letter-spacing: 0.22em;
          color: var(--w-text-mute);
          text-transform: uppercase;
          margin-bottom: 20px;
        }
        .w-comp-desc {
          font-family: "Noto Serif TC", serif;
          font-size: 14px;
          line-height: 1.75;
          color: var(--w-text-soft);
        }
      `}</style>

      <div className="w-comp-head">
        <h3>服務競爭力 / Why WORKS</h3>
        <div className="w-meta">[ 04 STRENGTHS ]</div>
      </div>

      <div className="w-comp-grid">
        {D.competencies.map(c => (
          <div key={c.num} className="w-comp">
            <div className="w-comp-num">— {c.num} —</div>
            <h4 className="w-comp-zh">{c.zh}</h4>
            <div className="w-comp-en">{c.en}</div>
            <p className="w-comp-desc">{c.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

const WClientsMarquee = () => {
  const D = window.WORKS_DATA;
  const list = [...D.clients, ...D.clients];
  return (
    <section style={{padding: '64px 0', borderTop: '1px solid var(--w-line)', borderBottom: '1px solid var(--w-line)', overflow: 'hidden', background: 'var(--w-ink)'}}>
      <style>{`
        .w-marq-lab {
          padding: 0 64px 24px;
          display: flex; justify-content: space-between;
          font-family: "JetBrains Mono", monospace;
          font-size: 11px;
          letter-spacing: 0.18em;
          color: var(--w-text-mute);
          text-transform: uppercase;
        }
        .w-marq-track {
          display: flex; gap: 80px;
          animation: w-marquee 50s linear infinite;
          white-space: nowrap;
          font-family: "Noto Serif TC", serif;
          font-weight: 600;
          font-size: 64px;
          letter-spacing: 0.04em;
        }
        .w-marq-track .dot { color: var(--w-accent); margin: 0 8px; }
      `}</style>
      <div className="w-marq-lab">
        <span>★ TRUSTED BY / 合作夥伴</span>
        <span>{D.clients.length}+ BRANDS</span>
      </div>
      <div className="w-marq-track">
        {list.map((c, i) => (
          <React.Fragment key={i}>
            <span>{c}</span>
            <span className="dot">★</span>
          </React.Fragment>
        ))}
      </div>
    </section>
  );
};

window.WAbout = WAbout;
window.WCompetencies = WCompetencies;
window.WClientsMarquee = WClientsMarquee;
