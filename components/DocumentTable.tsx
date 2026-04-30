'use client';

import React, { useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import { Document } from '@/lib/types';

const ITEMS_PER_PAGE = 10;

export function DocumentTable() {
  const { documents, setDocuments, setLoading, setError } = useAppContext();
  const [currentPage, setCurrentPage] = useState(1);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState({ metadata: '', tags: '' });

  const totalPages = Math.ceil(documents.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentDocuments = documents.slice(startIndex, endIndex);

  const handleDelete = async (id: string) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este documento?')) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/documents/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al eliminar');
      }

      setDocuments(documents.filter(doc => doc._id !== id));
      setError(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error desconocido';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (doc: Document) => {
    setEditingId(doc._id || '');
    setEditData({
      metadata: JSON.stringify(doc.metadata || {}),
      tags: doc.tags?.join(', ') || '',
    });
  };

  const handleSaveEdit = async (id: string) => {
    setLoading(true);
    try {
      let metadata = {};
      try {
        metadata = JSON.parse(editData.metadata);
      } catch {
        throw new Error('Metadatos JSON inválido');
      }

      const tags = editData.tags
        .split(',')
        .map(t => t.trim())
        .filter(t => t.length > 0);

      const response = await fetch(`/api/documents/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ metadata, tags }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al actualizar');
      }

      setDocuments(
        documents.map(doc =>
          doc._id === id ? { ...doc, metadata, tags } : doc
        )
      );
      setEditingId(null);
      setError(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error desconocido';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: Date | string) => {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  const formatSize = (bytes: number) => {
    const kb = bytes / 1024;
    return kb < 1024 ? `${kb.toFixed(2)} KB` : `${(kb / 1024).toFixed(2)} MB`;
  };

  if (documents.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center">
        <p className="text-gray-500">No hay documentos. ¡Sube uno para empezar!</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Nombre</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Tipo</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Tamaño</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Fecha</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Etiquetas</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {currentDocuments.map((doc) => (
              <tr key={doc._id} className="border-b hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-sm text-gray-900 font-medium truncate max-w-xs">
                  {doc.filename}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                    {doc.mimetype.split('/')[1]?.toUpperCase() || 'FILE'}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{formatSize(doc.size)}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{formatDate(doc.uploadedAt)}</td>
                <td className="px-6 py-4 text-sm">
                  {editingId === doc._id ? (
                    <input
                      type="text"
                      value={editData.tags}
                      onChange={e => setEditData({ ...editData, tags: e.target.value })}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
                      placeholder="tag1, tag2, tag3"
                    />
                  ) : (
                    <div className="flex flex-wrap gap-1">
                      {doc.tags?.length > 0 ? (
                        doc.tags.map(tag => (
                          <span
                            key={tag}
                            className="inline-block bg-gray-200 text-gray-800 px-2 py-1 rounded text-xs"
                          >
                            {tag}
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-400 text-xs">-</span>
                      )}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 text-sm">
                  {editingId === doc._id ? (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleSaveEdit(doc._id!)}
                        className="text-green-600 hover:text-green-800 font-medium text-xs"
                      >
                        Guardar
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="text-gray-600 hover:text-gray-800 font-medium text-xs"
                      >
                        Cancelar
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(doc)}
                        className="text-blue-600 hover:text-blue-800 font-medium text-xs"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(doc._id!)}
                        className="text-red-600 hover:text-red-800 font-medium text-xs"
                      >
                        Eliminar
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="bg-gray-50 px-6 py-4 border-t flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Mostrando {startIndex + 1} a {Math.min(endIndex, documents.length)} de {documents.length}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border border-gray-300 rounded text-sm font-medium disabled:opacity-50 hover:bg-gray-100"
            >
              Anterior
            </button>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 rounded text-sm font-medium ${
                    currentPage === page
                      ? 'bg-blue-600 text-white'
                      : 'border border-gray-300 hover:bg-gray-100'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border border-gray-300 rounded text-sm font-medium disabled:opacity-50 hover:bg-gray-100"
            >
              Siguiente
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
