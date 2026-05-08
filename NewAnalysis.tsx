/**
 * Supabase Client Configuration
 * Inicializa cliente Supabase para persistência de dados
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://amfirkqtyimdgyiozxvw.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFtZmlya3F0eWltZGd5aW96eHZ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc5OTczODAsImV4cCI6MjA5MzU3MzM4MH0.S7TceHMsFZ2E4D9hbLC-yajyObP5rsWlQA8XGWGqLr0';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Tipos de dados para análises de matrícula
 */
export interface MatriculaAnalysisRecord {
  id: string;
  created_at: string;
  updated_at: string;
  status: 'pendente' | 'processando' | 'concluida' | 'erro';
  arquivo_nome: string;
  
  // Dados extraídos
  matricula: string;
  cidade: string;
  estado: string;
  bairro_ou_condominio: string;
  rua: string;
  tipo_imovel: string;
  area_m2: number;
  dormitorios: number;
  
  // Resultado de mercado
  valor_mercado_estimado: number;
  media_valor_m2: number;
  mediana_valor_m2: number;
  valor_ultima_transacao: number;
  diferenca_reais: number;
  percentual_vs_mercado: number;
  status_preco: string;
  confianca_calculo: 'alta' | 'media' | 'baixa';
  
  // Resumo documental
  proprietario_atual: string;
  tem_alienacao_fiduciaria_ativa: boolean;
  tem_hipoteca_ativa: boolean;
  alertas: string[];
  resumo_matricula: string;
  
  // Comparáveis
  comparaveis: any[];
  
  // Erro (se houver)
  erro_mensagem?: string;
}

/**
 * Salva análise de matrícula no Supabase
 */
export async function saveMatriculaAnalysis(data: Partial<MatriculaAnalysisRecord>) {
  try {
    const { data: result, error } = await supabase
      .from('matricula_analysis')
      .insert([{
        ...data,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }])
      .select();

    if (error) throw error;
    return result?.[0];
  } catch (error) {
    console.error('Erro ao salvar análise:', error);
    throw error;
  }
}

/**
 * Atualiza status de análise
 */
export async function updateMatriculaAnalysisStatus(
  id: string,
  status: string,
  data?: Partial<MatriculaAnalysisRecord>
) {
  try {
    const { data: result, error } = await supabase
      .from('matricula_analysis')
      .update({
        status,
        updated_at: new Date().toISOString(),
        ...data,
      })
      .eq('id', id)
      .select();

    if (error) throw error;
    return result?.[0];
  } catch (error) {
    console.error('Erro ao atualizar análise:', error);
    throw error;
  }
}

/**
 * Busca todas as análises
 */
export async function getMatriculaAnalyses() {
  try {
    const { data, error } = await supabase
      .from('matricula_analysis')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Erro ao buscar análises:', error);
    return [];
  }
}

/**
 * Busca análise por ID
 */
export async function getMatriculaAnalysisById(id: string) {
  try {
    const { data, error } = await supabase
      .from('matricula_analysis')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Erro ao buscar análise:', error);
    return null;
  }
}

/**
 * Deleta análise
 */
export async function deleteMatriculaAnalysis(id: string) {
  try {
    const { error } = await supabase
      .from('matricula_analysis')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Erro ao deletar análise:', error);
    return false;
  }
}
