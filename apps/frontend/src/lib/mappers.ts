import type {
    Experience,
    Education,
    Skill,
    Certificate,
    Project,
    Language,
    Interest,
    ExperienceRow,
    EducationRow,
    SkillRow,
    CertificateRow,
    ProjectRow,
    LanguageRow,
    InterestRow,
} from '@/types';

export const toFormId = (id: number) => String(id);

export const toNumericId = (id: string) => parseInt(id, 10);

export const mapExperience = (row: ExperienceRow): Experience => ({
    id: toFormId(row.id),
    company: row.company,
    position: row.position,
    start_date: row.start_date,
    end_date: row.end_date,
    current: row.current,
    description: row.description,
});

export const mapEducation = (row: EducationRow): Education => ({
    id: toFormId(row.id),
    university: row.university,
    degree: row.degree,
    start_date: row.start_date,
    end_date: row.end_date,
    current: row.current,
});

export const mapSkill = (row: SkillRow): Skill => ({
    id: toFormId(row.id),
    skill: row.skill,
    level: row.level ?? '',
    category: row.category ?? '',
});

export const mapCertificate = (row: CertificateRow): Certificate => ({
    id: toFormId(row.id),
    certificate_name: row.certificate_name,
    issuer: row.issuer,
    issue_date: row.issue_date,
    expiry_date: row.expiry_date,
    credential_id: row.credential_id,
    url: row.url,
});

export const mapProject = (row: ProjectRow): Project => ({
    id: toFormId(row.id),
    project_name: row.project_name,
    description: row.description,
    url: row.url,
});

export const mapLanguage = (row: LanguageRow): Language => ({
    id: toFormId(row.id),
    name: row.name,
    level: row.level,
});

export const mapInterest = (row: InterestRow): Interest => ({
    id: toFormId(row.id),
    interest: row.interest,
});
