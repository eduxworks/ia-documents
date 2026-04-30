'use client';

import React, { useEffect } from 'react';
import { useAppContext } from '@/context/AppContext';
import { Document } from '@/lib/types';

export function DocumentList() {
  const { documents, setDocuments, loading } = useAppContext();

  useEffect(() => {
    const loadDocuments = async () => {
      try {
        const response = await fetch('/api/documents');
        const data = await response.json();

        if (response.ok) {
          setDocuments(data.documents || []);
        }
      } catch (err) {
        console.error('Error cargando documentos:', err);
      }
    };

    loadDocuments();
  }, [setDocuments]);

  if (loading) {
    return <div className="text-center py-8">Cargando...</div>;
  }

  if (documents.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <p className="text-gray-500">No hay documentos aún</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-4">Documentos</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {documents.map((doc: Document) => (
          <DocumentCard key={doc._id} document={doc} />
        ))}
      </div>
    </div>
  );
}

function DocumentCard({ document }: { document: Document }) {
  const formatDate = (date: Date | string) => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatSize = (bytes: number) => {
    const kb = bytes / 1024;
    return kb < 1024 ? `${kb.toFixed(2)} KB` : `${(kb / 1024).toFixed(2)} MB`;
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 truncate">{document.filename}</h3>
          <p className="text-xs text-gray-500 mt-1">{formatDate(document.uploadedAt)}</p>
        </div>
        <div className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded ml-2">
          {document.mimetype.split('/')[1].toUpperCase()}
        </div>
      </div>

      <p className="text-xs text-gray-600 mb-3">Tamaño: {formatSize(document.size)}</p>

      {document.tags.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-1">
          {document.tags.map(tag => (
            <span key={tag} className="inline-block text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
              {tag}
            </span>
          ))}
        </div>
      )}

      {Object.keys(document.metadata).length > 0 && (
        <div className="text-xs bg-gray-50 p-2 rounded">
          {Object.entries(document.metadata).map(([key, value]) => (
            <div key={key} className="text-gray-700">
              <strong>{key}:</strong> {value}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
