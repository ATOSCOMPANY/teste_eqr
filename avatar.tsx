/**
 * MatriculaLoadingScreen — KZA Luxury Edition
 * Logo KZA real · Barra controlada externamente (100% só quando dados chegam)
 */

import { useEffect, useState, useRef } from 'react';

interface MatriculaLoadingScreenProps {
  fileName: string;
  /** 0–100. Se passado, controla a barra externamente (progresso real). */
  progress?: number;
}

const STAGES = [
  { label: 'Recebendo documento',    sub: 'Transferência segura de dados'         },
  { label: 'Extração de dados',       sub: 'Análise estrutural da matrícula'       },
  { label: 'Verificação patrimonial', sub: 'Cruzamento de registros imobiliários'  },
  { label: 'Pesquisa de comparáveis', sub: 'Varredura do mercado regional'         },
  { label: 'Modelagem de valor',       sub: 'Cálculo estatístico de precificação'  },
  { label: 'Compilando relatório',     sub: 'Consolidando dados da análise'        },
];

/** Deriva qual etapa está ativa a partir do progresso (0-100) */
function stageFromProgress(p: number): number {
  if (p >= 95) return 5;
  if (p >= 75) return 4;
  if (p >= 58) return 3;
  if (p >= 40) return 2;
  if (p >= 22) return 1;
  return 0;
}

