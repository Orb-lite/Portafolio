import React from 'react';
import {
  StyleConfig,
  TemplateType,
  FontType,
  SpacingType,
  PaperSizeType,
} from '../../types/resume';
import { COLOR_PALETTES } from '../../data/defaultResume';
import { Layout, Palette, Type, Sliders, Check } from 'lucide-react';

interface DesignSettingsEditorProps {
  styleConfig: StyleConfig;
  onChange: (updated: StyleConfig) => void;
  onAutoFitOnePage: () => void;
  language?: 'es' | 'en';
}

export const DesignSettingsEditor: React.FC<DesignSettingsEditorProps> = ({
  styleConfig,
  onChange,
  onAutoFitOnePage,
  language = 'es',
}) => {
  const isEn = language === 'en';
  const update = (partial: Partial<StyleConfig>) => {
    onChange({ ...styleConfig, ...partial });
  };

  const templates: { id: TemplateType; title: string; desc: string }[] = [
    {
      id: 'executive',
      title: isEn ? 'Classic Executive' : 'Ejecutivo Clásico',
      desc: isEn
        ? 'Corporate header, 2 columns, ideal for Sr. Technical Artist & Engineering Leadership.'
        : 'Encabezado corporativo, 2 columnas, ideal para Sr. Technical Artist y Liderazgo Técnico.',
    },
    {
      id: 'modern',
      title: isEn ? 'Modern & Clean' : 'Moderno & Pulcro',
      desc: isEn
        ? 'Clean layout with lateral visual accent and impact summary.'
        : 'Diseño limpio con acento visual lateral y resumen de impacto.',
    },
    {
      id: 'minimal',
      title: isEn ? 'Minimalist ATS' : 'Minimalista ATS',
      desc: isEn
        ? 'Streamlined black-and-white structure for maximum ATS parsing.'
        : 'Estructura pura en blanco y negro, máxima compatibilidad ATS.',
    },
    {
      id: 'tech',
      title: isEn ? 'Telematics & Tech' : 'Telemática & Tech',
      desc: isEn
        ? 'Tech-focused style with dark header block and highlighted metrics.'
        : 'Estilo tecnológico con bloque superior oscuro y métricas destacadas.',
    },
  ];

  return (
    <div className="space-y-6">
      {/* 1. Selector de Plantillas */}
      <div>
        <div className="flex items-center gap-1.5 mb-2">
          <Layout className="w-4 h-4 text-slate-600" />
          <h3 className="text-sm font-semibold text-slate-800">
            {isEn ? 'Design Template' : 'Plantilla de Diseño'}
          </h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {templates.map((tpl) => {
            const isSelected = styleConfig.template === tpl.id;
            return (
              <button
                key={tpl.id}
                type="button"
                onClick={() => update({ template: tpl.id })}
                className={`p-3 text-left rounded-lg border transition-all ${
                  isSelected
                    ? 'border-blue-600 bg-blue-50/50 ring-1 ring-blue-600 shadow-sm'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-slate-900">
                    {tpl.title}
                  </span>
                  {isSelected && (
                    <span className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center">
                      <Check className="w-2.5 h-2.5" />
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-slate-500 leading-snug">
                  {tpl.desc}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Paleta de Color */}
      <div className="pt-4 border-t border-slate-200">
        <div className="flex items-center gap-1.5 mb-2">
          <Palette className="w-4 h-4 text-slate-600" />
          <h3 className="text-sm font-semibold text-slate-800">
            {isEn ? 'Brand Accent Color' : 'Color de Acento Corporativo'}
          </h3>
        </div>
        <div className="flex flex-wrap items-center gap-2 mb-2">
          {COLOR_PALETTES.map((color) => {
            const isSelected = styleConfig.accentColor.toLowerCase() === color.value.toLowerCase();
            return (
              <button
                key={color.value}
                type="button"
                onClick={() => update({ accentColor: color.value })}
                className={`group flex items-center gap-2 px-2.5 py-1.5 rounded-md border text-xs transition-all ${
                  isSelected
                    ? 'border-slate-800 bg-slate-50 font-semibold'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <span
                  className="w-3.5 h-3.5 rounded-full shrink-0 shadow-xs"
                  style={{ backgroundColor: color.value }}
                />
                <span className="text-slate-700">{isEn ? color.nameEn : color.name}</span>
              </button>
            );
          })}
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500 pt-1">
          <span>{isEn ? 'Custom:' : 'Personalizado:'}</span>
          <input
            type="color"
            value={styleConfig.accentColor}
            onChange={(e) => update({ accentColor: e.target.value })}
            className="w-6 h-6 rounded cursor-pointer border border-slate-300"
          />
          <span className="font-mono text-[11px]">{styleConfig.accentColor}</span>
        </div>
      </div>

      {/* 3. Tipografía */}
      <div className="pt-4 border-t border-slate-200">
        <div className="flex items-center gap-1.5 mb-2">
          <Type className="w-4 h-4 text-slate-600" />
          <h3 className="text-sm font-semibold text-slate-800">
            {isEn ? 'Typography' : 'Fuente Tipográfica'}
          </h3>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {(
            [
              { id: 'sans', label: 'Inter Sans', sub: isEn ? 'Modern & Clean' : 'Moderna & Limpia' },
              { id: 'serif', label: 'Merriweather', sub: isEn ? 'Executive & Classic' : 'Ejecutiva & Elegante' },
              { id: 'mono', label: 'JetBrains', sub: isEn ? 'Technical & Crisp' : 'Técnica & Precisa' },
            ] as { id: FontType; label: string; sub: string }[]
          ).map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => update({ fontFamily: f.id })}
              className={`p-2 text-center rounded border text-xs transition-colors ${
                styleConfig.fontFamily === f.id
                  ? 'border-blue-600 bg-blue-50 text-blue-900 font-semibold'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
              }`}
            >
              <div>{f.label}</div>
              <div className="text-[10px] text-slate-400 font-normal">{f.sub}</div>
            </button>
          ))}
        </div>
      </div>

      {/* 4. Espaciado y Ajuste de 1 Página */}
      <div className="pt-4 border-t border-slate-200">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <Sliders className="w-4 h-4 text-slate-600" />
            <h3 className="text-sm font-semibold text-slate-800">
              {isEn ? 'Density & Spacing' : 'Densidad y Espaciado'}
            </h3>
          </div>
          <button
            type="button"
            onClick={onAutoFitOnePage}
            className="text-[11px] text-blue-700 bg-blue-50 hover:bg-blue-100 px-2 py-1 rounded font-medium border border-blue-200 transition-colors"
          >
            {isEn ? 'Fit to 1 Page' : 'Ajustar a 1 Página'}
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-3">
          {(
            [
              { id: 'compact', label: isEn ? 'Compact' : 'Compacto', tip: isEn ? 'Ideal for 1 page' : 'Ideal para 1 página' },
              { id: 'normal', label: isEn ? 'Balanced' : 'Equilibrado', tip: isEn ? 'Standard' : 'Estándar' },
              { id: 'relaxed', label: isEn ? 'Relaxed' : 'Amplio', tip: isEn ? '2-page CV' : 'CV de 2 páginas' },
            ] as { id: SpacingType; label: string; tip: string }[]
          ).map((sp) => (
            <button
              key={sp.id}
              type="button"
              onClick={() => update({ spacing: sp.id })}
              className={`p-2 text-center rounded border text-xs transition-colors ${
                styleConfig.spacing === sp.id
                  ? 'border-blue-600 bg-blue-50 text-blue-900 font-semibold'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
              }`}
            >
              <div>{sp.label}</div>
              <div className="text-[10px] text-slate-400 font-normal">{sp.tip}</div>
            </button>
          ))}
        </div>

        {/* Paper format */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <div>
            <label className="text-[11px] text-slate-600 block mb-1 font-medium">
              {isEn ? 'PDF Paper Size' : 'Tamaño de Hoja PDF'}
            </label>
            <div className="flex rounded border border-slate-200 overflow-hidden text-xs">
              {(
                [
                  { id: 'a4', label: 'A4 (210×297mm)' },
                  { id: 'letter', label: isEn ? 'Letter (8.5×11")' : 'Carta (8.5×11")' },
                ] as { id: PaperSizeType; label: string }[]
              ).map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => update({ paperSize: p.id })}
                  className={`flex-1 py-1.5 text-center font-medium transition-colors ${
                    styleConfig.paperSize === p.id
                      ? 'bg-slate-800 text-white'
                      : 'bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[11px] text-slate-600 block mb-1 font-medium">
              {isEn ? 'Font Size' : 'Tamaño de Letra'}
            </label>
            <div className="flex rounded border border-slate-200 overflow-hidden text-xs">
              {(
                [
                  { id: 'sm', label: isEn ? 'Compact' : 'Compacta' },
                  { id: 'base', label: isEn ? 'Standard' : 'Estándar' },
                  { id: 'md', label: isEn ? 'Large' : 'Grande' },
                ] as { id: 'sm' | 'base' | 'md'; label: string }[]
              ).map((fs) => (
                <button
                  key={fs.id}
                  type="button"
                  onClick={() => update({ fontSize: fs.id })}
                  className={`flex-1 py-1.5 text-center font-medium transition-colors ${
                    styleConfig.fontSize === fs.id
                      ? 'bg-slate-800 text-white'
                      : 'bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {fs.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
