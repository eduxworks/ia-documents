'use client';

import React, { useState, ChangeEvent, FormEvent } from 'react';
import { useAppContext } from '@/context/AppContext';

interface FormData {
  file: File | null;
  metadata: Record<string, string>;
  tags: string;
}

export function DocumentUpload() {
  const { addDocument, setLoading, setError } = useAppContext();
  const [formData, setFormData] = useState<FormData>({
    file: null,
    metadata: {},
    tags: '',
  });
  const [metaKey, setMetaKey] = useState('');
  const [metaValue, setMetaValue] = useState('');

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({ ...prev, file }));
  };

  const handleMetadataAdd = () => {
    if (metaKey && metaValue) {
      setFormData(prev => ({
        ...prev,
        metadata: { ...prev.metadata, [metaKey]: metaValue },
      }));
      setMetaKey('');
      setMetaValue('');
    }
  };

  const handleRemoveMetadata = (key: string) => {
    setFormData(prev => {
      const { [key]: _, ...rest } = prev.metadata;
      return { ...prev, metadata: rest };
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.file) {
      setError('Por favor selecciona un archivo');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const uploadFormData = new FormData();
      uploadFormData.append('file', formData.file);
      uploadFormData.append('metadata', JSON.stringify(formData.metadata));
      uploadFormData.append('tags', formData.tags);

      console.log('[UPLOAD CLIENT] Iniciando subida...');
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData,
      });

      console.log('[UPLOAD CLIENT] Response status:', response.status);
      const data = await response.json();
      console.log('[UPLOAD CLIENT] Response data:', data);

      if (!response.ok) {
        throw new Error(data.error || `Error del servidor: ${response.status}`);
      }

      addDocument(data.document);
      setFormData({ file: null, metadata: {}, tags: '' });
      setError(null);
      console.log('[UPLOAD CLIENT] Subida exitosa');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error desconocido';
      console.error('[UPLOAD CLIENT] Error:', message);
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-2xl font-bold mb-4">Subir Documento</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Archivo</label>
          <input
            type="file"
            onChange={handleFileChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            disabled={false}
          />
          {formData.file && <p className="mt-2 text-sm text-gray-600">Archivo: {formData.file.name}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Etiquetas (separadas por comas)</label>
          <input
            type="text"
            value={formData.tags}
            onChange={e => setFormData(prev => ({ ...prev, tags: e.target.value }))}
            placeholder="ej: importante, urgente, legal"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Metadatos</label>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={metaKey}
              onChange={e => setMetaKey(e.target.value)}
              placeholder="Clave"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
            />
            <input
              type="text"
              value={metaValue}
              onChange={e => setMetaValue(e.target.value)}
              placeholder="Valor"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md"
            />
            <button
              type="button"
              onClick={handleMetadataAdd}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Añadir
            </button>
          </div>

          {Object.entries(formData.metadata).length > 0 && (
            <div className="space-y-2">
              {Object.entries(formData.metadata).map(([key, value]) => (
                <div key={key} className="flex justify-between items-center bg-gray-100 p-2 rounded">
                  <span className="text-sm">
                    <strong>{key}:</strong> {value}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveMetadata(key)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    Eliminar
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          type="submit"
          className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 font-medium"
        >
          Subir Documento
        </button>
      </form>
    </div>
  );
}
