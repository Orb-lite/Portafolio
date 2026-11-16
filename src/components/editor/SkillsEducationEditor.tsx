import React, { useState } from 'react';
import {
  SkillCategory,
  Education,
  Certification,
  Language,
  Achievement,
} from '../../types/resume';
import { Plus, Trash2, X } from 'lucide-react';

interface SkillsEducationEditorProps {
  skillCategories: SkillCategory[];
  education: Education[];
  certifications: Certification[];
  languages: Language[];
  achievements: Achievement[];
  onSkillsChange: (categories: SkillCategory[]) => void;
  onEducationChange: (education: Education[]) => void;
  onCertificationsChange: (certifications: Certification[]) => void;
  onLanguagesChange: (languages: Language[]) => void;
  onAchievementsChange: (achievements: Achievement[]) => void;
  language?: 'es' | 'en';
}

export const SkillsEducationEditor: React.FC<SkillsEducationEditorProps> = ({
  skillCategories,
  education,
  certifications,
  languages,
  achievements,
  onSkillsChange,
  onEducationChange,
  onCertificationsChange,
  onLanguagesChange,
  onAchievementsChange,
  language = 'es',
}) => {
  const isEn = language === 'en';
  const [newSkillInput, setNewSkillInput] = useState<{ [catId: string]: string }>({});

  // Skill category handlers
  const addSkillToCategory = (catId: string) => {
    const text = (newSkillInput[catId] || '').trim();
    if (!text) return;
    const updated = skillCategories.map((cat) => {
      if (cat.id === catId) {
        return { ...cat, skills: [...cat.skills, text] };
      }
      return cat;
    });
    onSkillsChange(updated);
    setNewSkillInput({ ...newSkillInput, [catId]: '' });
  };

  const removeSkillFromCategory = (catId: string, skillIndex: number) => {
    const updated = skillCategories.map((cat) => {
      if (cat.id === catId) {
        return {
          ...cat,
          skills: cat.skills.filter((_, i) => i !== skillIndex),
        };
      }
      return cat;
    });
    onSkillsChange(updated);
  };

  const addCategory = () => {
    const newCat: SkillCategory = {
      id: `cat-${Date.now()}`,
      name: isEn ? 'New Category' : 'Nueva Categoría',
      skills: isEn ? ['Skill 1', 'Skill 2'] : ['Habilidad 1', 'Habilidad 2'],
    };
    onSkillsChange([...skillCategories, newCat]);
  };

  const removeCategory = (catId: string) => {
    onSkillsChange(skillCategories.filter((c) => c.id !== catId));
  };

  // Education handlers
  const addEducation = () => {
    const newEdu: Education = {
      id: `edu-${Date.now()}`,
      degree: isEn
        ? 'B.S. in Interactive Technologies & Digital Animation Engineering'
        : 'Ingeniería en Tecnologías Interactivas de Animación Digital',
      institution: 'Universidad del Valle de México (UVM)',
      location: isEn ? 'Mexico' : 'México',
      graduationYear: '2013 - 2018',
      details: isEn
        ? 'Specialized training in interactive engineering, real-time 3D graphics, and animation.'
        : 'Formación especializada en ingeniería interactiva, gráficos 3D en tiempo real y animación.',
    };
    onEducationChange([...education, newEdu]);
  };

  const updateEducation = (id: string, partial: Partial<Education>) => {
    onEducationChange(
      education.map((e) => (e.id === id ? { ...e, ...partial } : e))
    );
  };

  const removeEducation = (id: string) => {
    onEducationChange(education.filter((e) => e.id !== id));
  };

  // Certifications handlers
  const addCertification = () => {
    const newCert: Certification = {
      id: `cert-${Date.now()}`,
      name: isEn ? 'New Technical / Engine Certification' : 'Nueva Certificación Técnica / Motor 3D',
      issuer: isEn ? 'Issuing Organization' : 'Institución Emisora',
      year: '2024',
    };
    onCertificationsChange([...certifications, newCert]);
  };

  const updateCertification = (id: string, partial: Partial<Certification>) => {
    onCertificationsChange(
      certifications.map((c) => (c.id === id ? { ...c, ...partial } : c))
    );
  };

  const removeCertification = (id: string) => {
    onCertificationsChange(certifications.filter((c) => c.id !== id));
  };

  // Achievement handlers
  const addAchievement = () => {
    const newAch: Achievement = {
      id: `ach-${Date.now()}`,
      title: isEn ? 'Key Metric' : 'Métrica Clave',
      metric: '+100%',
      description: isEn
        ? 'Brief summary of measurable technical or production impact.'
        : 'Breve explicación del logro técnico o de producción alcanzado.',
    };
    onAchievementsChange([...achievements, newAch]);
  };

  const updateAchievement = (id: string, partial: Partial<Achievement>) => {
    onAchievementsChange(
      achievements.map((a) => (a.id === id ? { ...a, ...partial } : a))
    );
  };

  const removeAchievement = (id: string) => {
    onAchievementsChange(achievements.filter((a) => a.id !== id));
  };

  return (
    <div className="space-y-6">
      {/* Metrics & Highlights */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <div>
            <h3 className="text-sm font-semibold text-slate-800">
              {isEn ? 'Key Achievements & Metrics' : 'Logros Destacados & Métricas Clave'}
            </h3>
            <p className="text-xs text-slate-500">
              {isEn
                ? 'High-impact figures that highlight your production and engineering results.'
                : 'Cifras de alto impacto que demuestran tu rendimiento técnico y de producción.'}
            </p>
          </div>
          <button
            type="button"
            onClick={addAchievement}
            className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-medium"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{isEn ? 'Add Metric' : 'Añadir Métrica'}</span>
          </button>
        </div>

        <div className="space-y-2">
          {achievements.map((ach) => (
            <div
              key={ach.id}
              className="p-2.5 bg-slate-50 border border-slate-200 rounded flex items-start gap-2"
            >
              <div className="w-20">
                <label className="text-[10px] text-slate-500 block mb-0.5">
                  {isEn ? 'Metric' : 'Cifra'}
                </label>
                <input
                  type="text"
                  value={ach.metric}
                  onChange={(e) =>
                    updateAchievement(ach.id, { metric: e.target.value })
                  }
                  className="w-full px-2 py-1 text-xs font-bold border border-slate-300 rounded bg-white text-center"
                  placeholder="60+ FPS"
                />
              </div>
              <div className="flex-1 space-y-1">
                <div>
                  <label className="text-[10px] text-slate-500 block mb-0.5">
                    {isEn ? 'Title' : 'Título'}
                  </label>
                  <input
                    type="text"
                    value={ach.title}
                    onChange={(e) =>
                      updateAchievement(ach.id, { title: e.target.value })
                    }
                    className="w-full px-2 py-1 text-xs font-semibold border border-slate-300 rounded bg-white"
                    placeholder={isEn ? 'Performance Optimization' : 'Optimización de Rendimiento'}
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 block mb-0.5">
                    {isEn ? 'Details' : 'Detalle'}
                  </label>
                  <input
                    type="text"
                    value={ach.description}
                    onChange={(e) =>
                      updateAchievement(ach.id, { description: e.target.value })
                    }
                    className="w-full px-2 py-1 text-xs text-slate-600 border border-slate-300 rounded bg-white"
                    placeholder={isEn ? 'Sustained delivery of targets...' : 'Superación sostenida de objetivos...'}
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={() => removeAchievement(ach.id)}
                className="p-1 text-slate-400 hover:text-red-600 mt-4"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Skills by Categories */}
      <div className="pt-4 border-t border-slate-200">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h3 className="text-sm font-semibold text-slate-800">
              {isEn ? 'Competencies & Technical Skills' : 'Competencias y Habilidades'}
            </h3>
            <p className="text-xs text-slate-500">
              {isEn
                ? 'Organized by core domains (Engines, Shaders, Pipelines & Automation).'
                : 'Organizadas por áreas clave (Motores 3D, Shaders, Pipelines y Automatización).'}
            </p>
          </div>
          <button
            type="button"
            onClick={addCategory}
            className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-medium"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{isEn ? 'New Category' : 'Nueva Categoría'}</span>
          </button>
        </div>

        <div className="space-y-3">
          {skillCategories.map((cat) => (
            <div
              key={cat.id}
              className="p-3 bg-white border border-slate-200 rounded-lg space-y-2"
            >
              <div className="flex items-center justify-between">
                <input
                  type="text"
                  value={cat.name}
                  onChange={(e) => {
                    const val = e.target.value;
                    onSkillsChange(
                      skillCategories.map((c) =>
                        c.id === cat.id ? { ...c, name: val } : c
                      )
                    );
                  }}
                  className="font-semibold text-xs text-slate-800 border-b border-dashed border-slate-300 focus:border-blue-600 outline-none pb-0.5"
                />
                <button
                  type="button"
                  onClick={() => removeCategory(cat.id)}
                  className="text-slate-400 hover:text-red-600 p-1"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>

              {/* Skills tags */}
              <div className="flex flex-wrap gap-1.5">
                {cat.skills.map((skill, sIdx) => (
                  <span
                    key={sIdx}
                    className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-100 text-slate-700 text-xs rounded border border-slate-200"
                  >
                    <span>{skill}</span>
                    <button
                      type="button"
                      onClick={() => removeSkillFromCategory(cat.id, sIdx)}
                      className="hover:text-red-600"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>

              {/* Add skill input */}
              <div className="flex gap-1.5 pt-1">
                <input
                  type="text"
                  value={newSkillInput[cat.id] || ''}
                  onChange={(e) =>
                    setNewSkillInput({
                      ...newSkillInput,
                      [cat.id]: e.target.value,
                    })
                  }
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addSkillToCategory(cat.id);
                    }
                  }}
                  placeholder={isEn ? 'Type a skill and press Enter...' : 'Escribe una habilidad y presiona Enter...'}
                  className="flex-1 px-2.5 py-1 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-blue-600 outline-none"
                />
                <button
                  type="button"
                  onClick={() => addSkillToCategory(cat.id)}
                  className="px-2.5 py-1 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded"
                >
                  {isEn ? 'Add' : 'Añadir'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Education */}
      <div className="pt-4 border-t border-slate-200">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-slate-800">
            {isEn ? 'Education' : 'Formación Académica'}
          </h3>
          <button
            type="button"
            onClick={addEducation}
            className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-medium"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{isEn ? 'Add Education' : 'Añadir Estudio'}</span>
          </button>
        </div>

        <div className="space-y-2">
          {education.map((edu) => (
            <div
              key={edu.id}
              className="p-3 bg-white border border-slate-200 rounded-lg space-y-2"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={edu.degree}
                    onChange={(e) =>
                      updateEducation(edu.id, { degree: e.target.value })
                    }
                    placeholder={isEn ? 'Degree obtained' : 'Título obtenido'}
                    className="px-2 py-1 text-xs border border-slate-300 rounded font-medium"
                  />
                  <input
                    type="text"
                    value={edu.institution}
                    onChange={(e) =>
                      updateEducation(edu.id, { institution: e.target.value })
                    }
                    placeholder={isEn ? 'University or institution' : 'Universidad o institución'}
                    className="px-2 py-1 text-xs border border-slate-300 rounded"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeEducation(edu.id)}
                  className="p-1 text-slate-400 hover:text-red-600 ml-2"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  value={edu.graduationYear}
                  onChange={(e) =>
                    updateEducation(edu.id, { graduationYear: e.target.value })
                  }
                  placeholder={isEn ? 'Graduation year (e.g. 2018)' : 'Año de egreso (ej. 2018)'}
                  className="px-2 py-1 text-xs border border-slate-300 rounded"
                />
                <input
                  type="text"
                  value={edu.details || ''}
                  onChange={(e) =>
                    updateEducation(edu.id, { details: e.target.value })
                  }
                  placeholder={isEn ? 'Details / Specialization (optional)' : 'Detalles / Especialidad (opcional)'}
                  className="px-2 py-1 text-xs border border-slate-300 rounded"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Certifications */}
      <div className="pt-4 border-t border-slate-200">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-slate-800">
            {isEn ? 'Professional Certifications' : 'Certificaciones Profesionales'}
          </h3>
          <button
            type="button"
            onClick={addCertification}
            className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-medium"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{isEn ? 'Add Certification' : 'Añadir Certificación'}</span>
          </button>
        </div>

        <div className="space-y-2">
          {certifications.map((cert) => (
            <div
              key={cert.id}
              className="p-2.5 bg-white border border-slate-200 rounded flex items-center gap-2"
            >
              <input
                type="text"
                value={cert.name}
                onChange={(e) =>
                  updateCertification(cert.id, { name: e.target.value })
                }
                placeholder={isEn ? 'Certificate name' : 'Nombre del certificado'}
                className="flex-1 px-2 py-1 text-xs border border-slate-300 rounded font-medium"
              />
              <input
                type="text"
                value={cert.issuer}
                onChange={(e) =>
                  updateCertification(cert.id, { issuer: e.target.value })
                }
                placeholder={isEn ? 'Issuer' : 'Institución'}
                className="w-36 px-2 py-1 text-xs border border-slate-300 rounded"
              />
              <input
                type="text"
                value={cert.year}
                onChange={(e) =>
                  updateCertification(cert.id, { year: e.target.value })
                }
                placeholder={isEn ? 'Year' : 'Año'}
                className="w-16 px-2 py-1 text-xs border border-slate-300 rounded text-center"
              />
              <button
                type="button"
                onClick={() => removeCertification(cert.id)}
                className="p-1 text-slate-400 hover:text-red-600"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Languages */}
      <div className="pt-4 border-t border-slate-200">
        <h3 className="text-sm font-semibold text-slate-800 mb-2">
          {isEn ? 'Languages' : 'Idiomas'}
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {languages.map((l, index) => (
            <div key={l.id} className="p-2 bg-slate-50 border border-slate-200 rounded">
              <label className="text-[10px] text-slate-500 font-medium block mb-1">
                {l.name}
              </label>
              <input
                type="text"
                value={l.level}
                onChange={(e) => {
                  const updated = [...languages];
                  updated[index] = { ...l, level: e.target.value };
                  onLanguagesChange(updated);
                }}
                className="w-full px-2 py-1 text-xs border border-slate-300 rounded bg-white"
                placeholder={isEn ? 'Native / Intermediate / Advanced' : 'Nativo / Intermedio / Avanzado'}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
