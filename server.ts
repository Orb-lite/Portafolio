import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json({ limit: '2mb' }));

  app.post('/api/tailor-job', async (req, res) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey || apiKey === 'MY_GEMINI_API_KEY' || apiKey.length <= 5) {
        return res.status(503).json({ error: 'GEMINI_API_KEY not configured' });
      }

      const { jobText, resume, language } = req.body ?? {};
      if (!jobText || !resume || (language !== 'es' && language !== 'en')) {
        return res.status(400).json({ error: 'Invalid request payload' });
      }

      const ai = new GoogleGenAI({ apiKey });
      const prompt = `You are a high-level executive recruiter, game development producer, and career strategist.
Analyze the following job proposal and the candidate's real profile (Isaac Gómez Estrada), and create:
1. An exceptional, tailored Cover Letter addressed "A quien corresponda:" (if Spanish) or "To Whom It May Concern:" (if English), or to the specific hiring team if mentioned. It MUST be written entirely in ${language === 'es' ? 'Spanish' : 'English'}.
2. An optimized candidate Title and Professional Summary tailored specifically for this proposal, matching relevant keywords and Isaac's authentic achievements.
3. A match score (0-100) and list of matched keywords.

CRITICAL PRIVACY & DISCRETION RULE (NDA COMPLIANCE):
Isaac Gomez Estrada values client privacy, non-disclosure agreements (NDAs), and professional discretion above all. Do NOT carelessly broadcast internal client names (such as Ford, Google, Amazon, Pfizer, Electronic Arts). Instead, refer to them professionally and discreetly:
- For AAA game dev work: 'producciones y franquicias deportivas AAA de calibre internacional para publisher global líder (créditos públicos y verificables en títulos lanzados)' with Frostbite, Perforce (P4), and Jenkins CI.
- For industrial simulation: 'proyectos de Gemelos Digitales (Digital Twins) para corporativos globales Fortune 500 (sectores automotriz, tecnología avanzada y farmacéutica bajo estrictos acuerdos de confidencialidad)' with Unreal Engine 5 and FlexSim.
- If the job offer is from CGBOT or DEVBOT: Recognize that Isaac already worked at DEVBOT as Technical Artist on their major AAA productions. Express genuine enthusiasm to rejoin/reconnect with DEVBOT / CGBOT, highlight zero ramp-up time, proven mastery of their Perforce/Jenkins/Frostbite pipelines, availability on-site in Zapopan / Guadalajara (or hybrid/remote), and his proven dedication to protecting studio and client confidentiality!

Job Proposal:
${jobText}

Candidate Profile:
Name: ${resume.personalInfo?.fullName ?? ''}
Current: ${resume.personalInfo?.title ?? ''}
Location: ${resume.personalInfo?.location || 'Zapopan / Guadalajara, Jalisco, México (Presencial, Híbrido o Remoto)'}
Contact: ${resume.personalInfo?.email ?? ''} · ${resume.personalInfo?.phone ?? ''}
Portfolio & Links:
- Website / SaaS Platform: ${resume.personalInfo?.websiteUrl || 'https://orb-lite.com'}
- GitHub: ${resume.personalInfo?.githubUrl || 'https://github.com/Orb-lite/Orb-Lite'}
- Portfolio Folder (Google Drive): ${resume.personalInfo?.portfolioUrl || 'https://drive.google.com/drive/folders/1LKf87mfVzE8CNmOU7AsXl2hRKJkLWtZN?usp=sharing'}
- LinkedIn: ${resume.personalInfo?.linkedinUrl ?? ''}
Key experience:
- Orblite (Jun 2026-Present): Lead Automation Engineer & Platform Developer (AI workflow automation, telematics & data simulation infrastructure, internal ERP/CRM tooling, TypeScript, React, RESTful APIs, SQL Supabase, AI/LLM API Integration, Cloudflare).
- Flex (Jun 2024-Apr 2026): Applications Developer & Unreal Engine Specialist (Digital Twins of assembly lines for Fortune 500 enterprise clients under NDA, UE5, FlexSim, real-time machine fault detection, thermal spacing, VR operator training).
- DEVBOT (Jan 2022-Aug 2023): Technical Artist on premier world-class AAA sports titles for a leading global publisher, interactive UI/UX, Frostbite engine, Perforce (P4 Helix Core), Jenkins automated CI testing, 60+ FPS verification.
- Education: Ingeniería en Tecnologías Interactivas de Animación Digital - Universidad del Valle de México (UVM 2013-2018). (English: B.S. in Interactive Technologies & Digital Animation Engineering - UVM 2013-2018).

Respond ONLY with valid JSON matching this schema:
{
  "extractedTitle": "Target position title",
  "extractedCompany": "Company name or Hiring Team",
  "matchScore": 92,
  "matchedKeywords": ["Keyword 1", "Keyword 2", ...],
  "suggestedTitle": "Optimized candidate professional title",
  "suggestedSummary": "Optimized professional summary in ${language === 'es' ? 'Spanish' : 'English'}",
  "coverLetter": {
    "salutation": "${language === 'es' ? 'A quien corresponda:' : 'To Whom It May Concern:'}",
    "opening": "Opening paragraph expressing targeted interest in the role...",
    "bodyParagraphs": [
      "First body paragraph detailing the most relevant track record matching the job...",
      "Second body paragraph detailing technical stack, methodologies, and specific achievements..."
    ],
    "closing": "Closing paragraph with value proposition and interview availability...",
    "signoff": "${language === 'es' ? 'Atentamente,' : 'Sincerely,'}"
  }
}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      if (!parsed.coverLetter) {
        return res.status(502).json({ error: 'Invalid Gemini response' });
      }
      return res.json(parsed);
    } catch (err) {
      console.error('Gemini API proxy error:', err);
      return res.status(500).json({ error: 'Failed to analyze job offer' });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
