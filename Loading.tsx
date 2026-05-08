/**
 * Matrícula Analysis Service
 * Integração com n8n para análise de matrícula de imóvel via PDF
 */

export interface ImovelAnalisado {
  matricula: string;
  cidade: string;
  estado: string;
  bairro_ou_condominio: string;
  rua: string;
  tipo_imovel: string;
  area_m2: number;
  dormitorios: number;
}

export interface ResultadoMercado {
  quantidade_comparaveis_usados: number;
  media_valor_m2: number;
  mediana_valor_m2: number;
  valor_mercado_estimado: number;
  valor_ultima_transacao: number;
  diferenca_reais: number;
  percentual_vs_mercado: number;
  status_preco: string;
  confianca_calculo: 'alta' | 'media' | 'baixa';
  observacoes: string[];
}

export interface MatriculaResumo {
  proprietario_atual: string;
  tem_alienacao_fiduciaria_ativa: boolean;
  tem_hipoteca_ativa: boolean;
  alertas: string[];
  resumo: string;
}

export interface Comparavel {
  titulo: string;
  preco: number;
  area_m2: number;
  valor_m2: number;
  quartos: number;
  banheiros: number;
  vagas: number;
  bairro: string;
  cidade: string;
  rua: string;
  url: string;
}

export interface MatriculaAnalysisResult {
  sucesso: boolean;
  imovel_analisado: ImovelAnalisado;
  resultado_mercado: ResultadoMercado;
  matricula_resumo: MatriculaResumo;
  comparaveis: Comparavel[];
  erro?: string;
}

/**
 * Envia PDF da matrícula para análise no n8n
 * @param file - Arquivo PDF da matrícula
 * @returns Resultado da análise com dados extraídos e comparáveis
 */
export async function sendMatriculaForAnalysis(
  file: File
): Promise<MatriculaAnalysisResult> {
  const webhookUrl = import.meta.env.VITE_N8N_MATRICULA_WEBHOOK || 
    'https://n8n.esence.expert/webhook/analisar-matricula';

  try {
    const formData = new FormData();
    formData.append('matricula', file);

    const response = await fetch(webhookUrl, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Webhook error: ${response.statusText}`);
    }

    const result: MatriculaAnalysisResult = await response.json();
    return result;
  } catch (error) {
    console.error('Matrícula analysis error:', error);
    return {
      sucesso: false,
      imovel_analisado: {
        matricula: '',
        cidade: '',
        estado: '',
        bairro_ou_condominio: '',
        rua: '',
        tipo_imovel: '',
        area_m2: 0,
        dormitorios: 0,
      },
      resultado_mercado: {
        quantidade_comparaveis_usados: 0,
        media_valor_m2: 0,
        mediana_valor_m2: 0,
        valor_mercado_estimado: 0,
        valor_ultima_transacao: 0,
        diferenca_reais: 0,
        percentual_vs_mercado: 0,
        status_preco: '',
        confianca_calculo: 'baixa',
        observacoes: [],
      },
      matricula_resumo: {
        proprietario_atual: '',
        tem_alienacao_fiduciaria_ativa: false,
        tem_hipoteca_ativa: false,
        alertas: [],
        resumo: '',
      },
      comparaveis: [],
      erro: error instanceof Error ? error.message : 'Erro desconhecido',
    };
  }
}

/**
 * Formata valor em moeda brasileira
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

/**
 * Formata área em m²
 */
export function formatArea(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value) + ' m²';
}

/**
 * Formata percentual
 */
export function formatPercentage(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value) + '%';
}
