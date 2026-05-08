/**
 * PropertyDetail Page
 * Modernismo Corporativo: Blocos bem definidos, hierarquia clara, cores semânticas
 * Implementa todos os 10 blocos especificados no briefing + Abas de conteúdo múltiplo
 */

import { useParams, useLocation } from 'wouter';
import {
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  XCircle,
  TrendingUp,
  DollarSign,
  Home,
  FileText,
  AlertTriangle,
  CheckSquare,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import DashboardLayout from '@/components/DashboardLayout';
import AnalysisTabs from '@/components/AnalysisTabs';
import { useAnalysis } from '@/contexts/AnalysisContext';
import { mockProperties, statusConfig, riskConfig, confidenceConfig } from '@/lib/mockData';
import { cn } from '@/lib/utils';

const statusIcons = {
  approved: CheckCircle2,
  review: AlertCircle,
  rejected: XCircle,
};

export default function PropertyDetail() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const { currentAnalysis } = useAnalysis();

  let property = mockProperties.find((p) => p.id === id);

  // Se temos dados da análise no contexto, usar eles
  if (currentAnalysis && currentAnalysis.analysisId === id) {
    property = {
      id: currentAnalysis.analysisId,
      address: currentAnalysis.extractedData.address || 'Endereço não disponível',
      marketValue: currentAnalysis.extractedData.estimatedMarketValue || 0,
      purchaseValue: currentAnalysis.extractedData.estimatedMarketValue || 0,
      area: currentAnalysis.extractedData.area || 0,
      bedrooms: currentAnalysis.extractedData.bedrooms || 0,
      bathrooms: currentAnalysis.extractedData.bathrooms || 0,
      parking: currentAnalysis.extractedData.parking || 0,
      neighborhood: 'Bairro',
      city: 'São Paulo',
      status: 'review' as const,
      riskLevel: 'low' as const,
      confidence: 'high' as const,
      score: 85,
      roi: 12.5,
      discount: 0,
      estimatedProfit: 0,
      condoFee: 0,
      propertyTax: 0,
      propertyCondition: 'Bom estado',
      executiveSummary: 'Análise realizada via n8n',
      totalCosts: 0,
      grossProfit: 0,
      netProfit: 0,
      negotiatedValue: 0,
      installments: 0,
      totalOperation: 0,
      commercialRisk: 'Baixo',
      operationalRisk: 'Mínimo',
      documentalRisk: 'Baixo',
      comparables: currentAnalysis.comparables || [],
      nextSteps: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  if (!property) {
    return (
      <DashboardLayout>
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <p className="text-gray-500">Imóvel não encontrado</p>
            <Button onClick={() => navigate('/')} className="mt-4">
              Voltar ao Dashboard
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  const StatusIcon = statusIcons[property.status];
  const statusCfg = statusConfig[property.status];
  const riskCfg = riskConfig[property.riskLevel];
  const confidenceCfg = confidenceConfig[property.confidence];

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-gradient-to-br from-white via-gray-50 to-gray-100">
        {/* Header */}
        <div className="border-b border-gray-200 bg-white px-8 py-6">
          <div className="mx-auto max-w-7xl">
            <button
              onClick={() => navigate('/')}
              className="mb-4 flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar ao Dashboard
            </button>
            <h1 className="text-3xl font-bold text-gray-900">{property.address}</h1>
            <p className="mt-1 text-gray-600">
              {property.neighborhood}, {property.city}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="mx-auto max-w-7xl px-8 py-12">
          {/* BLOCO 1: Decisão Rápida */}
          <div className="mb-8 rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-gray-600">CLASSIFICAÇÃO</h2>
                <p className="mt-2 text-2xl font-bold text-gray-900">
                  {property.status === 'approved'
                    ? 'Excelente Oportunidade'
                    : property.status === 'review'
                      ? 'Boa Oportunidade'
                      : 'Não Recomendado'}
                </p>
              </div>
              <div
                className={cn(
                  'flex h-16 w-16 items-center justify-center rounded-full',
                  property.status === 'approved'
                    ? 'bg-green-100'
                    : property.status === 'review'
                      ? 'bg-yellow-100'
                      : 'bg-red-100'
                )}
              >
                <StatusIcon
                  className="h-8 w-8"
                  style={{
                    color:
                      property.status === 'approved'
                        ? '#10B981'
                        : property.status === 'review'
                          ? '#F59E0B'
                          : '#EF4444',
                  }}
                />
              </div>
            </div>
          </div>

          {/* BLOCO 2: Métricas Principais */}
          <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-5">
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <p className="text-xs font-semibold text-gray-600">VALOR DE COMPRA</p>
              <p className="mt-3 text-2xl font-bold text-gray-900">
                R$ {property.purchaseValue.toLocaleString('pt-BR')}
              </p>
            </div>
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <p className="text-xs font-semibold text-gray-600">VALOR MERCADO</p>
              <p className="mt-3 text-2xl font-bold text-gray-900">
                R$ {property.marketValue.toLocaleString('pt-BR')}
              </p>
            </div>
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <p className="text-xs font-semibold text-gray-600">DESÁGIO</p>
              <p
                className={cn(
                  'mt-3 text-2xl font-bold',
                  property.discount > 0 ? 'text-green-600' : 'text-red-600'
                )}
              >
                {property.discount > 0 ? '+' : ''}{property.discount.toFixed(1)}%
              </p>
            </div>
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <p className="text-xs font-semibold text-gray-600">LUCRO ESTIMADO</p>
              <p
                className={cn(
                  'mt-3 text-2xl font-bold',
                  property.estimatedProfit > 0 ? 'text-green-600' : 'text-red-600'
                )}
              >
                R$ {property.estimatedProfit.toLocaleString('pt-BR')}
              </p>
            </div>
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <p className="text-xs font-semibold text-gray-600">ROI</p>
              <p
                className={cn(
                  'mt-3 text-2xl font-bold',
                  property.roi > 0 ? 'text-green-600' : 'text-red-600'
                )}
              >
                {property.roi > 0 ? '+' : ''}{property.roi.toFixed(1)}%
              </p>
            </div>
          </div>

          {/* BLOCO 3: Resumo Executivo */}
          <div className="mb-8 rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900">RESUMO EXECUTIVO</h3>
            <p className="mt-4 text-gray-700 leading-relaxed">{property.executiveSummary}</p>
          </div>

          {/* BLOCO 4: Dados do Imóvel */}
          <div className="mb-8 rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900">DADOS DO IMÓVEL</h3>
            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
              <div>
                <p className="text-xs font-semibold text-gray-600">ENDEREÇO</p>
                <p className="mt-2 text-sm text-gray-900">{property.address}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-600">METRAGEM</p>
                <p className="mt-2 text-sm text-gray-900">{property.area} m²</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-600">QUARTOS</p>
                <p className="mt-2 text-sm text-gray-900">{property.bedrooms}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-600">BANHEIROS</p>
                <p className="mt-2 text-sm text-gray-900">{property.bathrooms}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-600">VAGAS</p>
                <p className="mt-2 text-sm text-gray-900">{property.parking}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-600">CONDOMÍNIO</p>
                <p className="mt-2 text-sm text-gray-900">R$ {property.condoFee.toLocaleString('pt-BR')}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-600">IPTU</p>
                <p className="mt-2 text-sm text-gray-900">R$ {property.propertyTax.toLocaleString('pt-BR')}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-600">ESTADO</p>
                <p className="mt-2 text-sm text-gray-900">{property.propertyCondition}</p>
              </div>
            </div>
          </div>

          {/* BLOCO 5: Comparáveis de Mercado */}
          <div className="mb-8 rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900">COMPARÁVEIS DE MERCADO</h3>
            <div className="mt-6 overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">PREÇO</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">METRAGEM</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">LOCALIZAÇÃO</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">PREÇO/m²</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600">LINK DO IMÓVEL</th>
                  </tr>
                </thead>
                <tbody>
                  {property.comparables.map((comp) => (
                    <tr key={comp.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">
                        R$ {comp.price.toLocaleString('pt-BR')}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">{comp.area} m²</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{comp.location}</td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">
                        R$ {(comp.price / comp.area).toLocaleString('pt-BR')}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <a
                          href={comp.propertyUrl || '#'}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 rounded-lg bg-blue-50 px-3 py-2 text-blue-600 hover:bg-blue-100 transition-colors"
                        >
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                          Ver Imóvel
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* BLOCO 6: Análise Financeira */}
          <div className="mb-8 rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900">ANÁLISE FINANCEIRA</h3>
            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                <span className="text-sm text-gray-600">Valor Negociado</span>
                <span className="font-medium text-gray-900">
                  R$ {property.negotiatedValue.toLocaleString('pt-BR')}
                </span>
              </div>
              <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                <span className="text-sm text-gray-600">Custos Totais</span>
                <span className="font-medium text-gray-900">
                  R$ {property.totalCosts.toLocaleString('pt-BR')}
                </span>
              </div>
              <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                <span className="text-sm text-gray-600">Parcelamento</span>
                <span className="font-medium text-gray-900">{property.installments}x</span>
              </div>
              <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                <span className="text-sm text-gray-600">Total da Operação</span>
                <span className="font-medium text-gray-900">
                  R$ {property.totalOperation.toLocaleString('pt-BR')}
                </span>
              </div>
              <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                <span className="text-sm text-gray-600">Lucro Bruto</span>
                <span className="font-medium text-green-600">
                  R$ {property.grossProfit.toLocaleString('pt-BR')}
                </span>
              </div>
              <div className="flex items-center justify-between pt-4">
                <span className="text-sm font-semibold text-gray-900">Lucro Líquido</span>
                <span className="text-lg font-bold text-green-600">
                  R$ {property.netProfit.toLocaleString('pt-BR')}
                </span>
              </div>
            </div>
          </div>

          {/* BLOCO 7: Análise de Risco */}
          <div className="mb-8 rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900">ANÁLISE DE RISCO</h3>
            <div className="mt-6 space-y-6">
              <div>
                <p className="text-sm font-semibold text-gray-900">Comercial</p>
                <p className="mt-2 text-sm text-gray-600">{property.commercialRisk}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">Operacional</p>
                <p className="mt-2 text-sm text-gray-600">{property.operationalRisk}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">Documental</p>
                <p className="mt-2 text-sm text-gray-600">{property.documentalRisk}</p>
              </div>
            </div>
          </div>

          {/* BLOCO 8: Score e Confiança */}
          <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
              <h3 className="text-sm font-semibold text-gray-600">SCORE GERAL</h3>
              <div className="mt-6 flex items-center gap-6">
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-green-100 to-green-50 border-4 border-green-500">
                  <span className="text-4xl font-bold text-green-600">{property.score}</span>
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-600">ESCALA 0-100</p>
                  <p className="mt-2 text-sm text-gray-600">
                    {property.score >= 80
                      ? 'Excelente'
                      : property.score >= 60
                        ? 'Bom'
                        : 'Revisar'}
                  </p>
                </div>
              </div>
            </div>
            <div className="rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
              <h3 className="text-sm font-semibold text-gray-600">NÍVEL DE CONFIANÇA</h3>
              <div className="mt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Risco Geral</span>
                  <span className={cn('text-sm font-semibold', riskCfg.color)}>
                    {riskCfg.label}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Confiança Análise</span>
                  <span className={cn('text-sm font-semibold', confidenceCfg.color)}>
                    {confidenceCfg.label}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* BLOCO 9: Próximos Passos */}
          <div className="mb-8 rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900">PRÓXIMOS PASSOS</h3>
            <div className="mt-6 space-y-3">
              {property.nextSteps.map((step) => (
                <div key={step.id} className="flex items-center gap-3">
                  <div
                    className={cn(
                      'flex h-6 w-6 items-center justify-center rounded-full',
                      step.completed ? 'bg-green-100' : 'bg-gray-100'
                    )}
                  >
                    <CheckSquare
                      className="h-4 w-4"
                      style={{ color: step.completed ? '#10B981' : '#9CA3AF' }}
                    />
                  </div>
                  <span
                    className={cn(
                      'text-sm',
                      step.completed ? 'text-gray-500 line-through' : 'text-gray-900'
                    )}
                  >
                    {step.title}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* BLOCO 10: Ações */}
          <div className="mb-12 flex gap-4">
            <Button className="flex-1 bg-green-600 hover:bg-green-700">
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Aprovar
            </Button>
            <Button variant="outline" className="flex-1">
              <AlertCircle className="mr-2 h-4 w-4" />
              Revisar
            </Button>
            <Button variant="destructive" className="flex-1">
              <XCircle className="mr-2 h-4 w-4" />
              Rejeitar
            </Button>
          </div>

          {/* ABAS: Conteúdo Múltiplo */}
          <div className="mb-8">
            <h2 className="mb-6 text-2xl font-bold text-gray-900">Conteúdo da Análise</h2>
            <AnalysisTabs propertyId={property.id} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
