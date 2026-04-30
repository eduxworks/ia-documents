'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { Document } from '@/lib/types';

interface AppContextType {
  documents: Document[];
  setDocuments: (docs: Document[]) => void;
  addDocument: (doc: Document) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addDocument = useCallback((doc: Document) => {
    setDocuments(prev => [doc, ...prev]);
  }, []);

  return (
    <AppContext.Provider value={{ documents, setDocuments, addDocument, loading, setLoading, error, setError }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
}
