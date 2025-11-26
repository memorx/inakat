// RUTA: src/components/sections/jobs/CreateJobForm.tsx

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AlertCircle, Coins, Save, Send, Calculator } from 'lucide-react';

interface PricingOptions {
  profiles: string[];
  seniorities: string[];
  workModes: string[];
  locations: string[];
}

interface UserInfo {
  credits: number;
  role: string;
}

const CreateJobForm = () => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    salary: '',
    jobType: 'Tiempo Completo',
    workMode: 'presential',
    description: '',
    requirements: '',
    companyRating: '',
    // Campos para pricing
    profile: '',
    seniority: ''
  });

  const [pricingOptions, setPricingOptions] = useState<PricingOptions>({
    profiles: [],
    seniorities: [],
    workModes: [],
    locations: []
  });

  const [calculatedCost, setCalculatedCost] = useState<number>(0);
  const [isCalculating, setIsCalculating] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showInsufficientCreditsModal, setShowInsufficientCreditsModal] =
    useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | 'draft' | null;
    message: string;
  }>({ type: null, message: '' });

  // Cargar opciones de pricing al montar
  useEffect(() => {
    fetchPricingOptions();
    fetchUserInfo();
  }, []);

  // Calcular costo cuando cambian los campos relevantes
  useEffect(() => {
    if (formData.profile && formData.seniority && formData.workMode) {
      calculateCost();
    } else {
      setCalculatedCost(0);
    }
  }, [formData.profile, formData.seniority, formData.workMode]);

  const fetchPricingOptions = async () => {
    try {
      const response = await fetch('/api/pricing/calculate');
      const data = await response.json();
      if (data.success) {
        setPricingOptions(data.options);
      }
    } catch (error) {
      console.error('Error fetching pricing options:', error);
    }
  };

  const fetchUserInfo = async () => {
    try {
      const response = await fetch('/api/auth/me');
      const data = await response.json();
      if (data.success && data.user) {
        setUserInfo({
          credits: data.user.credits || 0,
          role: data.user.role
        });
      }
    } catch (error) {
      console.error('Error fetching user info:', error);
    }
  };

  const calculateCost = async () => {
    setIsCalculating(true);
    try {
      const response = await fetch('/api/pricing/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profile: formData.profile,
          seniority: formData.seniority,
          workMode: formData.workMode
        })
      });
      const data = await response.json();
      if (data.success) {
        setCalculatedCost(data.credits);
      }
    } catch (error) {
      console.error('Error calculating cost:', error);
    } finally {
      setIsCalculating(false);
    }
  };

  const handleSubmit = async (
    e: React.FormEvent,
    publishNow: boolean = false
  ) => {
    e.preventDefault();

    // Verificar créditos antes de publicar
    if (publishNow && userInfo && userInfo.role !== 'admin') {
      if (userInfo.credits < calculatedCost) {
        setShowInsufficientCreditsModal(true);
        return;
      }
    }

    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: '' });

    try {
      const response = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          companyRating: formData.companyRating
            ? parseFloat(formData.companyRating)
            : null,
          publishNow
        })
      });

      const data = await response.json();

      if (response.status === 402) {
        // Créditos insuficientes
        setShowInsufficientCreditsModal(true);
        return;
      }

      if (data.success) {
        if (data.status === 'active') {
          setSubmitStatus({
            type: 'success',
            message: `¡Vacante publicada! Se descontaron ${data.creditCost} créditos.`
          });
          // Actualizar créditos del usuario
          if (userInfo) {
            setUserInfo({
              ...userInfo,
              credits: userInfo.credits - data.creditCost
            });
          }
        } else {
          setSubmitStatus({
            type: 'draft',
            message:
              'Vacante guardada como borrador. Puedes publicarla después.'
          });
        }

        // Resetear formulario después de éxito
        setTimeout(() => {
          setFormData({
            title: '',
            company: '',
            location: '',
            salary: '',
            jobType: 'Tiempo Completo',
            workMode: 'presential',
            description: '',
            requirements: '',
            companyRating: '',
            profile: '',
            seniority: ''
          });
          setCalculatedCost(0);
        }, 2000);
      } else {
        throw new Error(data.error || 'Error al crear vacante');
      }
    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message:
          error instanceof Error ? error.message : 'Error al crear vacante'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const workModeLabels: Record<string, string> = {
    remote: 'Remoto',
    hybrid: 'Híbrido',
    presential: 'Presencial'
  };

  const hasEnoughCredits = userInfo
    ? userInfo.role === 'admin' || userInfo.credits >= calculatedCost
    : false;

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
      {/* Header con créditos */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-3xl font-bold">Publicar Nueva Vacante</h2>
          <p className="text-gray-600 mt-1">
            Completa la información de la vacante
          </p>
        </div>

        {userInfo && userInfo.role !== 'admin' && (
          <div className="bg-green-50 border border-green-200 rounded-lg px-4 py-2 text-right">
            <p className="text-sm text-gray-600">Tus créditos</p>
            <p className="text-2xl font-bold text-green-600 flex items-center gap-1">
              <Coins size={24} />
              {userInfo.credits}
            </p>
          </div>
        )}
      </div>

      {/* Mensajes de estado */}
      {submitStatus.type && (
        <div
          className={`mb-6 p-4 rounded-lg flex items-center gap-2 ${
            submitStatus.type === 'success'
              ? 'bg-green-100 text-green-800 border-2 border-green-500'
              : submitStatus.type === 'draft'
              ? 'bg-blue-100 text-blue-800 border-2 border-blue-500'
              : 'bg-red-100 text-red-800 border-2 border-red-500'
          }`}
        >
          {submitStatus.type === 'success' && '✅'}
          {submitStatus.type === 'draft' && '📝'}
          {submitStatus.type === 'error' && '❌'}
          {submitStatus.message}
        </div>
      )}

      <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-6">
        {/* Título */}
        <div>
          <label className="block text-sm font-semibold mb-2">
            Título del Puesto *
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            placeholder="ej. Desarrollador Full Stack"
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-button-green focus:border-transparent"
            required
          />
        </div>

        {/* Empresa y Ubicación */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-2">
              Nombre de la Empresa *
            </label>
            <input
              type="text"
              value={formData.company}
              onChange={(e) =>
                setFormData({ ...formData, company: e.target.value })
              }
              placeholder="ej. Tech Corp"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-button-green"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              Ubicación *
            </label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
              placeholder="ej. Monterrey, Nuevo León"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-button-green"
              required
            />
          </div>
        </div>

        {/* Salario y Rating */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-2">
              Salario *
            </label>
            <input
              type="text"
              value={formData.salary}
              onChange={(e) =>
                setFormData({ ...formData, salary: e.target.value })
              }
              placeholder="ej. $25,000 - $35,000 / mes"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-button-green"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              Rating de la Empresa (opcional)
            </label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="5"
              value={formData.companyRating}
              onChange={(e) =>
                setFormData({ ...formData, companyRating: e.target.value })
              }
              placeholder="ej. 4.5"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-button-green"
            />
          </div>
        </div>

        {/* Tipo de trabajo y Modalidad */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold mb-2">
              Tipo de Trabajo *
            </label>
            <select
              value={formData.jobType}
              onChange={(e) =>
                setFormData({ ...formData, jobType: e.target.value })
              }
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-button-green"
              required
            >
              <option value="Tiempo Completo">Tiempo Completo</option>
              <option value="Medio Tiempo">Medio Tiempo</option>
              <option value="Por Proyecto">Por Proyecto</option>
              <option value="Temporal">Temporal</option>
              <option value="Prácticas">Prácticas</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2">
              Modalidad de Trabajo *
            </label>
            <select
              value={formData.workMode}
              onChange={(e) =>
                setFormData({ ...formData, workMode: e.target.value })
              }
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-button-green"
              required
            >
              <option value="presential">Presencial</option>
              <option value="hybrid">Híbrido</option>
              <option value="remote">Remoto</option>
            </select>
          </div>
        </div>

        {/* 🎯 SECCIÓN DE PRICING - Perfil y Seniority */}
        <div className="bg-gray-50 p-6 rounded-lg border-2 border-dashed border-gray-300">
          <div className="flex items-center gap-2 mb-4">
            <Calculator className="text-button-green" size={24} />
            <h3 className="text-lg font-bold">Cálculo de Créditos</h3>
          </div>

          <p className="text-sm text-gray-600 mb-4">
            El costo de publicación depende del perfil, nivel de experiencia y
            modalidad.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2">
                Perfil del Puesto *
              </label>
              <select
                value={formData.profile}
                onChange={(e) =>
                  setFormData({ ...formData, profile: e.target.value })
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-button-green bg-white"
                required
              >
                <option value="">Selecciona un perfil</option>
                {pricingOptions.profiles.map((profile) => (
                  <option key={profile} value={profile}>
                    {profile}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">
                Nivel de Experiencia *
              </label>
              <select
                value={formData.seniority}
                onChange={(e) =>
                  setFormData({ ...formData, seniority: e.target.value })
                }
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-button-green bg-white"
                required
              >
                <option value="">Selecciona el nivel</option>
                {pricingOptions.seniorities.map((seniority) => (
                  <option key={seniority} value={seniority}>
                    {seniority}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Costo calculado */}
          {calculatedCost > 0 && (
            <div
              className={`mt-4 p-4 rounded-lg flex items-center justify-between ${
                hasEnoughCredits
                  ? 'bg-green-100 border border-green-300'
                  : 'bg-red-100 border border-red-300'
              }`}
            >
              <div>
                <p className="font-semibold">Costo de publicación:</p>
                <p className="text-sm text-gray-600">
                  {formData.profile} • {formData.seniority} •{' '}
                  {workModeLabels[formData.workMode]}
                </p>
              </div>
              <div className="text-right">
                <p
                  className={`text-3xl font-bold ${
                    hasEnoughCredits ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {isCalculating ? '...' : calculatedCost}
                </p>
                <p className="text-sm text-gray-600">créditos</p>
              </div>
            </div>
          )}

          {!hasEnoughCredits && calculatedCost > 0 && userInfo && (
            <div className="mt-3 flex items-center gap-2 text-red-600">
              <AlertCircle size={16} />
              <span className="text-sm">
                Te faltan {calculatedCost - userInfo.credits} créditos para
                publicar esta vacante
              </span>
            </div>
          )}
        </div>

        {/* Descripción */}
        <div>
          <label className="block text-sm font-semibold mb-2">
            Descripción del Puesto *
          </label>
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            placeholder="Describe las responsabilidades, el ambiente de trabajo, beneficios, etc."
            rows={6}
            className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-button-green"
            required
          />
        </div>

        {/* Requisitos */}
        <div>
          <label className="block text-sm font-semibold mb-2">
            Requisitos (opcional)
          </label>
          <textarea
            value={formData.requirements}
            onChange={(e) =>
              setFormData({ ...formData, requirements: e.target.value })
            }
            placeholder="Lista los requisitos, habilidades necesarias, experiencia, etc."
            rows={4}
            className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-button-green"
          />
        </div>

        {/* Botones de acción */}
        <div className="flex gap-4 pt-4">
          {/* Guardar como borrador */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-gray-600 text-white font-bold py-3 rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            <Save size={20} />
            {isSubmitting ? 'GUARDANDO...' : 'GUARDAR BORRADOR'}
          </button>

          {/* Publicar ahora */}
          <button
            type="button"
            onClick={(e) => handleSubmit(e, true)}
            disabled={isSubmitting || !calculatedCost}
            className={`flex-1 font-bold py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 ${
              hasEnoughCredits
                ? 'bg-button-green text-white hover:bg-green-700'
                : 'bg-orange-500 text-white hover:bg-orange-600'
            }`}
          >
            <Send size={20} />
            {isSubmitting
              ? 'PUBLICANDO...'
              : hasEnoughCredits
              ? `PUBLICAR (${calculatedCost} créditos)`
              : 'COMPRAR CRÉDITOS Y PUBLICAR'}
          </button>
        </div>
      </form>

      {/* Modal de créditos insuficientes */}
      {showInsufficientCreditsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md mx-4">
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <AlertCircle className="text-red-600" size={32} />
              </div>
              <h3 className="text-xl font-bold mb-2">Créditos Insuficientes</h3>
              <p className="text-gray-600 mb-4">
                Necesitas <strong>{calculatedCost} créditos</strong> para
                publicar esta vacante.
                <br />
                Actualmente tienes{' '}
                <strong>{userInfo?.credits || 0} créditos</strong>.
              </p>
              <p className="text-sm text-gray-500 mb-6">
                Te faltan{' '}
                <strong className="text-red-600">
                  {calculatedCost - (userInfo?.credits || 0)} créditos
                </strong>
                .
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowInsufficientCreditsModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={() => router.push('/credits/purchase')}
                  className="flex-1 px-4 py-2 bg-button-green text-white rounded-lg hover:bg-green-700 font-semibold"
                >
                  Comprar Créditos
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateJobForm;
