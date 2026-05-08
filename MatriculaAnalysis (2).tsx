/**
 * Mock Data for EQR Real Estate Investment Analyzer
 * Estrutura preparada para integração futura com APIs
 */

export interface Property {
  id: string;
  address: string;
  city: string;
  neighborhood: string;
  purchaseValue: number;
  marketValue: number;
  discount: number;
  estimatedProfit: number;
  roi: number;
  score: number;
  status: 'approved' | 'review' | 'rejected';
  bedrooms: number;
  bathrooms: number;
  area: number;
  parking: number;
  condoFee: number;
  propertyTax: number;
  propertyCondition: string;
  executiveSummary: string;
  riskLevel: 'low' | 'medium' | 'high';
  confidence: 'high' | 'medium' | 'low';
  totalCosts: number;
  grossProfit: number;
  netProfit: number;
  negotiatedValue: number;
  installments: number;
  totalOperation: number;
  commercialRisk: string;
  operationalRisk: string;
  documentalRisk: string;
  comparables: Comparable[];
  nextSteps: ChecklistItem[];
  createdAt: string;
  updatedAt: string;
}

export interface Comparable {
  id: string;
  price: number;
  area: number;
  location: string;
  link?: string;
  propertyUrl?: string;
}

export interface ChecklistItem {
  id: string;
  title: string;
  completed: boolean;
}

export const mockProperties: Property[] = [
  {
    id: '1',
    address: 'Rua das Flores, 123',
    city: 'São Paulo',
    neighborhood: 'Vila Mariana',
    purchaseValue: 450000,
    marketValue: 520000,
    discount: 13.5,
    estimatedProfit: 70000,
    roi: 15.6,
    score: 85,
    status: 'approved',
    bedrooms: 3,
    bathrooms: 2,
    area: 120,
    parking: 2,
    condoFee: 800,
    propertyTax: 150,
    propertyCondition: 'Bom estado',
    executiveSummary: 'Excelente oportunidade em região valorizada. Imóvel bem localizado com potencial de apreciação. Deságio significativo em relação ao mercado.',
    riskLevel: 'low',
    confidence: 'high',
    totalCosts: 25000,
    grossProfit: 70000,
    netProfit: 45000,
    negotiatedValue: 450000,
    installments: 12,
    totalOperation: 475000,
    commercialRisk: 'Baixo - Região em expansão',
    operationalRisk: 'Mínimo - Imóvel pronto para ocupação',
    documentalRisk: 'Baixo - Documentação completa',
    comparables: [
      { id: 'c1', price: 510000, area: 118, location: 'Vila Mariana', propertyUrl: 'https://www.imoveisweb.com.br/imovel/comparavel1' },
      { id: 'c2', price: 530000, area: 125, location: 'Vila Mariana', propertyUrl: 'https://www.imoveisweb.com.br/imovel/comparavel2' },
      { id: 'c3', price: 495000, area: 115, location: 'Paraíso', propertyUrl: 'https://www.imoveisweb.com.br/imovel/comparavel3' },
    ],
    nextSteps: [
      { id: 's1', title: 'Validar matrícula', completed: true },
      { id: 's2', title: 'Verificar débitos', completed: true },
      { id: 's3', title: 'Fazer vistoria', completed: false },
      { id: 's4', title: 'Negociar', completed: false },
    ],
    createdAt: '2026-04-15',
    updatedAt: '2026-05-01',
  },
  {
    id: '2',
    address: 'Avenida Paulista, 1000',
    city: 'São Paulo',
    neighborhood: 'Bela Vista',
    purchaseValue: 850000,
    marketValue: 920000,
    discount: 7.6,
    estimatedProfit: 70000,
    roi: 8.2,
    score: 72,
    status: 'review',
    bedrooms: 2,
    bathrooms: 2,
    area: 95,
    parking: 1,
    condoFee: 1200,
    propertyTax: 200,
    propertyCondition: 'Necessita reforma',
    executiveSummary: 'Oportunidade em localização premium. Requer investimento em reforma. Potencial de valorização significativa após melhorias.',
    riskLevel: 'medium',
    confidence: 'medium',
    totalCosts: 45000,
    grossProfit: 70000,
    netProfit: 25000,
    negotiatedValue: 850000,
    installments: 24,
    totalOperation: 895000,
    commercialRisk: 'Médio - Mercado competitivo',
    operationalRisk: 'Médio - Reforma necessária',
    documentalRisk: 'Baixo - Documentação em ordem',
    comparables: [
      { id: 'c4', price: 900000, area: 92, location: 'Bela Vista', propertyUrl: 'https://www.imoveisweb.com.br/imovel/comparavel4' },
      { id: 'c5', price: 940000, area: 98, location: 'Bela Vista', propertyUrl: 'https://www.imoveisweb.com.br/imovel/comparavel5' },
      { id: 'c6', price: 880000, area: 90, location: 'Consolação', propertyUrl: 'https://www.imoveisweb.com.br/imovel/comparavel6' },
    ],
    nextSteps: [
      { id: 's5', title: 'Validar matrícula', completed: false },
      { id: 's6', title: 'Verificar débitos', completed: false },
      { id: 's7', title: 'Fazer vistoria', completed: false },
      { id: 's8', title: 'Negociar', completed: false },
    ],
    createdAt: '2026-04-20',
    updatedAt: '2026-05-02',
  },
  {
    id: '3',
    address: 'Rua Oscar Freire, 500',
    city: 'São Paulo',
    neighborhood: 'Pinheiros',
    purchaseValue: 620000,
    marketValue: 580000,
    discount: -6.9,
    estimatedProfit: -40000,
    roi: -6.5,
    score: 35,
    status: 'rejected',
    bedrooms: 2,
    bathrooms: 1,
    area: 85,
    parking: 0,
    condoFee: 950,
    propertyTax: 180,
    propertyCondition: 'Precário',
    executiveSummary: 'Não recomendado. Preço acima do mercado. Condições estruturais comprometidas. Alto risco de desvalorização.',
    riskLevel: 'high',
    confidence: 'high',
    totalCosts: 35000,
    grossProfit: -40000,
    netProfit: -75000,
    negotiatedValue: 620000,
    installments: 36,
    totalOperation: 655000,
    commercialRisk: 'Alto - Preço acima da média',
    operationalRisk: 'Alto - Estrutura comprometida',
    documentalRisk: 'Médio - Alguns débitos pendentes',
    comparables: [
      { id: 'c7', price: 550000, area: 82, location: 'Pinheiros', propertyUrl: 'https://www.imoveisweb.com.br/imovel/comparavel7' },
      { id: 'c8', price: 570000, area: 88, location: 'Pinheiros', propertyUrl: 'https://www.imoveisweb.com.br/imovel/comparavel8' },
      { id: 'c9', price: 560000, area: 85, location: 'Jardins', propertyUrl: 'https://www.imoveisweb.com.br/imovel/comparavel9' },
    ],
    nextSteps: [
      { id: 's9', title: 'Validar matrícula', completed: false },
      { id: 's10', title: 'Verificar débitos', completed: false },
      { id: 's11', title: 'Fazer vistoria', completed: false },
      { id: 's12', title: 'Negociar', completed: false },
    ],
    createdAt: '2026-04-25',
    updatedAt: '2026-05-03',
  },
  {
    id: '4',
    address: 'Rua Augusta, 800',
    city: 'São Paulo',
    neighborhood: 'Centro',
    purchaseValue: 380000,
    marketValue: 450000,
    discount: 15.6,
    estimatedProfit: 70000,
    roi: 18.4,
    score: 88,
    status: 'approved',
    bedrooms: 2,
    bathrooms: 1,
    area: 78,
    parking: 1,
    condoFee: 600,
    propertyTax: 120,
    propertyCondition: 'Excelente',
    executiveSummary: 'Excelente oportunidade. Deságio significativo. Localização estratégica com alta demanda. ROI atrativo.',
    riskLevel: 'low',
    confidence: 'high',
    totalCosts: 18000,
    grossProfit: 70000,
    netProfit: 52000,
    negotiatedValue: 380000,
    installments: 12,
    totalOperation: 398000,
    commercialRisk: 'Baixo - Região em alta demanda',
    operationalRisk: 'Mínimo - Pronto para ocupação',
    documentalRisk: 'Baixo - Documentação perfeita',
    comparables: [
      { id: 'c10', price: 440000, area: 76, location: 'Centro', propertyUrl: 'https://www.imoveisweb.com.br/imovel/comparavel10' },
      { id: 'c11', price: 460000, area: 80, location: 'Centro', propertyUrl: 'https://www.imoveisweb.com.br/imovel/comparavel11' },
      { id: 'c12', price: 430000, area: 75, location: 'República', propertyUrl: 'https://www.imoveisweb.com.br/imovel/comparavel12' },
    ],
    nextSteps: [
      { id: 's13', title: 'Validar matrícula', completed: true },
      { id: 's14', title: 'Verificar débitos', completed: true },
      { id: 's15', title: 'Fazer vistoria', completed: true },
      { id: 's16', title: 'Negociar', completed: true },
    ],
    createdAt: '2026-04-10',
    updatedAt: '2026-04-28',
  },
];

