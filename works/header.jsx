// WORKS — Header (sticky nav)

const WHeader = ({ active, setActive }) => {
  const D = window.WORKS_DATA;
  const [scrolled, setScrolled] = React.useState(false);

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
    const el = document.getElementById('w-' + id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <header className={'w-header' + (scrolled ? ' is-scrolled' : '')}>
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
          background: rgba(10, 22, 40, 0.88);
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
          font-size: 9px;
          letter-spacing: 0.32em;
          color: var(--w-text-mute);
          margin-top: 3px;
          text-transform: uppercase;
        }
        .w-nav { display: flex; gap: 28px; }
        .w-nav a {
          font-family: "Inter", sans-serif;
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.22em;
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
      </nav>

      <button className="w-btn" onClick={go('contact')}>
        START A PROJECT →
      </button>
    </header>
  );
};

window.WHeader = WHeader;
