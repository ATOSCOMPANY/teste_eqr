import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://amfirkqtyimdgyiozxvw.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFtZmlya3F0eWltZGd5aW96eHZ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc5OTczODAsImV4cCI6MjA5MzU3MzM4MH0.S7TceHMsFZ2E4D9hbLC-yajyObP5rsWlQA8XGWGqLr0';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ============ MATRICULA ANALYSIS ============

export async function saveMatriculaAnalysis(data: any) {
  const { data: result, error } = await supabase
    .from('matricula_analysis')
    .insert([{
      ...data,
      status: 'processando',
      created_at: new Date().toISOString(),
    }])
    .select()
    .single();

  if (error) throw error;
  return result;
}

export async function updateMatriculaAnalysisStatus(id: string, status: string, analysisData?: any) {
  const updateData: any = {
    status,
    updated_at: new Date().toISOString(),
  };

  if (analysisData) {
    Object.assign(updateData, analysisData);
  }

  const { data, error } = await supabase
    .from('matricula_analysis')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getMatriculaAnalyses(limit = 10, offset = 0) {
  const { data, error, count } = await supabase
    .from('matricula_analysis')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) throw error;
  return { data, count };
}

export async function getMatriculaAnalysisById(id: string) {
  const { data, error } = await supabase
    .from('matricula_analysis')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

export async function deleteMatriculaAnalysis(id: string) {
  const { error } = await supabase
    .from('matricula_analysis')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// ============ PROPERTY ANALYSIS ============

export async function savePropertyAnalysis(data: any) {
  const { data: result, error } = await supabase
    .from('property_analysis')
    .insert([{
      ...data,
      status: 'processando',
      created_at: new Date().toISOString(),
    }])
    .select()
    .single();

  if (error) throw error;
  return result;
}

export async function updatePropertyAnalysisStatus(id: string, status: string, analysisData?: any) {
  const updateData: any = {
    status,
    updated_at: new Date().toISOString(),
  };

  if (analysisData) {
    Object.assign(updateData, analysisData);
  }

  const { data, error } = await supabase
    .from('property_analysis')
    .update(updateData)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getPropertyAnalyses(limit = 10, offset = 0) {
  const { data, error, count } = await supabase
    .from('property_analysis')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) throw error;
  return { data, count };
}

export async function getPropertyAnalysisById(id: string) {
  const { data, error } = await supabase
    .from('property_analysis')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

export async function deletePropertyAnalysis(id: string) {
  const { error } = await supabase
    .from('property_analysis')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// ============ COMPARABLES ============

export async function saveComparable(analysisId: string, data: any) {
  const { data: result, error } = await supabase
    .from('comparables')
    .insert([{
      ...data,
      analysis_id: analysisId,
      created_at: new Date().toISOString(),
    }])
    .select()
    .single();

  if (error) throw error;
  return result;
}

export async function getComparables(analysisId: string) {
  const { data, error } = await supabase
    .from('comparables')
    .select('*')
    .eq('analysis_id', analysisId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function deleteComparable(id: string) {
  const { error } = await supabase
    .from('comparables')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// ============ MEDIA FILES ============

export async function saveMediaFile(data: any) {
  const { data: result, error } = await supabase
    .from('media_files')
    .insert([{
      ...data,
      created_at: new Date().toISOString(),
    }])
    .select()
    .single();

  if (error) throw error;
  return result;
}

export async function getMediaFiles(analysisId: string, type: 'matricula' | 'property') {
  const column = type === 'matricula' ? 'matricula_analysis_id' : 'property_analysis_id';
  const { data, error } = await supabase
    .from('media_files')
    .select('*')
    .eq(column, analysisId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function deleteMediaFile(id: string) {
  const { error } = await supabase
    .from('media_files')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// ============ ANALYSIS NOTES ============

export async function saveAnalysisNote(data: any) {
  const { data: result, error } = await supabase
    .from('analysis_notes')
    .insert([{
      ...data,
      created_at: new Date().toISOString(),
    }])
    .select()
    .single();

  if (error) throw error;
  return result;
}

export async function updateAnalysisNote(id: string, data: any) {
  const { data: result, error } = await supabase
    .from('analysis_notes')
    .update({
      ...data,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return result;
}

export async function getAnalysisNotes(analysisId: string, type: 'matricula' | 'property') {
  const column = type === 'matricula' ? 'matricula_analysis_id' : 'property_analysis_id';
  const { data, error } = await supabase
    .from('analysis_notes')
    .select('*')
    .eq(column, analysisId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function deleteAnalysisNote(id: string) {
  const { error } = await supabase
    .from('analysis_notes')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// ============ ANALYSIS HISTORY ============

export async function saveAnalysisHistory(data: any) {
  const { data: result, error } = await supabase
    .from('analysis_history')
    .insert([{
      ...data,
      created_at: new Date().toISOString(),
    }])
    .select()
    .single();

  if (error) throw error;
  return result;
}

export async function getAnalysisHistory(analysisId: string, type: 'matricula' | 'property') {
  const column = type === 'matricula' ? 'matricula_analysis_id' : 'property_analysis_id';
  const { data, error } = await supabase
    .from('analysis_history')
    .select('*')
    .eq(column, analysisId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

// ============ USER SETTINGS ============

export async function saveUserSettings(data: any) {
  const { data: result, error } = await supabase
    .from('user_settings')
    .insert([{
      ...data,
      created_at: new Date().toISOString(),
    }])
    .select()
    .single();

  if (error) throw error;
  return result;
}

export async function getUserSettings(id: string) {
  const { data, error } = await supabase
    .from('user_settings')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

export async function updateUserSettings(id: string, data: any) {
  const { data: result, error } = await supabase
    .from('user_settings')
    .update({
      ...data,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return result;
}

// ============ AUDIT LOG ============

export async function saveAuditLog(data: any) {
  const { data: result, error } = await supabase
    .from('audit_log')
    .insert([{
      ...data,
      created_at: new Date().toISOString(),
    }])
    .select()
    .single();

  if (error) throw error;
  return result;
}

export async function getAuditLogs(limit = 100, offset = 0) {
  const { data, error } = await supabase
    .from('audit_log')
    .select('*')
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) throw error;
  return data;
}
