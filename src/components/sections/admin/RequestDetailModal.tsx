'use client';

import React from 'react';
import { X, FileText, Image as ImageIcon, ExternalLink } from 'lucide-react';

interface CompanyRequest {
  id: number;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  nombreEmpresa: string;
  correoEmpresa: string;
  sitioWeb: string | null;
  razonSocial: string;
  rfc: string;
  direccionEmpresa: string;
  identificacionUrl: string | null;
  documentosConstitucionUrl: string | null;
  status: string;
  rejectionReason: string | null;
  createdAt: string;
  updatedAt: string;
  approvedAt: string | null;
}

interface RequestDetailModalProps {
  request: CompanyRequest;
  onClose: () => void;
  onApprove?: (id: number) => void;
  onReject?: (id: number) => void;
}

const RequestDetailModal = ({
  request,
  onClose,
  onApprove,
  onReject
}: RequestDetailModalProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      approved: 'bg-green-100 text-green-800 border-green-300',
      rejected: 'bg-red-100 text-red-800 border-red-300'
    };

    const labels = {
      pending: 'Pendiente',
      approved: 'Aprobado',
      rejected: 'Rechazado'
    };

    return (
      <span
        className={`px-3 py-1 rounded-full text-sm font-semibold border ${
          styles[status as keyof typeof styles]
        }`}
      >
        {labels[status as keyof typeof labels]}
      </span>
    );
  };

  const openFile = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* HEADER */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Solicitud #{request.id}
            </h2>
            <p className="text-sm text-gray-500">
              Creada el {formatDate(request.createdAt)}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {getStatusBadge(request.status)}
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* CONTENT */}
        <div className="p-6 space-y-6">
          {/* DATOS DEL REPRESENTANTE */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
              👤 Datos del Representante
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-gray-500 uppercase">Nombre</p>
                <p className="font-medium text-gray-800">{request.nombre}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase">
                  Apellido Paterno
                </p>
                <p className="font-medium text-gray-800">
                  {request.apellidoPaterno}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase">
                  Apellido Materno
                </p>
                <p className="font-medium text-gray-800">
                  {request.apellidoMaterno}
                </p>
              </div>
            </div>
          </div>

          {/* DATOS DE LA EMPRESA */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
              🏢 Datos de la Empresa
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500 uppercase">
                  Nombre Comercial
                </p>
                <p className="font-medium text-gray-800">
                  {request.nombreEmpresa}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase">Razón Social</p>
                <p className="font-medium text-gray-800">
                  {request.razonSocial}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase">RFC</p>
                <p className="font-medium text-gray-800 font-mono">
                  {request.rfc}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase">
                  Correo Electrónico
                </p>
                <p className="font-medium text-gray-800">
                  {request.correoEmpresa}
                </p>
              </div>
              {request.sitioWeb && (
                <div>
                  <p className="text-xs text-gray-500 uppercase">Sitio Web</p>
                  <a
                    href={request.sitioWeb}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-blue-600 hover:text-blue-800 flex items-center gap-1"
                  >
                    {request.sitioWeb}
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              )}
              <div className="md:col-span-2">
                <p className="text-xs text-gray-500 uppercase">Dirección</p>
                <p className="font-medium text-gray-800">
                  {request.direccionEmpresa}
                </p>
              </div>
            </div>
          </div>

          {/* DOCUMENTOS */}
          <div className="bg-green-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
              📄 Documentos
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Identificación */}
              <div>
                <p className="text-xs text-gray-500 uppercase mb-2">
                  Identificación
                </p>
                {request.identificacionUrl ? (
                  <button
                    onClick={() => openFile(request.identificacionUrl!)}
                    className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg p-3 hover:bg-gray-50 transition-colors w-full"
                  >
                    {request.identificacionUrl.endsWith('.pdf') ? (
                      <FileText className="w-5 h-5 text-red-500" />
                    ) : (
                      <ImageIcon className="w-5 h-5 text-blue-500" />
                    )}
                    <span className="text-sm font-medium text-gray-700 flex-1 text-left truncate">
                      Ver Identificación
                    </span>
                    <ExternalLink className="w-4 h-4 text-gray-400" />
                  </button>
                ) : (
                  <p className="text-sm text-gray-500 italic">No disponible</p>
                )}
              </div>

              {/* Documentos de Constitución */}
              <div>
                <p className="text-xs text-gray-500 uppercase mb-2">
                  Documentos de Constitución
                </p>
                {request.documentosConstitucionUrl ? (
                  <button
                    onClick={() => openFile(request.documentosConstitucionUrl!)}
                    className="flex items-center gap-2 bg-white border border-gray-300 rounded-lg p-3 hover:bg-gray-50 transition-colors w-full"
                  >
                    {request.documentosConstitucionUrl.endsWith('.pdf') ? (
                      <FileText className="w-5 h-5 text-red-500" />
                    ) : (
                      <ImageIcon className="w-5 h-5 text-blue-500" />
                    )}
                    <span className="text-sm font-medium text-gray-700 flex-1 text-left truncate">
                      Ver Documentos
                    </span>
                    <ExternalLink className="w-4 h-4 text-gray-400" />
                  </button>
                ) : (
                  <p className="text-sm text-gray-500 italic">No disponible</p>
                )}
              </div>
            </div>
          </div>

          {/* INFORMACIÓN DE ESTADO */}
          {request.status === 'rejected' && request.rejectionReason && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-red-800 mb-2">
                ❌ Razón de Rechazo
              </h3>
              <p className="text-gray-700">{request.rejectionReason}</p>
            </div>
          )}

          {request.status === 'approved' && request.approvedAt && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-green-800 mb-2">
                ✅ Aprobado
              </h3>
              <p className="text-gray-700">
                Aprobado el {formatDate(request.approvedAt)}
              </p>
            </div>
          )}
        </div>

        {/* FOOTER CON ACCIONES */}
        {request.status === 'pending' && onApprove && onReject && (
          <div className="sticky bottom-0 bg-gray-50 border-t px-6 py-4 flex justify-end gap-3">
            <button
              onClick={() => onReject(request.id)}
              className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white font-semibold rounded-lg transition-colors"
            >
              Rechazar
            </button>
            <button
              onClick={() => onApprove(request.id)}
              className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition-colors"
            >
              Aprobar
            </button>
          </div>
        )}

        {request.status !== 'pending' && (
          <div className="sticky bottom-0 bg-gray-50 border-t px-6 py-4 flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-500 hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors"
            >
              Cerrar
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RequestDetailModal;