export const dashboardStats = {
  totalAnalyzed: mockProperties.length,
  goodOpportunities: mockProperties.filter(p => p.status === 'approved').length,
  totalPotentialProfit: mockProperties.reduce((sum, p) => sum + Math.max(0, p.estimatedProfit), 0),
  averageROI: (mockProperties.reduce((sum, p) => sum + p.roi, 0) / mockProperties.length).toFixed(1),
};

export const statusConfig = {
  approved: {
    label: 'Aprovado',
    color: 'bg-green-100 text-green-800 border-green-300',
    badge: 'bg-green-500',
    icon: 'CheckCircle2',
  },
  review: {
    label: 'Revisar',
    color: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    badge: 'bg-yellow-500',
    icon: 'AlertCircle',
  },
  rejected: {
    label: 'Rejeitado',
    color: 'bg-red-100 text-red-800 border-red-300',
    badge: 'bg-red-500',
    icon: 'XCircle',
  },
};

export const riskConfig = {
  low: {
    label: 'Baixo',
    color: 'text-green-600',
    bg: 'bg-green-50',
  },
  medium: {
    label: 'Médio',
    color: 'text-yellow-600',
    bg: 'bg-yellow-50',
  },
  high: {
    label: 'Alto',
    color: 'text-red-600',
    bg: 'bg-red-50',
  },
};

export const confidenceConfig = {
  high: {
    label: 'Alta',
    color: 'text-green-600',
  },
  medium: {
    label: 'Média',
    color: 'text-yellow-600',
  },
  low: {
    label: 'Baixa',
    color: 'text-red-600',
  },
};
