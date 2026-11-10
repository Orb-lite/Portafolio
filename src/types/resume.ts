export interface PersonalInfo {
  fullName: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  linkedinUrl: string;
  websiteUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
  mobygamesUrl?: string;
  age?: number | string;
  summary: string;
  photoUrl?: string;
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  location: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  highlights: string[];
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  location: string;
  graduationYear: string;
  details?: string;
}

export interface SkillCategory {
  id: string;
  name: string;
  skills: string[];
}

export interface Language {
  id: string;
  name: string;
  level: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  year: string;
}

export interface Achievement {
  id: string;
  title: string;
  metric: string;
  description: string;
}

export type TemplateType = 'executive' | 'modern' | 'minimal' | 'tech';
export type SpacingType = 'compact' | 'normal' | 'relaxed';
export type FontType = 'sans' | 'serif' | 'mono';
export type PaperSizeType = 'a4' | 'letter';

export interface StyleConfig {
  template: TemplateType;
  accentColor: string;
  fontFamily: FontType;
  spacing: SpacingType;
  showPhoto: boolean;
  paperSize: PaperSizeType;
  fontSize: 'sm' | 'base' | 'md';
}

export interface ResumeData {
  personalInfo: PersonalInfo;
  experiences: Experience[];
  education: Education[];
  skillCategories: SkillCategory[];
  languages: Language[];
  certifications: Certification[];
  achievements: Achievement[];
}

export interface CoverLetterData {
  recipient: string;
  jobTitle: string;
  companyName: string;
  date: string;
  salutation: string;
  opening: string;
  bodyParagraphs: string[];
  closing: string;
  signoff: string;
  fullName: string;
  language: 'es' | 'en';
}

export interface JobMatchResult {
  detectedLanguage: 'es' | 'en';
  matchScore: number;
  extractedTitle: string;
  extractedCompany: string;
  matchedKeywords: string[];
  suggestedSummary: string;
  suggestedTitle: string;
  coverLetter: CoverLetterData;
  coverLetterFullText: string;
}
