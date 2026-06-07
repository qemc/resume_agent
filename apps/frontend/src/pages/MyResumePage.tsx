import { useState } from 'react';
import {
    ContactSection,
    SkillsSection,
    LanguagesSection,
    InterestsSection,
    ExperienceSection,
    EducationSection,
    CertificatesSection,
    ProjectsSection,
} from '@/components/form';
import { LanguageToggle } from '@/components/LanguageToggle';
import { PageLoading } from '@/components/PageLoading';
import { SaveButton } from '@/components/SaveButton';
import { ErrorBanner } from '@/components/ErrorBanner';
import { useResumePage } from '@/hooks/useResumePage';
import { pickLang, resumePage as resumePageLabels } from '@/lib/translations';
import type { Skill, Language, Interest } from '@/types';

export function MyResumePage() {
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const page = useResumePage(setErrorMessage);
    const t = pickLang(resumePageLabels, page.activeLang);

    if (page.isLoading) {
        return <PageLoading message={t.loading} />;
    }

    const saveBtn = (section: string, onClick: () => void) => (
        <SaveButton
            section={section}
            activeSection={page.savingSection}
            onClick={onClick}
            lang={page.activeLang}
        />
    );

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <h1 className="text-2xl font-bold">{t.title}</h1>
                <LanguageToggle activeLang={page.activeLang} onChange={page.setActiveLang} />
            </div>

            <ErrorBanner message={errorMessage} onDismiss={() => setErrorMessage(null)} />

            <ContactSection
                data={page.formData.contact}
                onChange={page.handleContactChange}
                extraHeaderAction={saveBtn('contact', page.handleSaveContact)}
                lang={page.activeLang}
            />

            <ExperienceSection
                experiences={page.formData.experiences}
                onAdd={page.experiences.add}
                onRemove={page.experiences.remove}
                onUpdate={page.handleUpdateExperienceLocal}
                extraHeaderAction={saveBtn('experiences', page.handleSaveExperiences)}
                lang={page.activeLang}
            />

            <SkillsSection
                skills={page.formData.skills}
                onAdd={page.skills.add}
                onRemove={page.skills.remove}
                onUpdate={(id, field, value) =>
                    page.skills.updateLocal(id, field as keyof Skill, value)
                }
                extraHeaderAction={saveBtn('skills', page.skills.saveAll)}
                lang={page.activeLang}
            />

            <EducationSection
                educationRows={page.formData.education}
                onAdd={page.education.add}
                onRemove={page.education.remove}
                onUpdate={page.handleUpdateEducationLocal}
                extraHeaderAction={saveBtn('education', page.education.saveAll)}
                lang={page.activeLang}
            />

            <CertificatesSection
                certificates={page.formData.certificates}
                onAdd={page.certificates.add}
                onRemove={page.certificates.remove}
                onUpdate={page.handleUpdateCertificateLocal}
                extraHeaderAction={saveBtn('certificates', page.certificates.saveAll)}
                lang={page.activeLang}
            />

            <ProjectsSection
                projects={page.formData.projects}
                onAdd={page.projects.add}
                onRemove={page.projects.remove}
                onUpdate={page.handleUpdateProjectLocal}
                extraHeaderAction={saveBtn('projects', page.projects.saveAll)}
                lang={page.activeLang}
            />

            <LanguagesSection
                languages={page.formData.languages}
                onAdd={page.languages.add}
                onRemove={page.languages.remove}
                onUpdate={(id, field, value) =>
                    page.languages.updateLocal(id, field as keyof Language, value)
                }
                extraHeaderAction={saveBtn('languages', page.languages.saveAll)}
                lang={page.activeLang}
            />

            <InterestsSection
                interests={page.formData.interests}
                onAdd={page.interests.add}
                onRemove={page.interests.remove}
                onUpdate={(id, field, value) =>
                    page.interests.updateLocal(id, field as keyof Interest, value)
                }
                extraHeaderAction={saveBtn('interests', page.interests.saveAll)}
                lang={page.activeLang}
            />
        </div>
    );
}
