/**
 * DashboardLayout — KZA Luxury Edition
 * Nav centralizada · Sliding pill cursor effect · Logo KZA real
 */

import { ReactNode, useRef, useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';

interface DashboardLayoutProps {
  children: ReactNode;
}

const NAV_ITEMS = [
  { label: 'Dashboard',            href: '/'         },
  { label: 'Análise de Matrícula', href: '/matricula'},
  { label: 'Configurações',        href: '/settings' },
];

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [location] = useLocation();
  const [pill, setPill] = useState({ left: 0, width: 0, opacity: 0 });
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const navRef   = useRef<HTMLElement>(null);

  // set pill to active item on mount / route change
  useEffect(() => {
    const idx = NAV_ITEMS.findIndex(n => n.href === location);
    const el = itemRefs.current[idx];
    const nav = navRef.current;
    if (el && nav) {
      const navRect = nav.getBoundingClientRect();
      const elRect  = el.getBoundingClientRect();
      setPill({ left: elRect.left - navRect.left, width: elRect.width, opacity: 1 });
    }
  }, [location]);

  const handleEnter = (i: number) => {
    const el  = itemRefs.current[i];
    const nav = navRef.current;
    if (!el || !nav) return;
    const navRect = nav.getBoundingClientRect();
    const elRect  = el.getBoundingClientRect();
    setPill({ left: elRect.left - navRect.left, width: elRect.width, opacity: 1 });
  };

  const handleLeave = () => {
    // reset to active
    const idx = NAV_ITEMS.findIndex(n => n.href === location);
    const el  = itemRefs.current[idx];
    const nav = navRef.current;
    if (el && nav) {
      const navRect = nav.getBoundingClientRect();
      const elRect  = el.getBoundingClientRect();
      setPill({ left: elRect.left - navRect.left, width: elRect.width, opacity: 1 });
    }
  };

  return (
    <div className="kza-root">
      <div className="kza-noise" />
      <div className="kza-arch-bg" />

      {/* ── Header ── */}
      <header className="kza-header">
        <div className="kza-header-inner">

          {/* LEFT — Logo */}
          <Link href="/">
            <a className="kza-logo-link" title="KZA Real Estate">
              <img src="/logo-kza-dark.png" alt="KZA" className="kza-logo-img" />
              <span className="kza-logo-sub">Real Estate</span>
            </a>
          </Link>

          {/* CENTER — Pill nav (absolute centered) */}
          <div className="kza-nav-center">
            <nav
              ref={navRef}
              className="kza-nav-pill"
              onMouseLeave={handleLeave}
            >
              {/* Sliding background */}
              <span
                className="kza-pill-bg"
                style={{
                  left: pill.left,
                  width: pill.width,
                  opacity: pill.opacity,
                }}
              />

              {NAV_ITEMS.map((item, i) => {
                const active = location === item.href;
                return (
                  <Link key={item.href} href={item.href}>
                    <a
                      ref={el => { itemRefs.current[i] = el; }}
                      className={`kza-pill-item${active ? ' kza-pill-active' : ''}`}
                      onMouseEnter={() => handleEnter(i)}
                    >
                      {item.label}
                    </a>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* RIGHT — actions */}
          <div className="kza-actions">
            <div className="kza-search-wrap">
              <svg className="kza-search-icon" width="13" height="13" viewBox="0 0 14 14" fill="none">
                <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M9.5 9.5l2.5 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <input className="kza-search" type="text" placeholder="Pesquisar..." />
            </div>

            <button className="kza-icon-btn" title="Notificações">
              <svg width="17" height="17" viewBox="0 0 18 18" fill="none">
                <path d="M9 2a5 5 0 0 1 5 5v3l1.5 2H2.5L4 10V7a5 5 0 0 1 5-5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
                <path d="M7 14.5a2 2 0 0 0 4 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>

            <button className="kza-icon-btn" title="Perfil">
              <svg width="17" height="17" viewBox="0 0 18 18" fill="none">
                <circle cx="9" cy="6" r="3" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M3 15c0-3.314 2.686-5 6-5s6 1.686 6 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>
          </div>
        </div>
      </header>

      <main className="kza-main">{children}</main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap');

        *, *::before, *::after { box-sizing: border-box; }

        :root {
          --bg:           #f9f9fb;
          --surface:      #f9f9fb;
          --surface-0:    #ffffff;
          --surface-low:  #f3f3f5;
          --surface-mid:  #eeeef0;
          --surface-high: #e8e8ea;
          --surface-top:  #e2e2e4;
          --on-surface:   #1a1c1d;
          --on-surface-v: #46464a;
          --outline:      #77767b;
          --outline-v:    #c7c6ca;
          --primary:      #030304;
          --on-primary:   #ffffff;
          --gold:         #755b00;
          --gold-c:       #c9a227;
          --gold-ctr:     #fed255;
          --on-gold:      #ffffff;
          --gold-l:       rgba(117,91,0,0.09);
          --gold-border:  rgba(117,91,0,0.22);
          --green:        #009869;
          --green-bg:     rgba(78,222,163,0.18);
          --green-text:   #005236;
          --error:        #ba1a1a;
          --error-bg:     #ffdad6;
          --error-text:   #93000a;
          --r:            12px;
          --r-lg:         16px;
          --r-full:       9999px;
          --font:         'Inter', -apple-system, system-ui, sans-serif;
          --mono:         'Space Grotesk', system-ui, sans-serif;
          --sh-card:      0 4px 40px -10px rgba(0,0,0,0.05);
          --sh-sm:        0 1px 4px rgba(0,0,0,0.06);
          --sh-md:        0 8px 32px rgba(0,0,0,0.09);
        }

        body { font-family: var(--font); background: var(--bg); color: var(--on-surface); margin: 0; -webkit-font-smoothing: antialiased; }
        .kza-root { min-height: 100vh; }

        .kza-noise {
          position: fixed; inset: 0; z-index: 50; pointer-events: none; opacity: 0.018;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
        }

        .kza-arch-bg {
          position: fixed; top: 0; right: 0; width: 50%; height: 100%;
          z-index: 0; pointer-events: none; opacity: 0.1; mix-blend-mode: multiply;
          background-image: url('https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1200&q=80');
          background-size: cover; background-position: center;
          -webkit-mask-image: linear-gradient(to right, transparent, black 55%);
          mask-image: linear-gradient(to right, transparent, black 55%);
        }

        /* ── Header ── */
        .kza-header {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100; height: 64px;
          background: rgba(249,249,251,0.88);
          backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px);
          border-bottom: 1px solid rgba(199,198,202,0.3);
        }

        .kza-header-inner {
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
          height: 100%; padding: 0 32px;
          max-width: 1440px; margin: 0 auto;
        }

        /* Logo */
        .kza-logo-link {
          display: flex; align-items: center; gap: 8px;
          text-decoration: none; transition: opacity 0.2s; justify-self: start;
        }
        .kza-logo-link:hover { opacity: 0.78; }
        .kza-logo-img { height: 26px; width: auto; object-fit: contain; display: block; }
        .kza-logo-sub {
          font-family: var(--mono); font-size: 9px; font-weight: 500;
          color: var(--on-surface-v); letter-spacing: 0.14em; text-transform: uppercase; opacity: 0.55;
        }

        /* ── Pill nav — CENTER ── */
        .kza-nav-center { display: flex; justify-content: center; align-items: center; }

        .kza-nav-pill {
          position: relative; display: flex; align-items: center;
          background: var(--surface-low);
          border: 1.5px solid rgba(199,198,202,0.55);
          border-radius: var(--r-full);
          padding: 4px;
          box-shadow: 0 1px 4px rgba(0,0,0,0.06);
          gap: 0;
          user-select: none;
        }

        /* sliding background pill */
        .kza-pill-bg {
          position: absolute; top: 4px; height: calc(100% - 8px);
          background: var(--primary);
          border-radius: var(--r-full);
          transition: left 0.22s cubic-bezier(0.4,0,0.2,1),
                      width 0.22s cubic-bezier(0.4,0,0.2,1),
                      opacity 0.15s ease;
          pointer-events: none; z-index: 0;
          box-shadow: 0 2px 8px rgba(0,0,0,0.22);
        }

        .kza-pill-item {
          position: relative; z-index: 1;
          display: flex; align-items: center;
          padding: 7px 16px;
          font-family: var(--mono); font-size: 12.5px; font-weight: 500;
          color: var(--on-surface-v);
          text-decoration: none; white-space: nowrap; border-radius: var(--r-full);
          letter-spacing: 0.01em;
          /* mix-blend-mode makes text white on dark pill */
          mix-blend-mode: normal;
          transition: color 0.18s ease;
        }

        /* Active item text turns white due to pill background */
        .kza-pill-active { color: var(--on-primary) !important; }

        /* Hover on non-active items */
        .kza-pill-item:not(.kza-pill-active):hover { color: var(--primary); }

        /* Actions */
        .kza-actions {
          display: flex; align-items: center; gap: 8px; justify-self: end;
        }

        .kza-search-wrap { position: relative; display: flex; align-items: center; }
        .kza-search-icon { position: absolute; left: 10px; color: var(--on-surface-v); pointer-events: none; }
        .kza-search {
          padding: 7px 14px 7px 30px; background: var(--surface-low);
          border: 1px solid rgba(199,198,202,0.5); border-radius: var(--r-full);
          font-family: var(--font); font-size: 12px; color: var(--on-surface);
          width: 180px; outline: none; transition: box-shadow 0.15s, width 0.2s;
        }
        .kza-search::placeholder { color: rgba(70,70,74,0.42); }
        .kza-search:focus { box-shadow: 0 0 0 2px var(--gold-border); width: 220px; }

        .kza-icon-btn {
          width: 34px; height: 34px; border-radius: var(--r-full);
          display: flex; align-items: center; justify-content: center;
          background: transparent; border: none; cursor: pointer; color: var(--on-surface-v);
          transition: background 0.15s, color 0.15s;
        }
        .kza-icon-btn:hover { background: var(--surface-high); color: var(--primary); }

        .kza-main { padding-top: 64px; min-height: 100vh; position: relative; z-index: 1; }

        /* ═══════════ SHARED DESIGN SYSTEM ═══════════ */
        .k-page-hdr { padding: 40px 40px 24px; max-width: 1440px; margin: 0 auto; }
        .k-eyebrow {
          font-family: var(--mono); font-size: 10px; font-weight: 500;
          color: var(--gold); letter-spacing: 0.2em; text-transform: uppercase; margin-bottom: 8px;
        }
        .k-page-title { font-size: 36px; font-weight: 700; color: var(--primary); letter-spacing: -0.03em; line-height: 1.15; margin: 0; }
        .k-page-sub   { font-size: 15px; color: var(--on-surface-v); margin-top: 6px; line-height: 1.6; }
        .k-content    { padding: 0 40px 48px; max-width: 1440px; margin: 0 auto; }

        .k-section {
          background: rgba(249,249,251,0.62); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(199,198,202,0.28); border-radius: var(--r-lg);
          overflow: hidden; box-shadow: var(--sh-card);
        }
        .k-section-hdr {
          display: flex; align-items: center; gap: 10px;
          padding: 14px 22px; border-bottom: 1px solid rgba(199,198,202,0.2);
        }
        .k-icon-wrap {
          width: 30px; height: 30px; border-radius: 8px;
          display: flex; align-items: center; justify-content: center; flex-shrink: 0; font-size: 14px;
        }
        .k-section-title { font-family: var(--mono); font-size: 13px; font-weight: 600; color: var(--primary); }
        .k-section-body  { padding: 22px; }

        /* Buttons */
        .k-btn {
          display: inline-flex; align-items: center; justify-content: center;
          gap: 6px; padding: 0 15px; height: 34px;
          border-radius: var(--r); font-size: 12.5px; font-weight: 500;
          font-family: var(--mono); cursor: pointer; border: none;
          transition: all 0.18s cubic-bezier(0.4,0,0.2,1);
          text-decoration: none; white-space: nowrap; letter-spacing: 0.01em;
        }
        .k-btn-primary { background: var(--primary); color: var(--on-primary); box-shadow: 0 2px 8px rgba(0,0,0,0.18); }
        .k-btn-primary:hover { background: #1d1d1f; transform: translateY(-1px); box-shadow: 0 4px 14px rgba(0,0,0,0.22); }
        .k-btn-gold { background: var(--gold); color: var(--on-gold); box-shadow: 0 2px 8px rgba(117,91,0,0.2); }
        .k-btn-gold:hover { background: #5c4700; transform: translateY(-1px); box-shadow: 0 4px 16px rgba(117,91,0,0.28); }
        .k-btn-outline { background: transparent; color: var(--on-surface-v); border: 1px solid rgba(199,198,202,0.7); box-shadow: 0 1px 3px rgba(0,0,0,0.04); }
        .k-btn-outline:hover { background: var(--surface-low); color: var(--primary); border-color: rgba(199,198,202,0.9); transform: translateY(-1px); }
        .k-btn-ghost { background: transparent; color: var(--on-surface-v); }
        .k-btn-ghost:hover { background: var(--surface-low); color: var(--primary); }
        .k-btn-filter-on { background: var(--primary) !important; color: var(--on-primary) !important; border-color: transparent !important; }
        .k-btn:disabled { opacity: 0.48; cursor: not-allowed; pointer-events: none; }
        .k-btn:active   { transform: translateY(0) !important; }
        .k-btn-sm { height: 28px; padding: 0 11px; font-size: 11.5px; border-radius: 8px; }
        .k-btn-lg { height: 42px; padding: 0 20px; font-size: 13.5px; border-radius: 14px; }

        /* Inputs */
        .k-input {
          width: 100%; height: 38px; padding: 0 12px;
          background: var(--surface-0); border: 1px solid rgba(199,198,202,0.5);
          border-radius: var(--r); font-size: 13px; font-family: var(--font);
          color: var(--on-surface); outline: none; transition: border-color 0.15s, box-shadow 0.15s;
        }
        .k-input:focus { border-color: var(--gold); box-shadow: 0 0 0 3px var(--gold-l); }
        .k-input::placeholder { color: rgba(70,70,74,0.38); }

        .k-select {
          height: 32px; padding: 0 26px 0 10px; appearance: none;
          background: var(--surface-0) url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%2377767b' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E") no-repeat right 9px center;
          border: 1px solid rgba(199,198,202,0.55); border-radius: var(--r);
          font-size: 12px; font-family: var(--mono); color: var(--on-surface-v);
          cursor: pointer; outline: none; transition: border-color 0.15s, box-shadow 0.15s;
        }
        .k-select:focus { border-color: var(--gold); box-shadow: 0 0 0 3px var(--gold-l); }

        .k-textarea {
          width: 100%; padding: 12px; background: var(--surface-0);
          border: 1px solid rgba(199,198,202,0.5); border-radius: var(--r);
          font-size: 13px; font-family: var(--font); color: var(--on-surface);
          outline: none; resize: none; line-height: 1.65; transition: border-color 0.15s, box-shadow 0.15s;
        }
        .k-textarea:focus { border-color: var(--gold); box-shadow: 0 0 0 3px var(--gold-l); }
        .k-textarea::placeholder { color: rgba(70,70,74,0.38); }

        /* Badges */
        .k-badge {
          display: inline-flex; align-items: center; gap: 4px;
          padding: 3px 9px; border-radius: var(--r-full);
          font-family: var(--mono); font-size: 11px; font-weight: 600; letter-spacing: 0.02em;
        }
        .k-badge-green  { background: var(--green-bg);  color: var(--green-text); }
        .k-badge-gold   { background: rgba(236,194,70,0.22); color: #584400; }
        .k-badge-blue   { background: rgba(59,130,246,0.12); color: #1d4ed8; }
        .k-badge-red    { background: var(--error-bg);  color: var(--error-text); }
        .k-badge-purple { background: rgba(167,139,250,0.15); color: #5b21b6; }
        .k-badge-gray   { background: var(--surface-high); color: var(--on-surface-v); }

        /* Table */
        .k-table { width: 100%; border-collapse: collapse; font-family: var(--font); }
        .k-table th {
          padding: 10px 18px; text-align: left;
          font-family: var(--mono); font-size: 10px; font-weight: 600;
          color: var(--on-surface-v); letter-spacing: 0.08em; text-transform: uppercase;
          border-bottom: 1px solid rgba(199,198,202,0.35); background: rgba(243,243,245,0.5);
        }
        .k-table td { padding: 13px 18px; font-size: 13px; color: var(--on-surface); border-bottom: 1px solid rgba(199,198,202,0.18); }
        .k-table tr:last-child td { border-bottom: none; }
        .k-table-row { cursor: pointer; transition: background 0.12s; }
        .k-table-row:hover td { background: rgba(243,243,245,0.7); }

        /* Dropzone */
        .k-dropzone {
          border: 1.5px dashed rgba(199,198,202,0.7); border-radius: var(--r); padding: 28px;
          text-align: center; cursor: pointer;
          display: flex; flex-direction: column; align-items: center; gap: 8px;
          background: rgba(249,249,251,0.4); transition: all 0.2s ease;
        }
        .k-dropzone:hover { border-color: var(--gold); background: rgba(117,91,0,0.04); box-shadow: 0 0 0 3px var(--gold-l); }

        /* Stat card */
        .k-stat-card {
          background: rgba(249,249,251,0.65); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(199,198,202,0.28); border-radius: var(--r-lg);
          padding: 22px 24px; box-shadow: var(--sh-card); transition: transform 0.2s, box-shadow 0.2s;
        }
        .k-stat-card:hover { transform: translateY(-2px); box-shadow: var(--sh-md); }

        /* Spinner */
        .k-spinner { width: 20px; height: 20px; border-radius: 50%; border: 2px solid rgba(117,91,0,0.2); border-top-color: var(--gold); animation: k-spin 0.75s linear infinite; }
        .k-divider { width: 1px; height: 18px; background: var(--outline-v); opacity: 0.5; flex-shrink: 0; }
        .k-filter-bar { display: flex; align-items: center; flex-wrap: wrap; gap: 8px; padding: 11px 18px; border-bottom: 1px solid rgba(199,198,202,0.2); background: rgba(243,243,245,0.28); }

        /* Animations */
        @keyframes k-fade-up { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
        @keyframes k-spin { to { transform: rotate(360deg); } }
        .k-anim   { animation: k-fade-up 0.38s cubic-bezier(0.16,1,0.3,1) both; }
        .k-anim-1 { animation-delay: 0.04s; }
        .k-anim-2 { animation-delay: 0.09s; }
        .k-anim-3 { animation-delay: 0.14s; }
        .k-anim-4 { animation-delay: 0.19s; }
        .k-anim-5 { animation-delay: 0.24s; }
        .k-anim-6 { animation-delay: 0.29s; }

        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-track { background: var(--surface-low); }
        ::-webkit-scrollbar-thumb { background: var(--outline-v); border-radius: 3px; }
        ::-webkit-scrollbar-thumb:hover { background: var(--outline); }

        @media (max-width: 900px) {
          .kza-header-inner { grid-template-columns: auto 1fr auto; gap: 12px; padding: 0 16px; }
          .kza-nav-center { display: none; }
          .kza-search { display: none; }
          .k-content, .k-page-hdr { padding-left: 16px; padding-right: 16px; }
        }
      `}</style>
    </div>
  );
}
