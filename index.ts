/**
 * Dashboard — KZA Luxury Edition
 * Filtros: Todos · Casa · Prédio · Terreno · Fazenda + Status + Data
 */

import { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'wouter';
import DashboardLayout from '@/components/DashboardLayout';
import { getMatriculaAnalyses } from '@/lib/supabaseService';
import { formatCurrency } from '@/lib/matriculaService';

interface Analysis {
  id: string;
  title: string;
  location: string;
  status: string;
  valor_mercado: number;
  tipo_imovel: string;
  created_at: string;
  raw: any;
}

function normalizeMatricula(r: any): Analysis {
  const parts = [r.rua, r.bairro_ou_condominio, r.cidade, r.estado].filter(Boolean);
  return {
    id: r.id,
    title: r.arquivo_nome || 'Matrícula',
    location: parts.join(', ') || '—',
    status: r.status || 'pendente',
    valor_mercado: r.valor_mercado_estimado || 0,
    tipo_imovel: (r.tipo_imovel || '').toLowerCase(),
    created_at: r.created_at,
    raw: r,
  };
}

const STATUS_CFG: Record<string, { label: string; cls: string }> = {
  concluida:   { label: 'Concluída',   cls: 'k-badge-green' },
  processando: { label: 'Processando', cls: 'k-badge-gold'  },
  erro:        { label: 'Erro',        cls: 'k-badge-red'   },
  pendente:    { label: 'Pendente',    cls: 'k-badge-gray'  },
};

/* Property type filter config */
type PropType = 'todos' | 'casa' | 'predio' | 'terreno' | 'fazenda';

const PROP_TYPES: { k: PropType; label: string; keywords: string[] }[] = [
  { k: 'todos',   label: 'Todos',   keywords: []                                     },
  { k: 'casa',    label: 'Casa',    keywords: ['casa', 'residencia', 'residencial']   },
  { k: 'predio',  label: 'Prédio',  keywords: ['apartamento', 'apto', 'predio', 'edificio', 'comercial', 'sala', 'andar', 'torre'] },
  { k: 'terreno', label: 'Terreno', keywords: ['terreno', 'lote', 'area', 'gleba']   },
  { k: 'fazenda', label: 'Fazenda', keywords: ['fazenda', 'sitio', 'chacara', 'rural'] },
];

const matchesPropType = (tipo: string, k: PropType): boolean => {
  if (k === 'todos') return true;
  const normalized = tipo.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  return PROP_TYPES.find(p => p.k === k)?.keywords.some(kw => normalized.includes(kw)) ?? false;
};

const DATE_RANGES: { k: string; label: string; days: number | null }[] = [
  { k: 'todos', label: 'Todas as datas', days: null },
  { k: 'hoje',  label: 'Hoje',           days: 0    },
  { k: '7d',    label: 'Últimos 7 dias', days: 7    },
  { k: '30d',   label: 'Últimos 30 dias',days: 30   },
  { k: '90d',   label: 'Últimos 90 dias',days: 90   },
];

function StatCard({ label, value, sub, icon, delay }: {
  label: string; value: string; sub: string; icon: string; delay: number;
}) {
  return (
    <div className={`k-stat-card k-anim k-anim-${delay}`}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:18 }}>
        <p style={{ fontFamily:'var(--mono)', fontSize:10, fontWeight:600, color:'var(--on-surface-v)', letterSpacing:'0.08em', textTransform:'uppercase' }}>
          {label}
        </p>
        <span style={{ fontSize:18 }}>{icon}</span>
      </div>
      <p style={{ fontFamily:'var(--mono)', fontSize:32, fontWeight:600, color:'var(--primary)', letterSpacing:'-0.04em', lineHeight:1 }}>
        {value}
      </p>
      <p style={{ fontSize:13, color:'var(--on-surface-v)', marginTop:9 }}>{sub}</p>
    </div>
  );
}

