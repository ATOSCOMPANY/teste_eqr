/**
 * Webhook Service
 * Integração com n8n para automação de análise de imóveis
 * Envia dados de análise e recebe comparáveis processados
 */

export interface AnalysisData {
  propertyLinks: Array<{
    url: string;
    title: string;
  }>;
  images: Array<{
    name: string;
    size: number;
  }>;
  audio: Array<{
    name: string;
    size: number;
  }>;
  documents: Array<{
    name: string;
    size: number;
  }>;
  spreadsheets: Array<{
    name: string;
    size: number;
  }>;
  observations: string;
  timestamp: string;
}

export interface ComparableResult {
  id: string;
  price: number;
  area: number;
  location: string;
  propertyUrl: string;
  similarity: number; // Percentual de similaridade (0-100)
}

export interface AnalysisResult {
  success: boolean;
  analysisId: string;
  extractedData: {
    address?: string;
    bedrooms?: number;
    bathrooms?: number;
    area?: number;
    parking?: number;
    estimatedMarketValue?: number;
    characteristics: string[];
  };
  comparables: ComparableResult[];
  message?: string;
  error?: string;
}

/**
 * Envia dados de análise para o n8n webhook
 * @param data - Dados da análise do imóvel
 * @returns Resultado da análise com comparáveis
 */
export async function sendAnalysisToN8n(
  data: AnalysisData
): Promise<AnalysisResult> {
  const webhookUrl = 'https://n8n.esence.expert/webhook/eqr';
  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        timestamp: new Date().toISOString(),
        source: 'eqr-analyzer',
        data: {
          propertyLinks: data.propertyLinks,
          imagesCount: data.images.length,
          audioCount: data.audio.length,
          documentsCount: data.documents.length,
          spreadsheetsCount: data.spreadsheets.length,
          observations: data.observations,
          files: {
            images: data.images,
            audio: data.audio,
            documents: data.documents,
            spreadsheets: data.spreadsheets,
          },
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Webhook error: ${response.statusText}`);
    }

    const result: AnalysisResult = await response.json();
    return result;
  } catch (error) {
    console.error('Webhook error:', error);
    return {
      success: false,
      analysisId: '',
      extractedData: {
        characteristics: [],
      },
      comparables: [],
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Simula resposta do n8n para testes (modo desenvolvimento)
 * Remove quando integrar com n8n real
 */
export function simulateN8nResponse(data: AnalysisData): AnalysisResult {
  return {
    success: true,
    analysisId: `analysis_${Date.now()}`,
    extractedData: {
      address: 'Endereço extraído do primeiro link',
      bedrooms: 3,
      bathrooms: 2,
      area: 120,
      parking: 2,
      estimatedMarketValue: 520000,
      characteristics: [
        'Bem localizado',
        'Região em expansão',
        'Próximo a transporte',
        'Bom estado de conservação',
      ],
    },
    comparables: [
      {
        id: 'comp_1',
        price: 510000,
        area: 118,
        location: 'Vila Mariana',
        propertyUrl: 'https://www.imoveisweb.com.br/imovel/comp1',
        similarity: 95,
      },
      {
        id: 'comp_2',
        price: 530000,
        area: 125,
        location: 'Vila Mariana',
        propertyUrl: 'https://www.imoveisweb.com.br/imovel/comp2',
        similarity: 92,
      },
      {
        id: 'comp_3',
        price: 495000,
        area: 115,
        location: 'Paraíso',
        propertyUrl: 'https://www.imoveisweb.com.br/imovel/comp3',
        similarity: 88,
      },
      {
        id: 'comp_4',
        price: 525000,
        area: 122,
        location: 'Vila Mariana',
        propertyUrl: 'https://www.imoveisweb.com.br/imovel/comp4',
        similarity: 90,
      },
      {
        id: 'comp_5',
        price: 515000,
        area: 120,
        location: 'Vila Mariana',
        propertyUrl: 'https://www.imoveisweb.com.br/imovel/comp5',
        similarity: 93,
      },
    ],
  };
}