export default function MatriculaLoadingScreen({ fileName, progress: externalProgress }: MatriculaLoadingScreenProps) {
  const [elapsed, setElapsed] = useState(0);
  // When no external progress is passed, use internal fake progress (never reaches 100)
  const [internalProgress, setInternalProgress] = useState(0);
  const startRef = useRef(Date.now());

  // Timer
  useEffect(() => {
    const id = setInterval(() => setElapsed(Math.floor((Date.now() - startRef.current) / 1000)), 1000);
    return () => clearInterval(id);
  }, []);

  // Internal fake progress — never reaches 100%, caps at 88%
  useEffect(() => {
    if (externalProgress !== undefined) return; // controlled externally
    const id = setInterval(() => {
      setInternalProgress(p => {
        if (p >= 88) return p;
        // slows down exponentially as it approaches 88
        const step = Math.max(0.05, 0.6 * (1 - p / 88));
        return Math.min(88, p + step);
      });
    }, 80);
    return () => clearInterval(id);
  }, [externalProgress]);

  const progress = externalProgress !== undefined ? externalProgress : internalProgress;
  const stage    = stageFromProgress(progress);

  const fmt = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  const isComplete = progress >= 100;

  return (
    <div style={{
      minHeight: '100vh', background: '#0c0d14',
      color: '#d0d0d0',
      fontFamily: "'Inter', -apple-system, system-ui, sans-serif",
      display: 'flex', flexDirection: 'column',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* Grid overlay */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage: `
          linear-gradient(rgba(201,162,39,0.024) 1px, transparent 1px),
          linear-gradient(90deg, rgba(201,162,39,0.024) 1px, transparent 1px)
        `,
        backgroundSize: '64px 64px',
      }} />

      {/* Gold ambient */}
      <div style={{
        position: 'absolute', bottom: -80, right: -80, width: 560, height: 560,
        background: 'radial-gradient(circle, rgba(201,162,39,0.055) 0%, transparent 65%)',
        pointerEvents: 'none',
      }} />

      {/* ── Topbar with KZA logo ── */}
      <div style={{
        borderBottom: '1px solid rgba(255,255,255,0.055)',
        padding: '14px 48px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        position: 'relative', zIndex: 1, flexShrink: 0,
      }}>
        {/* Logo KZA real */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <img
            src="/logo-kza-dark.png"
            alt="KZA"
            style={{
              height: 30,
              width: 'auto',
              objectFit: 'contain',
              filter: 'brightness(0) invert(1)',
              opacity: 0.85,
            }}
          />
          <div style={{ width: 1, height: 18, background: 'rgba(255,255,255,0.12)', margin: '0 2px' }} />
          <span style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 9, fontWeight: 500,
            color: 'rgba(255,255,255,0.28)',
            letterSpacing: '0.2em', textTransform: 'uppercase',
          }}>
            Sistema de Análise
          </span>
        </div>

        {/* Timer pill */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <span style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 10, color: 'rgba(255,255,255,0.2)',
            letterSpacing: '0.15em', textTransform: 'uppercase',
          }}>
            {isComplete ? 'Concluído' : 'Processo Ativo'}
          </span>
          <div style={{
            fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, fontWeight: 600,
            color: isComplete ? '#4ade80' : '#c9a227',
            background: isComplete ? 'rgba(74,222,128,0.09)' : 'rgba(201,162,39,0.09)',
            border: `1px solid ${isComplete ? 'rgba(74,222,128,0.2)' : 'rgba(201,162,39,0.18)'}`,
            borderRadius: 8, padding: '5px 14px',
            transition: 'all 0.5s ease',
          }}>
            {fmt(elapsed)}
          </div>
        </div>
      </div>

      {/* ── Main ── */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center',
        padding: '0 48px', maxWidth: 900, margin: '0 auto', width: '100%',
        position: 'relative', zIndex: 1,
      }}>
        {/* Header */}
        <div style={{ marginBottom: 52 }}>
          <p style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 10, fontWeight: 500,
            color: isComplete ? '#4ade80' : '#c9a227',
            letterSpacing: '0.25em', textTransform: 'uppercase',
            marginBottom: 14, transition: 'color 0.4s',
          }}>
            {isComplete ? '✓ ANÁLISE CONCLUÍDA' : '■ ANÁLISE EM PROCESSAMENTO'}
          </p>
          <h1 style={{
            fontSize: 'clamp(28px, 4vw, 42px)', fontWeight: 300,
            color: '#ffffff', letterSpacing: '-0.03em', lineHeight: 1.15, margin: 0,
          }}>
            Avaliação de Matrícula
          </h1>
          <p style={{
            fontSize: 12, color: 'rgba(255,255,255,0.22)', marginTop: 10,
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            maxWidth: 480, fontFamily: "'Space Grotesk', sans-serif",
          }}>
            {fileName}
          </p>
        </div>

        {/* ── Progress bar ── */}
        <div style={{ marginBottom: 48 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
            <span style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 10, fontWeight: 500, color: 'rgba(255,255,255,0.22)',
              letterSpacing: '0.15em', textTransform: 'uppercase',
            }}>
              Progresso
            </span>
            <span style={{
              fontFamily: "'Space Grotesk', sans-serif", fontSize: 12, fontWeight: 700,
              color: isComplete ? '#4ade80' : '#c9a227',
              transition: 'color 0.4s',
            }}>
              {Math.round(progress)}%
            </span>
          </div>
          {/* Track */}
          <div style={{ height: 3, background: 'rgba(255,255,255,0.07)', borderRadius: 2, overflow: 'hidden' }}>
            <div style={{
              height: '100%',
              width: `${progress}%`,
              background: isComplete
                ? 'linear-gradient(90deg, #22c55e, #4ade80)'
                : 'linear-gradient(90deg, #a6841a, #c9a227, #e6c840)',
              borderRadius: 2,
              /* Transition is faster near the end to feel snappy at 100% */
              transition: progress >= 99 ? 'width 0.3s ease-out, background 0.5s' : 'width 0.15s linear, background 0.5s',
              boxShadow: isComplete
                ? '0 0 10px rgba(74,222,128,0.4)'
                : '0 0 10px rgba(201,162,39,0.35)',
            }} />
          </div>
        </div>

        {/* ── Stages list ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {STAGES.map((s, i) => {
            const done   = i < stage || isComplete;
            const active = i === stage && !isComplete;
            const pend   = i > stage && !isComplete;
            return (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 18,
                padding: '12px 16px', borderRadius: '0 8px 8px 0',
                borderLeft: active ? '2px solid #c9a227' : '2px solid transparent',
                background: active ? 'rgba(201,162,39,0.045)' : 'transparent',
                opacity: pend ? 0.2 : 1,
                transition: 'all 0.35s ease',
              }}>
                {/* Indicator */}
                <div style={{ width: 18, flexShrink: 0, display: 'flex', justifyContent: 'center' }}>
                  {done ? (
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <circle cx="7" cy="7" r="6" stroke="#c9a227" strokeWidth="1.5"/>
                      <path d="M4 7l2 2 4-4" stroke="#c9a227" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  ) : active ? (
                    <div style={{
                      width: 6, height: 6, borderRadius: '50%', background: '#c9a227',
                      boxShadow: '0 0 8px rgba(201,162,39,0.7)',
                      animation: 'mls-pulse 1.8s ease-in-out infinite',
                    }} />
                  ) : (
                    <div style={{ width: 5, height: 5, borderRadius: '50%', background: 'rgba(255,255,255,0.15)' }} />
                  )}
                </div>

                {/* Text */}
                <div style={{ flex: 1 }}>
                  <p style={{
                    fontSize: 14,
                    color: (active || done) ? (done && !active ? 'rgba(255,255,255,0.45)' : '#f0f0f0') : 'rgba(255,255,255,0.18)',
                    fontWeight: active ? 500 : 400,
                    letterSpacing: '-0.01em',
                    transition: 'color 0.3s',
                  }}>
                    {s.label}
                  </p>
                  {active && (
                    <p style={{
                      fontSize: 11, color: 'rgba(201,162,39,0.6)', marginTop: 2,
                      fontFamily: "'Space Grotesk', sans-serif",
                    }}>
                      {s.sub}
                    </p>
                  )}
                </div>

                {/* Step number */}
                <span style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: 10, color: 'rgba(255,255,255,0.1)', letterSpacing: '0.06em', flexShrink: 0,
                }}>
                  {String(i + 1).padStart(2, '0')}/{STAGES.length}
                </span>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div style={{
          marginTop: 44, paddingTop: 18, borderTop: '1px solid rgba(255,255,255,0.05)',
          display: 'flex', justifyContent: 'space-between',
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: 10, color: 'rgba(255,255,255,0.16)',
          letterSpacing: '0.12em', textTransform: 'uppercase',
        }}>
          <span>{isComplete ? 'Redirecionando...' : 'Tempo estimado: 1–10 minutos'}</span>
          <span>{fmt(elapsed)} decorrido</span>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500&family=Space+Grotesk:wght@400;500;600&display=swap');
        @keyframes mls-pulse {
          0%,100% { opacity:1; box-shadow:0 0 8px rgba(201,162,39,0.7); }
          50%      { opacity:0.3; box-shadow:0 0 2px rgba(201,162,39,0.2); }
        }
      `}</style>
    </div>
  );
}
