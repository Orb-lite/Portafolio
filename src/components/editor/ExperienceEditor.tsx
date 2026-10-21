import React, { useState } from 'react';
import { Experience } from '../../types/resume';
import { Plus, Trash2, ChevronUp, ChevronDown, Sparkles, Building2 } from 'lucide-react';

interface ExperienceEditorProps {
  experiences: Experience[];
  onChange: (updated: Experience[]) => void;
}

export const ExperienceEditor: React.FC<ExperienceEditorProps> = ({
  experiences,
  onChange,
}) => {
  const [expandedId, setExpandedId] = useState<string | null>(
    experiences[0]?.id || null
  );

  const addExperience = () => {
    const newExp: Experience = {
      id: `exp-${Date.now()}`,
      role: 'Ejecutivo de Cuentas Clave / Consultor',
      company: 'Nueva Empresa',
      location: 'México',
      startDate: '2023',
      endDate: 'Presente',
      isCurrent: true,
      highlights: [
        'Prospección activa y negociación de acuerdos comerciales estratégicos.',
        'Superación de cuotas de ventas trimestrales y retención de cuentas clave.',
      ],
    };
    const updated = [newExp, ...experiences];
    onChange(updated);
    setExpandedId(newExp.id);
  };

  const removeExperience = (id: string) => {
    onChange(experiences.filter((e) => e.id !== id));
  };

  const updateExperience = (id: string, partial: Partial<Experience>) => {
    onChange(
      experiences.map((e) => (e.id === id ? { ...e, ...partial } : e))
    );
  };

  const moveExperience = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= experiences.length) return;
    const copy = [...experiences];
    const [moved] = copy.splice(index, 1);
    copy.splice(targetIndex, 0, moved);
    onChange(copy);
  };

  const addHighlight = (expId: string) => {
    const exp = experiences.find((e) => e.id === expId);
    if (!exp) return;
    const updatedHighlights = [
      ...exp.highlights,
      'Nuevo logro o responsabilidad comercial con métrica cuantificable...',
    ];
    updateExperience(expId, { highlights: updatedHighlights });
  };

  const updateHighlight = (expId: string, index: number, value: string) => {
    const exp = experiences.find((e) => e.id === expId);
    if (!exp) return;
    const updatedHighlights = [...exp.highlights];
    updatedHighlights[index] = value;
    updateExperience(expId, { highlights: updatedHighlights });
  };

  const removeHighlight = (expId: string, index: number) => {
    const exp = experiences.find((e) => e.id === expId);
    if (!exp) return;
    const updatedHighlights = exp.highlights.filter((_, i) => i !== index);
    updateExperience(expId, { highlights: updatedHighlights });
  };

  const quickEnhanceBullet = (expId: string, index: number) => {
    const exp = experiences.find((e) => e.id === expId);
    if (!exp) return;
    const current = exp.highlights[index];
    // Add strong action verbs and quantified impact
    if (!current.includes('%') && !current.includes('incrementando') && !current.includes('reduciendo')) {
      updateHighlight(
        expId,
        index,
        `${current} — superando el objetivo planificado en un 20% y optimizando la eficiencia de costos.`
      );
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-slate-800">
            Experiencia Laboral
          </h3>
          <p className="text-xs text-slate-500">
            Detalla tus puestos comerciales, empresas y logros cuantificados.
          </p>
        </div>
        <button
          type="button"
          onClick={addExperience}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Añadir Empleo</span>
        </button>
      </div>

      <div className="space-y-3">
        {experiences.map((exp, index) => {
          const isExpanded = expandedId === exp.id;
          return (
            <div
              key={exp.id}
              className="border border-slate-200 rounded-lg bg-white overflow-hidden"
            >
              {/* Accordion Header */}
              <div
                className="p-3 bg-slate-50 flex items-center justify-between cursor-pointer hover:bg-slate-100 transition-colors"
                onClick={() => setExpandedId(isExpanded ? null : exp.id)}
              >
                <div className="flex items-center gap-2 overflow-hidden pr-2">
                  <Building2 className="w-4 h-4 text-slate-400 shrink-0" />
                  <div className="truncate text-xs">
                    <span className="font-semibold text-slate-800">
                      {exp.role || 'Puesto sin título'}
                    </span>
                    <span className="text-slate-400 mx-1.5">en</span>
                    <span className="font-medium text-slate-600">
                      {exp.company || 'Empresa'}
                    </span>
                    <span className="text-[11px] text-slate-400 ml-2">
                      ({exp.startDate} – {exp.isCurrent ? 'Presente' : exp.endDate})
                    </span>
                  </div>
                </div>

                <div
                  className="flex items-center gap-1 shrink-0"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    type="button"
                    disabled={index === 0}
                    onClick={() => moveExperience(index, 'up')}
                    className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30"
                    title="Mover arriba"
                  >
                    <ChevronUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    disabled={index === experiences.length - 1}
                    onClick={() => moveExperience(index, 'down')}
                    className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30"
                    title="Mover abajo"
                  >
                    <ChevronDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeExperience(exp.id)}
                    className="p-1 text-red-500 hover:text-red-700"
                    title="Eliminar empleo"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Accordion Content */}
              {isExpanded && (
                <div className="p-4 space-y-3 border-t border-slate-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        Puesto / Cargo
                      </label>
                      <input
                        type="text"
                        value={exp.role}
                        onChange={(e) =>
                          updateExperience(exp.id, { role: e.target.value })
                        }
                        className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-blue-600 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        Empresa / Organización
                      </label>
                      <input
                        type="text"
                        value={exp.company}
                        onChange={(e) =>
                          updateExperience(exp.id, { company: e.target.value })
                        }
                        className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-blue-600 outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        Ubicación
                      </label>
                      <input
                        type="text"
                        value={exp.location}
                        onChange={(e) =>
                          updateExperience(exp.id, { location: e.target.value })
                        }
                        className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-blue-600 outline-none"
                        placeholder="Ej. México / Remoto"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">
                          Inicio
                        </label>
                        <input
                          type="text"
                          value={exp.startDate}
                          onChange={(e) =>
                            updateExperience(exp.id, { startDate: e.target.value })
                          }
                          className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-blue-600 outline-none"
                          placeholder="2022"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">
                          Fin
                        </label>
                        <input
                          type="text"
                          disabled={exp.isCurrent}
                          value={exp.isCurrent ? 'Presente' : exp.endDate}
                          onChange={(e) =>
                            updateExperience(exp.id, { endDate: e.target.value })
                          }
                          className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded disabled:bg-slate-100 disabled:text-slate-400 focus:ring-1 focus:ring-blue-600 outline-none"
                          placeholder="Presente"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id={`current-${exp.id}`}
                      checked={exp.isCurrent}
                      onChange={(e) =>
                        updateExperience(exp.id, { isCurrent: e.target.checked })
                      }
                      className="rounded text-blue-600 focus:ring-blue-500"
                    />
                    <label
                      htmlFor={`current-${exp.id}`}
                      className="text-xs text-slate-700 font-medium cursor-pointer"
                    >
                      Trabajo actualmente en este puesto
                    </label>
                  </div>

                  {/* Highlights / Responsibilities */}
                  <div className="pt-2 border-t border-slate-100">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-medium text-slate-700">
                        Logros, responsabilidades e impacto cuantificable:
                      </label>
                      <button
                        type="button"
                        onClick={() => addHighlight(exp.id)}
                        className="text-[11px] text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Añadir viñeta</span>
                      </button>
                    </div>

                    <div className="space-y-2">
                      {exp.highlights.map((highlight, hIndex) => (
                        <div key={hIndex} className="flex items-start gap-1.5 group">
                          <span className="text-slate-400 mt-2 text-xs">•</span>
                          <textarea
                            rows={2}
                            value={highlight}
                            onChange={(e) =>
                              updateHighlight(exp.id, hIndex, e.target.value)
                            }
                            className="flex-1 p-2 text-xs border border-slate-200 rounded focus:ring-1 focus:ring-blue-600 outline-none leading-relaxed"
                          />
                          <div className="flex flex-col gap-1 shrink-0 pt-1">
                            <button
                              type="button"
                              onClick={() => quickEnhanceBullet(exp.id, hIndex)}
                              className="p-1 text-slate-400 hover:text-amber-600"
                              title="Añadir métrica de impacto"
                            >
                              <Sparkles className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => removeHighlight(exp.id, hIndex)}
                              className="p-1 text-slate-400 hover:text-red-600"
                              title="Eliminar viñeta"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
