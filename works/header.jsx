// WORKS — Header (sticky nav)

const WHeader = ({ active, setActive }) => {
  const D = window.WORKS_DATA;
  const [scrolled, setScrolled] = React.useState(false);
  const [menuOpen, setMenuOpen] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => {
      const root = document.querySelector('.w-scroller');
      const y = root ? root.scrollTop : window.scrollY;
      setScrolled(y > 40);
    };
    const root = document.querySelector('.w-scroller');
    (root || window).addEventListener('scroll', onScroll);
    return () => (root || window).removeEventListener('scroll', onScroll);
  }, []);

  const go = (id) => (e) => {
    e.preventDefault();
    setActive(id);
    setMenuOpen(false);
    const el = document.getElementById('w-' + id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <header className={'w-header' + (scrolled ? ' is-scrolled' : '') + (menuOpen ? ' is-open' : '')}>
      <style>{`
        .w-header {
          position: sticky;
          top: 0;
          z-index: 50;
          padding: 20px 64px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid transparent;
          transition: background .3s, border-color .3s, padding .3s;
        }
        .w-header.is-scrolled {
          background: rgba(0, 0, 0, 0.88);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          border-bottom-color: var(--w-line);
          padding: 14px 64px;
        }
        [data-theme="light"] .w-header.is-scrolled {
          background: rgba(244, 241, 234, 0.88);
        }
        .w-logo { display: flex; align-items: center; gap: 14px; cursor: pointer; }
        .w-logo-mark {
          width: 38px; height: 38px;
          border: 1.5px solid var(--w-accent);
          color: var(--w-accent);
          display: flex; align-items: center; justify-content: center;
          font-family: "Noto Serif TC", serif;
          font-weight: 700; font-size: 14px;
          transform: rotate(45deg);
          letter-spacing: -0.04em;
        }
        .w-logo-mark span { transform: rotate(-45deg); }
        .w-logo-text { font-family: "Noto Serif TC", serif; font-weight: 600; font-size: 17px; letter-spacing: 0.04em; line-height: 1.1; }
        .w-logo-text small {
          display: block;
          font-family: "Inter", sans-serif;
          font-weight: 500;
          font-size: 11px;
          letter-spacing: 0.24em;
          color: var(--w-text-mute);
          margin-top: 3px;
          text-transform: uppercase;
        }
        .w-nav { display: flex; gap: 32px; }
        .w-nav a {
          font-family: "Inter", sans-serif;
          font-size: 15px;
          font-weight: 500;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--w-text-soft);
          padding: 6px 0;
          position: relative;
          cursor: pointer;
          transition: color .2s;
        }
        .w-nav a:hover { color: var(--w-text); }
        .w-nav a.active { color: var(--w-text); }
        .w-nav a.active::after {
          content: '';
          position: absolute; left: 0; right: 0; bottom: -2px;
          height: 2px; background: var(--w-accent);
        }

        /* Hamburger — hidden on desktop, shown on mobile */
        .w-burger {
          display: none;
          width: 38px; height: 38px;
          background: transparent;
          border: 1.5px solid var(--w-text);
          color: var(--w-text);
          align-items: center;
          justify-content: center;
          cursor: pointer;
          position: relative;
        }
        .w-burger span {
          display: block;
          width: 16px; height: 1.5px;
          background: var(--w-text);
          position: absolute;
          transition: transform .25s, opacity .25s;
        }
        .w-burger span:nth-child(1) { transform: translateY(-5px); }
        .w-burger span:nth-child(2) { transform: translateY(0); }
        .w-burger span:nth-child(3) { transform: translateY(5px); }
        .w-header.is-open .w-burger span:nth-child(1) { transform: translateY(0) rotate(45deg); background: var(--w-accent); }
        .w-header.is-open .w-burger span:nth-child(2) { opacity: 0; }
        .w-header.is-open .w-burger span:nth-child(3) { transform: translateY(0) rotate(-45deg); background: var(--w-accent); }

        /* Mobile menu drawer */
        .w-mobile-menu {
          display: none;
          position: fixed;
          top: 70px; left: 0; right: 0;
          background: rgba(0, 0, 0, 0.96);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          padding: 32px 24px;
          border-bottom: 1px solid var(--w-line);
          z-index: 49;
        }
        .w-mobile-menu.open { display: block; }
        .w-mobile-menu a {
          display: block;
          padding: 18px 0;
          font-family: "Noto Serif TC", serif;
          font-weight: 600;
          font-size: 22px;
          color: var(--w-text);
          border-bottom: 1px solid var(--w-line-soft);
          cursor: pointer;
        }
        .w-mobile-menu a.active { color: var(--w-accent); }
        .w-mobile-menu .w-mobile-cta {
          margin-top: 24px;
          width: 100%;
          justify-content: center;
          font-size: 13px;
        }
      `}</style>

      <div className="w-logo" onClick={go('home')}>
        <div className="w-logo-mark"><span>沃</span></div>
        <div className="w-logo-text">
          {D.brand.zh}
          <small>{D.brand.en} · EST. {D.brand.estab}</small>
        </div>
      </div>

      <nav className="w-nav">
        {D.nav.map(n => (
          <a key={n.id} className={active === n.id ? 'active' : ''} onClick={go(n.id)}>
            {n.en}
          </a>
        ))}
        <a href="admin.html" target="_blank" rel="noopener" style={{ color: 'var(--w-accent)', fontSize: '15px' }} title="後台管理">⚙ ADMIN</a>
      </nav>

      <button className="w-btn w-header-cta" onClick={go('contact')}>
        START A PROJECT →
      </button>

      <button className="w-burger" onClick={() => setMenuOpen(o => !o)} aria-label="Menu">
        <span></span><span></span><span></span>
      </button>

      <div className={'w-mobile-menu' + (menuOpen ? ' open' : '')}>
        {D.nav.map(n => (
          <a key={n.id} className={active === n.id ? 'active' : ''} onClick={go(n.id)}>
            {n.zh} / {n.en}
          </a>
        ))}
        <a href="admin.html" target="_blank" rel="noopener" style={{ color: 'var(--w-accent)', textAlign: 'center', fontSize: '18px' }}>⚙ 後台管理 / ADMIN</a>
        <button className="w-btn w-mobile-cta" onClick={go('contact')}>
          獲取專案報價 / QUOTE
        </button>
      </div>
    </header>
  );
};

window.WHeader = WHeader;
