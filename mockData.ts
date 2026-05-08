import React, { createContext, useContext, useState } from 'react';
import type { AnalysisResult } from '@/lib/webhookService';

interface AnalysisContextType {
  currentAnalysis: AnalysisResult | null;
  setCurrentAnalysis: (analysis: AnalysisResult) => void;
  clearAnalysis: () => void;
}

const AnalysisContext = createContext<AnalysisContextType | undefined>(undefined);

export function AnalysisProvider({ children }: { children: React.ReactNode }) {
  const [currentAnalysis, setCurrentAnalysis] = useState<AnalysisResult | null>(null);

  const clearAnalysis = () => {
    setCurrentAnalysis(null);
  };

  return (
    <AnalysisContext.Provider value={{ currentAnalysis, setCurrentAnalysis, clearAnalysis }}>
      {children}
    </AnalysisContext.Provider>
  );
}

export function useAnalysis() {
  const context = useContext(AnalysisContext);
  if (context === undefined) {
    throw new Error('useAnalysis must be used within AnalysisProvider');
  }
  return context;
}