export default function Dashboard() {
  const [, navigate]            = useLocation();
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [loading, setLoading]   = useState(true);

  /* Filters */
  const [search, setSearch]   = useState('');
  const [fProp, setFProp]     = useState<PropType>('todos');
  const [fStatus, setFStatus] = useState('all');
  const [fDate, setFDate]     = useState('todos');
  const [fDateFrom, setFDateFrom] = useState('');
  const [fDateTo, setFDateTo]     = useState('');
  const [sortBy, setSortBy]   = useState<'date_desc'|'date_asc'|'value_desc'|'value_asc'>('date_desc');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await getMatriculaAnalyses(100, 0);
      setAnalyses((data || []).map(normalizeMatricula));
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const clearFilters = () => {
    setSearch(''); setFProp('todos'); setFStatus('all');
    setFDate('todos'); setFDateFrom(''); setFDateTo('');
  };

  const filtered = useMemo(() => {
    let r = [...analyses];

    // text search
    if (search) {
      const s = search.toLowerCase();
      r = r.filter(a => a.title.toLowerCase().includes(s) || a.location.toLowerCase().includes(s));
    }

    // property type
    if (fProp !== 'todos') {
      r = r.filter(a => matchesPropType(a.tipo_imovel, fProp));
    }

    // status
    if (fStatus !== 'all') r = r.filter(a => a.status === fStatus);

    // date preset
    const dateRange = DATE_RANGES.find(d => d.k === fDate);
    if (dateRange?.days !== null && dateRange?.days !== undefined) {
      const cutoff = new Date();
      cutoff.setHours(0, 0, 0, 0);
      if (dateRange.days > 0) cutoff.setDate(cutoff.getDate() - dateRange.days);
      r = r.filter(a => new Date(a.created_at) >= cutoff);
    }

    // custom date range
    if (fDateFrom) r = r.filter(a => new Date(a.created_at) >= new Date(fDateFrom));
    if (fDateTo)   r = r.filter(a => new Date(a.created_at) <= new Date(fDateTo + 'T23:59:59'));

    // sort
    r.sort((a, b) => {
      if (sortBy === 'date_desc') return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      if (sortBy === 'date_asc')  return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      if (sortBy === 'value_desc') return b.valor_mercado - a.valor_mercado;
      return a.valor_mercado - b.valor_mercado;
    });

    return r;
  }, [analyses, search, fProp, fStatus, fDate, fDateFrom, fDateTo, sortBy]);

  const total    = analyses.length;
  const done     = analyses.filter(a => a.status === 'concluida').length;
  const inProc   = analyses.filter(a => a.status === 'processando').length;
  const totalVal = analyses.filter(a => a.status === 'concluida').reduce((s, a) => s + a.valor_mercado, 0);

  const activeFilters = [
    search, fProp !== 'todos', fStatus !== 'all', fDate !== 'todos', fDateFrom, fDateTo,
  ].filter(Boolean).length;

  const STATUS_OPTS = [
    { k: 'all',         label: 'Todos status'  },
    { k: 'concluida',   label: 'Concluída'     },
    { k: 'processando', label: 'Processando'   },
    { k: 'erro',        label: 'Erro'          },
    { k: 'pendente',    label: 'Pendente'      },
  ];

  return (
    <DashboardLayout>
      {/* Page header */}
      <div className="k-page-hdr">
        <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', flexWrap:'wrap', gap:12 }}>
          <div>
            <p className="k-eyebrow">Painel de Controle</p>
            <h1 className="k-page-title">Visão Geral</h1>
            <p className="k-page-sub">Resumo de desempenho e atividades recentes</p>
          </div>
          <button onClick={load} className="k-btn k-btn-outline" style={{ height:34 }}>
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
              <path d="M11 6.5A4.5 4.5 0 1 1 6.5 2M11 2v4H7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Atualizar
          </button>
        </div>
      </div>

      <div className="k-content">
        {/* Stat cards */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))', gap:14, marginBottom:24 }}>
          <StatCard delay={1} icon="📊" label="Total de Análises"    value={String(total)} sub="todas as análises" />
          <StatCard delay={2} icon="✓"  label="Concluídas"           value={String(done)}  sub={`${total ? Math.round(done/total*100) : 0}% do total`} />
          <StatCard delay={3} icon="⟳"  label="Em Processamento"     value={String(inProc)} sub="aguardando resultado" />
          <StatCard delay={4} icon="💰" label="Valor Total Avaliado"
            value={done > 0 ? `R$ ${(totalVal/1e6).toFixed(1)}M` : '—'} sub="portfólio analisado" />
        </div>

        {/* Table card */}
        <div className="k-section k-anim k-anim-4">

          {/* ── Toolbar ── */}
          <div className="k-filter-bar">
            {/* Search */}
            <div style={{ position:'relative', flex:'1', minWidth:180, maxWidth:260 }}>
              <svg style={{ position:'absolute', left:10, top:'50%', transform:'translateY(-50%)', color:'var(--on-surface-v)' }} width="13" height="13" viewBox="0 0 14 14" fill="none">
                <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M9.5 9.5l2.5 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              <input className="k-input" style={{ paddingLeft:30, height:32 }}
                placeholder="Buscar análises..."
                value={search} onChange={e => setSearch(e.target.value)} />
            </div>

            <div className="k-divider" />

            {/* ── Property type pills ── */}
            <div style={{ display:'flex', gap:4 }}>
              {PROP_TYPES.map(p => (
                <button
                  key={p.k}
                  onClick={() => setFProp(p.k)}
                  className={`k-btn k-btn-sm ${fProp === p.k ? 'k-btn-filter-on' : 'k-btn-outline'}`}
                >
                  {p.label}
                </button>
              ))}
            </div>

            <div className="k-divider" />

            {/* Status */}
            <select className="k-select" value={fStatus} onChange={e => setFStatus(e.target.value)}>
              {STATUS_OPTS.map(o => <option key={o.k} value={o.k}>{o.label}</option>)}
            </select>

            {/* Date preset */}
            <select className="k-select" value={fDate} onChange={e => setFDate(e.target.value)}>
              {DATE_RANGES.map(d => <option key={d.k} value={d.k}>{d.label}</option>)}
            </select>

            {/* Advanced toggle */}
            <button
              onClick={() => setShowAdvanced(v => !v)}
              className={`k-btn k-btn-sm ${showAdvanced ? 'k-btn-filter-on' : 'k-btn-outline'}`}
              style={{ gap:4 }}
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M1 3h10M3 6h6M5 9h2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              +
              {activeFilters > 0 && (
                <span style={{ background:'var(--gold)', color:'#fff', borderRadius:99, fontSize:10, padding:'1px 5px' }}>
                  {activeFilters}
                </span>
              )}
            </button>

            <div className="k-divider" />

            {/* Sort */}
            <select className="k-select" value={sortBy} onChange={e => setSortBy(e.target.value as any)}>
              <option value="date_desc">Mais recentes</option>
              <option value="date_asc">Mais antigas</option>
              <option value="value_desc">Maior valor</option>
              <option value="value_asc">Menor valor</option>
            </select>

            {activeFilters > 0 && (
              <button onClick={clearFilters} className="k-btn k-btn-ghost k-btn-sm">
                Limpar
              </button>
            )}

            <button onClick={load} className="k-btn k-btn-ghost k-btn-sm" style={{ marginLeft:'auto' }}>
              <svg width="12" height="12" viewBox="0 0 13 13" fill="none">
                <path d="M11 6.5A4.5 4.5 0 1 1 6.5 2M11 2v4H7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>

          {/* Advanced date panel */}
          {showAdvanced && (
            <div style={{
              padding:'12px 18px', borderBottom:'1px solid rgba(199,198,202,0.2)',
              background:'rgba(243,243,245,0.35)',
              display:'flex', alignItems:'center', gap:10, flexWrap:'wrap',
            }}>
              <span style={{ fontFamily:'var(--mono)', fontSize:11, color:'var(--on-surface-v)', letterSpacing:'0.06em', textTransform:'uppercase' }}>
                Período personalizado:
              </span>
              <div style={{ display:'flex', alignItems:'center', gap:7 }}>
                <label style={{ fontFamily:'var(--mono)', fontSize:11, color:'var(--on-surface-v)' }}>De</label>
                <input type="date" className="k-input" style={{ width:150, height:30, fontSize:12 }}
                  value={fDateFrom} onChange={e => setFDateFrom(e.target.value)} />
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:7 }}>
                <label style={{ fontFamily:'var(--mono)', fontSize:11, color:'var(--on-surface-v)' }}>Até</label>
                <input type="date" className="k-input" style={{ width:150, height:30, fontSize:12 }}
                  value={fDateTo} onChange={e => setFDateTo(e.target.value)} />
              </div>
              {(fDateFrom || fDateTo) && (
                <button onClick={() => { setFDateFrom(''); setFDateTo(''); }} className="k-btn k-btn-ghost k-btn-sm">
                  Limpar datas
                </button>
              )}
            </div>
          )}

          {/* Table */}
          {loading ? (
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'72px 0', gap:14 }}>
              <div className="k-spinner" />
              <p style={{ fontSize:14, color:'var(--on-surface-v)' }}>Carregando análises...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'72px 0', gap:8 }}>
              <span style={{ fontSize:40 }}>📋</span>
              <p style={{ fontSize:15, fontWeight:500, color:'var(--on-surface-v)', marginTop:8 }}>
                {analyses.length === 0 ? 'Nenhuma análise encontrada' : 'Nenhum resultado para os filtros aplicados'}
              </p>
              {activeFilters > 0 && (
                <button onClick={clearFilters} className="k-btn k-btn-outline" style={{ marginTop:8 }}>
                  Limpar todos os filtros
                </button>
              )}
            </div>
          ) : (
            <div style={{ overflowX:'auto' }}>
              <table className="k-table">
                <thead>
                  <tr>
                    <th>Identificação</th>
                    <th>Localização</th>
                    <th>Tipo</th>
                    <th style={{ textAlign:'right' }}>Valor de Mercado</th>
                    <th style={{ textAlign:'center', width:110 }}>Status</th>
                    <th style={{ width:90 }}>Data</th>
                    <th style={{ width:36 }} />
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(a => {
                    const sc = STATUS_CFG[a.status] || { label: a.status, cls: 'k-badge-gray' };
                    return (
                      <tr key={a.id} className="k-table-row" onClick={() => navigate('/matricula')}>
                        <td>
                          <span style={{ fontWeight:600, display:'block', maxWidth:220, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                            {a.title}
                          </span>
                        </td>
                        <td>
                          <span style={{ fontSize:12, color:'var(--on-surface-v)', display:'block', maxWidth:200, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
                            {a.location}
                          </span>
                        </td>
                        <td>
                          <span style={{ fontSize:12, color:'var(--on-surface-v)' }}>
                            {a.raw.tipo_imovel || '—'}
                          </span>
                        </td>
                        <td style={{ textAlign:'right', fontFamily:'var(--mono)', fontWeight:600, fontSize:13,
                          color: a.valor_mercado > 0 ? 'var(--gold)' : 'var(--outline)' }}>
                          {a.valor_mercado > 0 ? formatCurrency(a.valor_mercado) : '—'}
                        </td>
                        <td style={{ textAlign:'center' }}>
                          <span className={`k-badge ${sc.cls}`}>{sc.label}</span>
                        </td>
                        <td style={{ fontSize:12, color:'var(--outline)', fontFamily:'var(--mono)' }}>
                          {new Date(a.created_at).toLocaleDateString('pt-BR', { day:'2-digit', month:'2-digit', year:'2-digit' })}
                        </td>
                        <td style={{ color:'var(--outline)' }}>
                          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                            <path d="M4.5 3l4 3.5-4 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Footer count */}
          {!loading && filtered.length > 0 && (
            <div style={{ padding:'10px 18px', borderTop:'1px solid rgba(199,198,202,0.2)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <p style={{ fontFamily:'var(--mono)', fontSize:11, color:'var(--outline)' }}>
                {filtered.length} de {analyses.length} análises
              </p>
              {activeFilters > 0 && (
                <button onClick={clearFilters} className="k-btn k-btn-ghost k-btn-sm">
                  Limpar filtros
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
