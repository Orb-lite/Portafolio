const {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  BorderStyle,
} = require('docx');
const fs = require('fs');
const path = require('path');

async function generateDocx() {
  const primaryColor = '1E40AF'; // Deep Blue
  const darkTextColor = '111827'; // Dark Slate
  const bodyTextColor = '374151'; // Slate Gray
  const lightGray = '9CA3AF';

  const createSectionHeader = (title) => {
    return new Paragraph({
      heading: HeadingLevel.HEADING_2,
      spacing: { before: 240, after: 80 },
      border: {
        bottom: {
          color: '2563EB',
          space: 4,
          style: BorderStyle.SINGLE,
          size: 12,
        },
      },
      children: [
        new TextRun({
          text: title.toUpperCase(),
          bold: true,
          size: 21, // ~10.5pt
          color: primaryColor,
          font: 'Calibri',
        }),
      ],
    });
  };

  const createBullet = (boldPrefix, text) => {
    return new Paragraph({
      bullet: { level: 0 },
      spacing: { before: 40, after: 40 },
      children: [
        boldPrefix
          ? new TextRun({
              text: boldPrefix + ' ',
              bold: true,
              size: 19, // 9.5pt
              color: darkTextColor,
              font: 'Calibri',
            })
          : new TextRun({ text: '' }),
        new TextRun({
          text: text,
          size: 19,
          color: bodyTextColor,
          font: 'Calibri',
        }),
      ],
    });
  };

  const doc = new Document({
    creator: 'Isaac Gómez Estrada',
    title: 'Isaac Gomez Estrada - AI-Native Engineer Resume',
    description: 'ATS-tailored Resume for AI-Native Engineer - Agentic AI & Production Operations',
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 720, // 0.5 inch
              right: 720,
              bottom: 720,
              left: 720,
            },
          },
        },
        children: [
          // Header: Name
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 0, after: 40 },
            children: [
              new TextRun({
                text: 'ISAAC GÓMEZ ESTRADA',
                bold: true,
                size: 36, // 18pt
                color: darkTextColor,
                font: 'Calibri',
              }),
            ],
          }),
          // Title
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 0, after: 60 },
            children: [
              new TextRun({
                text: 'AI-Native Engineer | Agentic AI & Production Operations',
                bold: true,
                size: 23, // 11.5pt
                color: primaryColor,
                font: 'Calibri',
              }),
            ],
          }),
          // Contact line 1
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 0, after: 30 },
            children: [
              new TextRun({
                text: 'Zapopan / Guadalajara, Mexico (Remote / Hybrid / On-site)  |  +52 33 1835 9421  |  isaacgestrada94@gmail.com',
                size: 18, // 9pt
                color: bodyTextColor,
                font: 'Calibri',
              }),
            ],
          }),
          // Links
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 0, after: 120 },
            children: [
              new TextRun({
                text: 'LinkedIn: linkedin.com/in/isaac-gomez-estrada-6959872a0  |  GitHub: github.com/Orb-lite  |  Platform: orb-lite.com',
                size: 18,
                color: '2563EB',
                font: 'Calibri',
              }),
            ],
          }),

          // Professional Summary
          createSectionHeader('Professional Summary'),
          new Paragraph({
            spacing: { before: 60, after: 120 },
            children: [
              new TextRun({
                text: 'High-performing AI-Native Engineer and Production Operations Specialist with 8+ years of software and systems engineering experience, including 4+ years designing, developing, and operating Agentic AI & Multi-Agent systems, 5+ years of production Python engineering, and 2+ years deploying enterprise workloads on Google Cloud Platform (GCP). Proven expertise across the entire lifecycle of enterprise AI solutions: agent architecture, autonomous tool-calling loops, retrieval pipelines, containerized deployment (Cloud Run, Vertex AI, GCS), automated CI/CD evaluation, real-time observability, and production incident resolution. Deep background combining real-time simulation reliability, high-throughput data streams, and production-grade generative AI orchestration.',
                size: 19,
                color: bodyTextColor,
                font: 'Calibri',
              }),
            ],
          }),

          // Core Technical Competencies
          createSectionHeader('Core Technical Competencies'),
          createBullet(
            'Agentic AI & Multi-Agent Systems (4+ Years):',
            'Autonomous AI Agents, Multi-Agent Collaboration (CrewAI, AutoGen, LangChain, LangGraph), ReAct & Planning Loops, Dynamic Tool Calling / Function Calling, Structured Output Schemas, Long & Short-Term Memory Architectures, Retrieval-Augmented Generation (RAG), Vector Embeddings (Pinecone, Chroma, pgvector), LLM Evaluation & Guardrails.'
          ),
          createBullet(
            'Python & Production Software Engineering (5+ Years):',
            'Python 3.x (Asyncio, FastAPI, Flask, Pydantic, Pytest), RESTful & gRPC APIs, Microservices Architecture, Real-Time Data Streaming & ETL, Task Queues (Celery, Redis), C++, TypeScript / Node.js, SQL Databases (PostgreSQL, Supabase, BigQuery).'
          ),
          createBullet(
            'Google Cloud Platform & Production Operations (GCP 2+ Years):',
            'GCP Infrastructure (Vertex AI, Cloud Run, Cloud Functions, Cloud Storage, BigQuery, IAM, VPC), Docker & Containerization, Continuous Integration & Continuous Deployment (GitHub Actions, Jenkins CI), Cloud Logging, Cloud Monitoring, Alert Policies, SRE Operations & Incident Triage.'
          ),
          createBullet(
            'Data Lifecycle, Testing & Systems Reliability:',
            'End-to-End AI Lifecycle Management, Continuous Evaluation Pipelines, High-Frequency Telemetry Ingestion, Anomaly Detection, Version Control (Git, Perforce P4 Helix Core), Performance Profiling, Enterprise NDA Compliance.'
          ),

          // Professional Experience
          createSectionHeader('Professional Experience'),

          // Role 1: Orblite
          new Paragraph({
            spacing: { before: 100, after: 30 },
            children: [
              new TextRun({
                text: 'Orblite',
                bold: true,
                size: 21,
                color: darkTextColor,
                font: 'Calibri',
              }),
              new TextRun({
                text: ' — Mexico',
                size: 20,
                color: lightGray,
                font: 'Calibri',
              }),
            ],
          }),
          new Paragraph({
            spacing: { before: 0, after: 60 },
            children: [
              new TextRun({
                text: 'Lead AI-Native & Automation Engineer – Agentic Systems & Production Operations',
                bold: true,
                size: 19,
                color: primaryColor,
                font: 'Calibri',
              }),
              new TextRun({
                text: '  |  Jun 2026 – Present (and Prior R&D Initiatives)',
                italics: true,
                size: 18,
                color: bodyTextColor,
                font: 'Calibri',
              }),
            ],
          }),
          createBullet(
            'Agentic AI Development:',
            'Architected, deployed, and continuously improved multi-agent production systems and autonomous AI agents using Python, LangChain/CrewAI, and FastAPI, automating enterprise analytical workflows and cutting operational latency by 75%.'
          ),
          createBullet(
            'Tool Calling & Autonomous Execution:',
            'Engineered resilient agentic loops with dynamic tool calling, structured JSON output validation, and automated fallback routines integrating LLM backends (Vertex AI / Gemini, OpenAI) with internal databases and external APIs.'
          ),
          createBullet(
            'GCP Production Operations:',
            'Containerized and deployed microservices on Google Cloud Platform (Cloud Run, Cloud Functions, Vertex AI, Google Cloud Storage, BigQuery), managing infrastructure configuration, secret management, and IAM policies.'
          ),
          createBullet(
            'Data Streaming & Production Telematics:',
            'Designed end-to-end telemetry pipelines processing high-frequency sensor streams with asynchronous Python (Asyncio, Celery) and PostgreSQL (Supabase), providing real-time data feeding directly into autonomous agent decision layers.'
          ),
          createBullet(
            'CI/CD & Continuous Evaluation:',
            'Established automated CI/CD pipelines via GitHub Actions featuring automated synthetic benchmarks, agent regression testing, and hallucination guardrails to validate model outputs before production rollout.'
          ),
          createBullet(
            'Observability & Incident Resolution:',
            'Operated live production systems utilizing GCP Cloud Logging and Monitoring, establishing custom SLO dashboards, automated alerts, and on-call operational runbooks that reduced incident resolution time by 50%.'
          ),

          // Role 2: Flex
          new Paragraph({
            spacing: { before: 140, after: 30 },
            children: [
              new TextRun({
                text: 'Multinational Manufacturing & Technology (Flex - Industrial Simulation)',
                bold: true,
                size: 21,
                color: darkTextColor,
                font: 'Calibri',
              }),
              new TextRun({
                text: ' — Zapopan, Jalisco, Mexico',
                size: 20,
                color: lightGray,
                font: 'Calibri',
              }),
            ],
          }),
          new Paragraph({
            spacing: { before: 0, after: 60 },
            children: [
              new TextRun({
                text: 'Senior Real-Time Systems & Simulation Engineer (Fortune 500 Clients)',
                bold: true,
                size: 19,
                color: primaryColor,
                font: 'Calibri',
              }),
              new TextRun({
                text: '  |  Jun 2024 – Apr 2026',
                italics: true,
                size: 18,
                color: bodyTextColor,
                font: 'Calibri',
              }),
            ],
          }),
          createBullet(
            'Enterprise Simulation Pipelines:',
            'Engineered real-time manufacturing Digital Twins and automated simulation systems for global Fortune 500 enterprise leaders (automotive, advanced tech, and medical sectors under strict NDA) using Unreal Engine 5 and Arch FlexSim.'
          ),
          createBullet(
            'Automated Anomaly Detection:',
            'Developed Python and C++ automated data analysis pipelines ingesting industrial sensor telemetry, predicting machine bottlenecks, and modeling optimal thermal and spatial configurations.'
          ),
          createBullet(
            'Production Lifecycle & Integration:',
            'Collaborated with plant operations teams to integrate simulation outputs with factory management databases, validating model accuracy against physical equipment sensor metrics.'
          ),

          // Role 3: DEVBOT
          new Paragraph({
            spacing: { before: 140, after: 30 },
            children: [
              new TextRun({
                text: 'DEVBOT (AAA Game Co-Development Studio)',
                bold: true,
                size: 21,
                color: darkTextColor,
                font: 'Calibri',
              }),
              new TextRun({
                text: ' — Monterrey, NL, Mexico (Remote)',
                size: 20,
                color: lightGray,
                font: 'Calibri',
              }),
            ],
          }),
          new Paragraph({
            spacing: { before: 0, after: 60 },
            children: [
              new TextRun({
                text: 'Technical Systems & Pipeline Engineer – AAA Productions',
                bold: true,
                size: 19,
                color: primaryColor,
                font: 'Calibri',
              }),
              new TextRun({
                text: '  |  Jan 2022 – Aug 2023',
                italics: true,
                size: 18,
                color: bodyTextColor,
                font: 'Calibri',
              }),
            ],
          }),
          createBullet(
            'Automated CI/CD Operations:',
            'Maintained and operated automated continuous integration (CI) and build verification pipelines with Jenkins for world-class AAA sports franchise EA Sports College Football 25 for a leading global publisher (publicly verified credit on MobyGames).'
          ),
          createBullet(
            'Version Control & Large-Scale Merges:',
            'Managed Perforce P4 Helix Core source control, complex branching architectures, and multi-site merge conflict resolution across massive production codebases with zero downtime.'
          ),
          createBullet(
            'Performance & Reliability Engineering:',
            'Conducted rigorous performance benchmarking, memory profiling, and 60+ FPS frame-budget validation on early playable builds, resolving technical regressions and stability bugs.'
          ),

          // Role 4: Larva / Spinar / Navi
          new Paragraph({
            spacing: { before: 140, after: 30 },
            children: [
              new TextRun({
                text: 'Larva Game Studios / Spinar / Navi 3D',
                bold: true,
                size: 21,
                color: darkTextColor,
                font: 'Calibri',
              }),
              new TextRun({
                text: ' — Guadalajara, Mexico',
                size: 20,
                color: lightGray,
                font: 'Calibri',
              }),
            ],
          }),
          new Paragraph({
            spacing: { before: 0, after: 60 },
            children: [
              new TextRun({
                text: 'Interactive Software & Systems Developer',
                bold: true,
                size: 19,
                color: primaryColor,
                font: 'Calibri',
              }),
              new TextRun({
                text: '  |  Aug 2018 – Aug 2021',
                italics: true,
                size: 18,
                color: bodyTextColor,
                font: 'Calibri',
              }),
            ],
          }),
          createBullet(
            'Systems Programming:',
            'Engineered interactive real-time systems, 3D simulations, and backend API/database connections (SQL, RESTful services) using Python, C++, and modern JavaScript.'
          ),

          // Education
          createSectionHeader('Education'),
          new Paragraph({
            spacing: { before: 80, after: 30 },
            children: [
              new TextRun({
                text: 'Universidad del Valle de México (UVM)',
                bold: true,
                size: 20,
                color: darkTextColor,
                font: 'Calibri',
              }),
              new TextRun({
                text: ' — Mexico',
                size: 19,
                color: lightGray,
                font: 'Calibri',
              }),
            ],
          }),
          new Paragraph({
            spacing: { before: 0, after: 40 },
            children: [
              new TextRun({
                text: 'B.S. in Interactive Technologies & Digital Animation Engineering',
                bold: true,
                size: 19,
                color: primaryColor,
                font: 'Calibri',
              }),
              new TextRun({
                text: ' (Ingeniería en Tecnologías Interactivas de Animación Digital)  |  2013 – 2018',
                italics: true,
                size: 18,
                color: bodyTextColor,
                font: 'Calibri',
              }),
            ],
          }),
          new Paragraph({
            spacing: { before: 0, after: 80 },
            children: [
              new TextRun({
                text: 'Comprehensive engineering degree covering software engineering, algorithms, real-time distributed systems, computational graphics, simulation architectures, and technical leadership.',
                size: 18,
                color: bodyTextColor,
                font: 'Calibri',
              }),
            ],
          }),

          // Certifications
          createSectionHeader('Certifications & Training'),
          createBullet(
            'Enterprise Agentic AI Systems & Multi-Agent Orchestration',
            'Autonomous Agent Architecture, Tool Calling, Evaluation Loops & Guardrails (2026)'
          ),
          createBullet(
            'Google Cloud Platform (GCP) Operations & Vertex AI',
            'Cloud Run, Vertex AI, Cloud Functions, IAM & Production Operations (2025)'
          ),
          createBullet(
            'Continuous Integration & Enterprise DevOps (Jenkins & Perforce)',
            'P4 Helix Core, Jenkins Automated CI/CD & Build Validation (2022)'
          ),
        ],
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  const outPath = path.resolve('public/downloads/Isaac_Gomez_AI_Native_Engineer_Resume.docx');
  fs.writeFileSync(outPath, buffer);
  console.log('Successfully written DOCX to:', outPath);
}

generateDocx().catch((err) => {
  console.error('Error generating docx:', err);
  process.exit(1);
});
