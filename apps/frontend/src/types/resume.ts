// ── Contact ──

export interface Contact {
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
    linkedin: string;
    github: string;
    website: string;
    location: string;
}

// ── Experience ──

export interface Experience {
    id: string;
    company: string;
    position: string;
    start_date: string;
    end_date: string;
    current: boolean;
    description: string;
}

export type ExperienceInput = Omit<Experience, 'id'>;

// ── Education ──

export interface Education {
    id: string;
    university: string;
    degree: string;
    start_date: string;
    end_date: string;
    current: boolean;
}

export type EducationInput = Omit<Education, 'id'>;

// ── Skills ──

export type SkillLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';

export interface Skill {
    id: string;
    skill: string;
    level?: string;
    category?: string;
}

// ── Certificates ──

export interface Certificate {
    id: string;
    certificate_name: string;
    issuer: string;
    issue_date: string;
    expiry_date: string;
    credential_id: string;
    url: string;
}

export type CertificateInput = Omit<Certificate, 'id'>;

// ── Projects ──

export interface Project {
    id: string;
    project_name: string;
    description: string;
    url: string;
}

export type ProjectInput = Omit<Project, 'id'>;

// ── Interests ──

export interface Interest {
    id: string;
    interest: string;
}

// ── Languages ──

export type LanguageLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'Native';

export interface Language {
    id: string;
    name: string;
    level: string;
}

// ── Common ──

export type resumeLanguage = 'EN' | 'PL';
export type LanguageCode = resumeLanguage;
export type ResumeLang = 'EN' | 'PL';

// ── DB Row types (flat — what the API returns) ──

export interface ContactDataRow {
    id: number;
    user_id: number;
    resume_lang: ResumeLang;
    email: string;
    phone_number: string;
    first_name: string;
    last_name: string;
    linkedin: string;
    github: string;
    website: string;
    location: string;
}

export interface ExperienceRow {
    id: number;
    user_id: number;
    resume_lang: ResumeLang;
    company: string;
    position: string;
    start_date: string;
    end_date: string;
    current: boolean;
    description: string;
    createdAt: string;
    updatedAt: string;
}

export interface EducationRow {
    id: number;
    user_id: number;
    resume_lang: ResumeLang;
    university: string;
    degree: string;
    start_date: string;
    end_date: string;
    current: boolean;
}

export interface CertificateRow {
    id: number;
    user_id: number;
    resume_lang: ResumeLang;
    certificate_name: string;
    issuer: string;
    issue_date: string;
    expiry_date: string;
    credential_id: string;
    url: string;
}

export interface ProjectRow {
    id: number;
    user_id: number;
    resume_lang: ResumeLang;
    project_name: string;
    description: string;
    url: string;
}

export interface SkillRow {
    id: number;
    user_id: number;
    resume_lang: ResumeLang;
    skill: string;
    level: string | null;
    category: string | null;
}

export interface LanguageRow {
    id: number;
    user_id: number;
    resume_lang: ResumeLang;
    name: string;
    level: string;
}

export interface InterestRow {
    id: number;
    user_id: number;
    resume_lang: ResumeLang;
    interest: string;
}

// ── Resume page state ──

export interface ResumeData {
    contact: ContactDataRow | null;
    experienceRows: ExperienceRow[];
    educationRows: EducationRow[];
    certificateRows: CertificateRow[];
    projectRows: ProjectRow[];
    skillRows: SkillRow[];
    languageRows: LanguageRow[];
    interestRows: InterestRow[];
}

// ── Career Paths & Topics ──

export interface CareerPath {
    id: number;
    user_id: number;
    resume_lang: ResumeLang;
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string;
}

export interface TopicRow {
    id: number;
    career_path_id: number;
    user_id: number;
    experience_id: number;
    resume_lang: ResumeLang;
    topic_text: string;
    topic_quotes: string[];
    createdAt: string;
}
