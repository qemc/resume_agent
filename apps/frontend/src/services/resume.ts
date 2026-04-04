import { api } from './api';
import type {
    Contact,
    ResumeLang,
    ContactDataRow,
    ExperienceRow,
    EducationRow,
    CertificateRow,
    ProjectRow,
    SkillRow,
    LanguageRow,
    InterestRow,
} from '@/types';


// ── Contact Data ──

export const getContact = async (lang: ResumeLang): Promise<ContactDataRow | null> => {
    try {
        const response = await api.get<ContactDataRow>(`/contact/${lang}`);
        return response.data;
    } catch (error: any) {
        if (error.response?.status === 404) return null;
        throw error;
    }
};

export const createContact = async (data: {
    resume_lang: ResumeLang;
    email: string;
    phone_number: string;
    first_name: string;
    last_name: string;
    linkedin?: string;
    github?: string;
    website?: string;
    location?: string;
}): Promise<ContactDataRow> => {
    const response = await api.post<ContactDataRow>('/contact', data);
    return response.data;
};

export const updateContact = async (lang: ResumeLang, contact: Partial<Contact>): Promise<ContactDataRow> => {
    const response = await api.patch<ContactDataRow>(`/contact/${lang}`, contact);
    return response.data;
};


// ── Experiences ──

export const getExperiences = async (lang: ResumeLang): Promise<ExperienceRow[]> => {
    const response = await api.get<ExperienceRow[]>(`/experiences/${lang}`);
    return response.data;
};

export const createExperience = async (lang: ResumeLang, data: {
    company: string;
    position: string;
    start_date?: string;
    end_date?: string;
    current?: boolean;
    description?: string;
}): Promise<ExperienceRow> => {
    const response = await api.post<ExperienceRow>('/experiences', {
        resume_lang: lang,
        ...data,
    });
    return response.data;
};

export const updateExperience = async (
    id: number,
    data: Partial<{
        company: string;
        position: string;
        start_date: string;
        end_date: string;
        current: boolean;
        description: string;
    }>,
    options?: { descriptionChanged?: boolean }
): Promise<ExperienceRow> => {
    const response = await api.patch<ExperienceRow>(`/experiences/${id}`, {
        ...data,
        _descriptionChanged: options?.descriptionChanged ?? true,
    });
    return response.data;
};

export const deleteExperience = async (id: number): Promise<void> => {
    await api.delete(`/experiences/${id}`);
};


// ── Education ──

export const getEducation = async (lang: ResumeLang): Promise<EducationRow[]> => {
    const response = await api.get<EducationRow[]>(`/education/${lang}`);
    return response.data;
};

export const createEducation = async (lang: ResumeLang, data: {
    university: string;
    degree: string;
    start_date?: string;
    end_date?: string;
    current?: boolean;
}): Promise<EducationRow> => {
    const response = await api.post<EducationRow>('/education', {
        resume_lang: lang,
        ...data,
    });
    return response.data;
};

export const updateEducation = async (
    id: number,
    data: Partial<{
        university: string;
        degree: string;
        start_date: string;
        end_date: string;
        current: boolean;
    }>
): Promise<EducationRow> => {
    const response = await api.patch<EducationRow>(`/education/${id}`, data);
    return response.data;
};

export const deleteEducation = async (id: number): Promise<void> => {
    await api.delete(`/education/${id}`);
};


// ── Certificates ──

export const getCertificates = async (lang: ResumeLang): Promise<CertificateRow[]> => {
    const response = await api.get<CertificateRow[]>(`/certificates/${lang}`);
    return response.data;
};

export const createCertificate = async (lang: ResumeLang, data: {
    certificate_name: string;
    issuer: string;
    issue_date?: string;
    expiry_date?: string;
    credential_id?: string;
    url?: string;
}): Promise<CertificateRow> => {
    const response = await api.post<CertificateRow>('/certificates', {
        resume_lang: lang,
        ...data,
    });
    return response.data;
};

export const updateCertificate = async (
    id: number,
    data: Partial<{
        certificate_name: string;
        issuer: string;
        issue_date: string;
        expiry_date: string;
        credential_id: string;
        url: string;
    }>
): Promise<CertificateRow> => {
    const response = await api.patch<CertificateRow>(`/certificates/${id}`, data);
    return response.data;
};

export const deleteCertificate = async (id: number): Promise<void> => {
    await api.delete(`/certificates/${id}`);
};


// ── Projects ──

export const getProjects = async (lang: ResumeLang): Promise<ProjectRow[]> => {
    const response = await api.get<ProjectRow[]>(`/projects/${lang}`);
    return response.data;
};

export const createProject = async (lang: ResumeLang, data: {
    project_name: string;
    description?: string;
    url?: string;
}): Promise<ProjectRow> => {
    const response = await api.post<ProjectRow>('/projects', {
        resume_lang: lang,
        ...data,
    });
    return response.data;
};

export const updateProject = async (
    id: number,
    data: Partial<{
        project_name: string;
        description: string;
        url: string;
    }>
): Promise<ProjectRow> => {
    const response = await api.patch<ProjectRow>(`/projects/${id}`, data);
    return response.data;
};

export const deleteProject = async (id: number): Promise<void> => {
    await api.delete(`/projects/${id}`);
};


// ── Skills ──

export const getSkills = async (lang: ResumeLang): Promise<SkillRow[]> => {
    const response = await api.get<SkillRow[]>(`/skills/${lang}`);
    return response.data;
};

export const createSkill = async (lang: ResumeLang, data: {
    skill: string;
    level?: string;
    category?: string;
}): Promise<SkillRow> => {
    const response = await api.post<SkillRow>('/skills', {
        resume_lang: lang,
        ...data,
    });
    return response.data;
};

export const deleteSkill = async (id: number): Promise<void> => {
    await api.delete(`/skills/${id}`);
};


// ── Languages ──

export const getLanguages = async (lang: ResumeLang): Promise<LanguageRow[]> => {
    const response = await api.get<LanguageRow[]>(`/languages/${lang}`);
    return response.data;
};

export const createLanguage = async (lang: ResumeLang, data: {
    name: string;
    level: string;
}): Promise<LanguageRow> => {
    const response = await api.post<LanguageRow>('/languages', {
        resume_lang: lang,
        ...data,
    });
    return response.data;
};

export const deleteLanguage = async (id: number): Promise<void> => {
    await api.delete(`/languages/${id}`);
};


// ── Interests ──

export const getInterests = async (lang: ResumeLang): Promise<InterestRow[]> => {
    const response = await api.get<InterestRow[]>(`/interests/${lang}`);
    return response.data;
};

export const createInterest = async (lang: ResumeLang, data: {
    interest: string;
}): Promise<InterestRow> => {
    const response = await api.post<InterestRow>('/interests', {
        resume_lang: lang,
        ...data,
    });
    return response.data;
};

export const deleteInterest = async (id: number): Promise<void> => {
    await api.delete(`/interests/${id}`);
};
