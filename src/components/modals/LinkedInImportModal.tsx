import React, { useState } from 'react';
import { X, Sparkles, Check, Linkedin, FileText } from 'lucide-react';
import { ResumeData } from '../../types/resume';

interface LinkedInImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentData: ResumeData;
  onApply: (newData: ResumeData) => void;
  language?: 'es' | 'en';
}

export const LinkedInImportModal: React.FC<LinkedInImportModalProps> = ({
  isOpen,
  onClose,
  currentData,
  onApply,
  language = 'es',
}) => {
  const [activeTab, setActiveTab] = useState<'presets' | 'text'>('presets');
  const [rawText, setRawText] = useState('');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const isEn = language === 'en';

  const handleApplyPreset = (
    type: 'orblite_leader' | 'ue5_digital_twins' | 'aaa_ea_sports' | 'vr_simulation_lead'
  ) => {
    let updated: ResumeData = JSON.parse(JSON.stringify(currentData));

    if (type === 'orblite_leader') {
      updated.personalInfo.title = isEn
        ? 'Lead Automation Engineer & Platform Developer | Orblite'
        : 'Lead Automation Engineer & Platform Developer | Orblite';
      updated.personalInfo.summary = isEn
        ? 'Lead Automation Engineer and Platform Developer combining full-stack web and sensor telemetry with modern AI API integrations and 3D simulation engineering. Currently Lead Automation Engineer & Platform Developer at Orblite, engineering AI workflow automations, vehicle telematics infrastructure, and custom internal ERP/CRM applications (TypeScript, React, RESTful APIs, SQL Supabase, AI/LLM APIs, Cloudflare). Extensive background developing industrial Digital Twins for global Fortune 500 enterprise clients (automotive, tech, and pharmaceutical sectors under strict NDAs) and Technical Art for premier AAA sports franchise at an elite co-development studio (verified shipped credit on MobyGames for EA Sports College Football 25, interactive UI/UX in Frostbite, Perforce P4, and Jenkins CI).'
        : 'Lead Automation Engineer y Desarrollador de Plataformas con sólida experiencia en integración de APIs de Inteligencia Artificial (LLMs), sistemas telemáticos en tiempo real y aplicaciones web de alto rendimiento. Actualmente Lead Automation Engineer & Platform Developer en Orblite, liderando automatizaciones de flujos con IA, infraestructura telemática vehicular y desarrollo de sistemas ERP/CRM propietarios (TypeScript, React, APIs REST, SQL Supabase, Cloudflare). Experiencia previa destacada en simulación industrial y gemelos digitales para corporativos globales Fortune 500 y como Artista Técnico en estudio de co-desarrollo para título deportivo AAA de clase mundial con crédito verificado en MobyGames (EA Sports College Football 25).';
    } else if (type === 'ue5_digital_twins') {
      updated.personalInfo.title = isEn
        ? 'Senior Technical Artist & Unreal Engine 5 Developer | Digital Twins & VR'
        : 'Artista Técnico Senior & Desarrollador Unreal Engine 5 | Digital Twins & VR';
      updated.personalInfo.summary = isEn
        ? 'Industrial 3D Simulation & Digital Twins Specialist with Unreal Engine 5 and Arch FlexSim. Extensive background developing manufacturing simulation environments for global Fortune 500 leaders (automotive, tech, and pharmaceutical sectors under strict NDAs) with real-time bottleneck detection, thermal layout optimization, and immersive VR operator training simulators.'
        : 'Artista Técnico y Desarrollador de Aplicaciones 3D con más de 7 años de experiencia construyendo experiencias inmersivas interactivas, Gemelos Digitales (Digital Twins) industriales y títulos AAA en Unreal Engine (UE4 / UE5) y Frostbite. Especialista en optimización de rendimiento en tiempo real, Realidad Virtual (VR), simulación de líneas de producción para corporativos globales Fortune 500 bajo acuerdos de confidencialidad, integración de UI/UX, pipelines con Perforce y automatización CI con Jenkins.';
    } else if (type === 'aaa_ea_sports') {
      updated.personalInfo.title = isEn
        ? 'Senior Technical Artist | AAA Game Co-Development (Frostbite & Unreal)'
        : 'Artista Técnico Senior | Co-Desarrollo de Videojuegos AAA (Frostbite & Unreal)';
      updated.personalInfo.summary = isEn
        ? 'Senior Technical Artist with proven AAA production track record at an elite co-development studio (DEVBOT / CGBOT) on premier sports title EA Sports College Football 25 for a global publisher (verified shipped credit on MobyGames). Specialized in interactive UI/UX architecture, Frostbite engine optimization, solid 60+ FPS compliance, enterprise Perforce (P4) branching, and automated Jenkins CI testing suites. Strict respect for client NDAs and industry privacy.'
        : 'Artista Técnico Senior con probada trayectoria en estudio de co-desarrollo AAA (DEVBOT / CGBOT) asignado a producción deportiva de clase mundial (EA Sports College Football 25) para publisher internacional líder (crédito público y verificable en MobyGames). Especializado en arquitectura e integración de UI/UX interactiva en el motor Frostbite, pipelines con Perforce (P4), integración continua con Jenkins y validación rigurosa a 60+ FPS, con estricto respeto a la confidencialidad y privacidad del cliente.';
    } else if (type === 'vr_simulation_lead') {
      updated.personalInfo.title = isEn
        ? 'Virtual Reality (VR) & Manufacturing Simulation Lead'
        : 'Líder en Realidad Virtual (VR) & Simuladores de Manufactura';
      updated.personalInfo.summary = isEn
        ? 'Virtual Reality (VR) & Industrial Simulation Lead specialized in immersive training environments for high-hazard operations and manufacturing Digital Twins with Unreal Engine 5 and FlexSim. Proven history accelerating operator onboarding curves and cutting factory floor operational error rates for Fortune 500 enterprise plants.'
        : 'Especialista en desarrollo inmersivo para Realidad Virtual (Meta Quest, HTC Vive, Oculus Rift) enfocado en entornos de capacitación industrial de alto riesgo y digital twins con Unreal Engine 5 y FlexSim. Experiencia probada acelerando curvas de aprendizaje para operadores y reduciendo fallas operativas en plantas industriales de corporativos Fortune 500 bajo acuerdos de confidencialidad.';
    }

    if (!updated.personalInfo.portfolioUrl) {
      updated.personalInfo.portfolioUrl = 'https://drive.google.com/drive/folders/1LKf87mfVzE8CNmOU7AsXl2hRKJkLWtZN?usp=sharing';
    }
    if (!updated.personalInfo.websiteUrl) {
      updated.personalInfo.websiteUrl = 'https://orb-lite.com';
    }
    if (!updated.personalInfo.githubUrl) {
      updated.personalInfo.githubUrl = 'https://github.com/Orb-lite/Orb-Lite';
    }

    onApply(updated);
    setSuccessMessage('¡Perfil actualizado con éxito!');
    setTimeout(() => {
      setSuccessMessage(null);
      onClose();
    }, 900);
  };

  const handleParseRawText = () => {
    if (!rawText.trim()) return;

    const updated: ResumeData = JSON.parse(JSON.stringify(currentData));
    const lines = rawText.split('\n').map((l) => l.trim()).filter(Boolean);

    if (lines.length > 0 && lines.length <= 5 && rawText.length > 80) {
      updated.personalInfo.summary = rawText;
    } else if (lines.length > 0) {
      const newBullet = lines.join(' ');
      if (updated.experiences[0]) {
        updated.experiences[0].highlights.push(newBullet.slice(0, 220));
      }
    }

    onApply(updated);
    setSuccessMessage('¡Texto integrado a tu CV!');
    setTimeout(() => {
      setSuccessMessage(null);
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
        {/* Modal Header */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center">
              <Linkedin className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Optimización de Perfil Técnico
              </h3>
              <p className="text-[11px] text-slate-500">
                Perfil de Isaac Gómez Estrada (LinkedIn: isaac-gomez-estrada-6959872a0)
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Tabs */}
        <div className="flex border-b border-slate-200 px-4 pt-2 gap-4 text-xs font-medium">
          <button
            type="button"
            onClick={() => setActiveTab('presets')}
            className={`pb-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'presets'
                ? 'border-b-2 border-sky-600 text-sky-600 font-semibold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Enfoques Especializados</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('text')}
            className={`pb-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'text'
                ? 'border-b-2 border-sky-600 text-sky-600 font-semibold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Pegar Más Texto de LinkedIn</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 space-y-4 max-h-[70vh] overflow-y-auto">
          {successMessage && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {activeTab === 'presets' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-600">
                Selecciona la orientación estratégica que deseas proyectar en tu CV para postulaciones específicas:
              </p>

              <div
                onClick={() => handleApplyPreset('orblite_leader')}
                className="p-3 rounded-lg border border-slate-200 hover:border-sky-500 hover:bg-sky-50/40 cursor-pointer transition-all space-y-1 group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 group-hover:text-sky-700">
                    Lead Automation Engineer & Platform Developer (Orblite)
                  </span>
                  <span className="text-[10px] bg-sky-100 text-sky-800 px-1.5 py-0.5 rounded font-medium">
                    Puesto Actual
                  </span>
                </div>
                <p className="text-[11px] text-slate-600">
                  Automatización de flujos con IA, infraestructura telemática y simulación de datos vehiculares, ERP/CRM interno (React, TypeScript, Supabase, Cloudflare).
                </p>
              </div>

              <div
                onClick={() => handleApplyPreset('ue5_digital_twins')}
                className="p-3 rounded-lg border border-slate-200 hover:border-sky-500 hover:bg-sky-50/40 cursor-pointer transition-all space-y-1 group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 group-hover:text-sky-700">
                    Technical Artist & Digital Twins UE5 (Simulación Industrial)
                  </span>
                </div>
                <p className="text-[11px] text-slate-600">
                  Enfoque en gemelos digitales industriales, simulación con FlexSim y Unreal Engine 5 para corporativos globales bajo acuerdos de confidencialidad.
                </p>
              </div>

              <div
                onClick={() => handleApplyPreset('aaa_ea_sports')}
                className="p-3 rounded-lg border border-slate-200 hover:border-sky-500 hover:bg-sky-50/40 cursor-pointer transition-all space-y-1 group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 group-hover:text-sky-700">
                    Artista Técnico AAA · Co-Desarrollo (DEVBOT / CGBOT)
                  </span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded font-medium">
                    Perfil Discreto / NDA
                  </span>
                </div>
                <p className="text-[11px] text-slate-600">
                  Especializado para estudios de co-desarrollo AAA: UI/UX en Frostbite, pipelines con Perforce, Jenkins y respeto estricto a la privacidad de clientes.
                </p>
              </div>

              <div
                onClick={() => handleApplyPreset('vr_simulation_lead')}
                className="p-3 rounded-lg border border-slate-200 hover:border-sky-500 hover:bg-sky-50/40 cursor-pointer transition-all space-y-1 group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 group-hover:text-sky-700">
                    Líder en Realidad Virtual & Capacitación Inmersiva
                  </span>
                </div>
                <p className="text-[11px] text-slate-600">
                  Enfoque en Meta Quest, HTC Vive, Oculus y simuladores para capacitación segura de operarios industriales.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'text' && (
            <div className="space-y-3">
              <p className="text-xs text-slate-600">
                Pega cualquier fragmento adicional de tu LinkedIn (cursos, aptitudes, publicaciones o nuevos empleos):
              </p>
              <textarea
                rows={6}
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                placeholder="Pega aquí el texto de tu perfil de LinkedIn..."
                className="w-full p-2.5 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-sky-600 outline-none leading-relaxed"
              />
              <button
                type="button"
                disabled={!rawText.trim()}
                onClick={handleParseRawText}
                className="w-full py-2 bg-sky-600 hover:bg-sky-700 text-white rounded text-xs font-medium transition-colors disabled:opacity-50"
              >
                Analizar e Integrar a mi CV
              </button>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
