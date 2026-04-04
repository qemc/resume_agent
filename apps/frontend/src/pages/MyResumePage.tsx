import { useState, useEffect } from 'react';
import { Button } from '@/components/ui';
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
import type { Contact, Skill, Language, Interest, ResumeData, ResumeLang } from '@/types';
import { emptyResumeData } from '@/lib/constants';
import {
    getContact,
    createContact,
    updateContact,
    getExperiences,
    createExperience,
    updateExperience,
    deleteExperience,
    getCertificates,
    createCertificate,
    updateCertificate,
    deleteCertificate,
    getProjects,
    createProject,
    updateProject,
    deleteProject,
    getEducation,
    createEducation,
    updateEducation,
    deleteEducation,
    getSkills,
    createSkill,
    deleteSkill,
    getLanguages,
    createLanguage,
    deleteLanguage,
    getInterests,
    createInterest,
    deleteInterest,
} from '@/services/resume';



/**
 * My Resume Data Page
 *
 * Single page with language toggle and all resume sections.
 * Each entity (contact, skills, languages, interests, experiences,
 * certificates, projects) is now a separate DB table with its own endpoints.
 */
export function MyResumePage() {
    // Active language
    const [activeLang, setActiveLang] = useState<ResumeLang>('EN');

    // Loading states
    const [isLoading, setIsLoading] = useState(true);
    const [savingSection, setSavingSection] = useState<string | null>(null);

    // Original descriptions - stored at load time to compare at save time
    const [originalExperienceDescriptions, setOriginalExperienceDescriptions] = useState<Map<number, string>>(new Map());

    // Data for both languages
    const [enData, setEnData] = useState<ResumeData>(emptyResumeData);
    const [plData, setPlData] = useState<ResumeData>(emptyResumeData);

    // Get current data based on active language
    const currentData = activeLang === 'EN' ? enData : plData;
    const setCurrentData = activeLang === 'EN' ? setEnData : setPlData;

    // Page translations
    const pageLabels = {
        EN: {
            title: 'My Resume Data',
            loading: 'Loading your resume data...',
            save: 'Save',
            saving: 'Saving...',
        },
        PL: {
            title: 'Moje Dane CV',
            loading: 'Wczytywanie danych CV...',
            save: 'Zapisz',
            saving: 'Zapisywanie...',
        }
    };

    const t = pageLabels[activeLang];

    // Load all data on mount
    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            try {
                const [
                    enContact, enExps, enEdus, enCerts, enProjs, enSkills, enLangs, enInts,
                    plContact, plExps, plEdus, plCerts, plProjs, plSkills, plLangs, plInts,
                ] = await Promise.all([
                    getContact('EN'),
                    getExperiences('EN'),
                    getEducation('EN'),
                    getCertificates('EN'),
                    getProjects('EN'),
                    getSkills('EN'),
                    getLanguages('EN'),
                    getInterests('EN'),
                    getContact('PL'),
                    getExperiences('PL'),
                    getEducation('PL'),
                    getCertificates('PL'),
                    getProjects('PL'),
                    getSkills('PL'),
                    getLanguages('PL'),
                    getInterests('PL'),
                ]);

                setEnData({
                    contact: enContact,
                    experienceRows: enExps,
                    educationRows: enEdus,
                    certificateRows: enCerts,
                    projectRows: enProjs,
                    skillRows: enSkills,
                    languageRows: enLangs,
                    interestRows: enInts,
                });

                setPlData({
                    contact: plContact,
                    experienceRows: plExps,
                    educationRows: plEdus,
                    certificateRows: plCerts,
                    projectRows: plProjs,
                    skillRows: plSkills,
                    languageRows: plLangs,
                    interestRows: plInts,
                });

                // Store original descriptions for save-time comparison
                const expDescMap = new Map<number, string>();
                [...enExps, ...plExps].forEach(row => {
                    expDescMap.set(row.id, row.description);
                });
                setOriginalExperienceDescriptions(expDescMap);
            } catch (error) {
                console.error('Failed to load resume data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, []);

    // ==========================================================================
    // Contact Handlers
    // ==========================================================================
    const handleContactChange = (field: keyof Contact, value: string) => {
        setCurrentData(prev => ({
            ...prev,
            contact: prev.contact
                ? { ...prev.contact, [field]: value }
                : { id: 0, user_id: 0, resume_lang: activeLang, first_name: '', last_name: '', email: '', phone_number: '', linkedin: '', github: '', website: '', location: '', [field]: value }
        }));
    };

    const handleSaveContact = async () => {
        setSavingSection('contact');
        try {
            if (currentData.contact?.id) {
                await updateContact(activeLang, currentData.contact);
            } else {
                const contactToSave = currentData.contact ?? { first_name: '', last_name: '', email: '', phone_number: '', linkedin: '', github: '', website: '', location: '' };
                const created = await createContact({
                    resume_lang: activeLang,
                    ...contactToSave,
                });
                setCurrentData(prev => ({ ...prev, contact: created }));
            }
        } catch (error) {
            console.error('Failed to save contact:', error);
        } finally {
            setSavingSection(null);
        }
    };

    // ==========================================================================
    // Skills Handlers (each skill is a separate DB row)
    // ==========================================================================
    const handleAddSkill = async () => {
        try {
            const created = await createSkill(activeLang, { skill: '' });
            setCurrentData(prev => ({
                ...prev,
                skillRows: [...prev.skillRows, created]
            }));
        } catch (error) {
            console.error('Failed to create skill:', error);
        }
    };

    const handleRemoveSkill = async (id: string) => {
        const numId = parseInt(id, 10);
        try {
            await deleteSkill(numId);
            setCurrentData(prev => ({
                ...prev,
                skillRows: prev.skillRows.filter(s => s.id !== numId)
            }));
        } catch (error) {
            console.error('Failed to delete skill:', error);
        }
    };

    const handleUpdateSkill = (id: string, field: keyof Skill, value: string) => {
        const numId = parseInt(id, 10);
        setCurrentData(prev => ({
            ...prev,
            skillRows: prev.skillRows.map(s => s.id === numId ? { ...s, [field]: value } : s)
        }));
    };

    // ==========================================================================
    // Languages Handlers (each language is a separate DB row)
    // ==========================================================================
    const handleAddLanguage = async () => {
        try {
            const created = await createLanguage(activeLang, { name: '', level: 'B1' });
            setCurrentData(prev => ({
                ...prev,
                languageRows: [...prev.languageRows, created]
            }));
        } catch (error) {
            console.error('Failed to create language:', error);
        }
    };

    const handleRemoveLanguage = async (id: string) => {
        const numId = parseInt(id, 10);
        try {
            await deleteLanguage(numId);
            setCurrentData(prev => ({
                ...prev,
                languageRows: prev.languageRows.filter(l => l.id !== numId)
            }));
        } catch (error) {
            console.error('Failed to delete language:', error);
        }
    };

    const handleUpdateLanguage = (id: string, field: keyof Language, value: string) => {
        const numId = parseInt(id, 10);
        setCurrentData(prev => ({
            ...prev,
            languageRows: prev.languageRows.map(l => l.id === numId ? { ...l, [field]: value } : l)
        }));
    };

    // ==========================================================================
    // Interests Handlers (each interest is a separate DB row)
    // ==========================================================================
    const handleAddInterest = async () => {
        try {
            const created = await createInterest(activeLang, { interest: '' });
            setCurrentData(prev => ({
                ...prev,
                interestRows: [...prev.interestRows, created]
            }));
        } catch (error) {
            console.error('Failed to create interest:', error);
        }
    };

    const handleRemoveInterest = async (id: string) => {
        const numId = parseInt(id, 10);
        try {
            await deleteInterest(numId);
            setCurrentData(prev => ({
                ...prev,
                interestRows: prev.interestRows.filter(i => i.id !== numId)
            }));
        } catch (error) {
            console.error('Failed to delete interest:', error);
        }
    };

    const handleUpdateInterest = (id: string, field: keyof Interest, value: string) => {
        const numId = parseInt(id, 10);
        setCurrentData(prev => ({
            ...prev,
            interestRows: prev.interestRows.map(i => i.id === numId ? { ...i, [field]: value } : i)
        }));
    };

    // ==========================================================================
    // Experiences Handlers
    // ==========================================================================
    const handleAddExperience = async () => {
        try {
            const created = await createExperience(activeLang, {
                company: '',
                position: '',
                start_date: '',
                end_date: '',
                current: false,
                description: '',
            });
            setCurrentData(prev => ({
                ...prev,
                experienceRows: [...prev.experienceRows, created]
            }));
        } catch (error) {
            console.error('Failed to create experience:', error);
        }
    };

    const handleRemoveExperience = async (id: string) => {
        const numId = parseInt(id, 10);
        try {
            await deleteExperience(numId);
            setCurrentData(prev => ({
                ...prev,
                experienceRows: prev.experienceRows.filter(e => e.id !== numId)
            }));
        } catch (error) {
            console.error('Failed to delete experience:', error);
        }
    };

    const handleUpdateExperienceLocal = (id: string, field: string, value: string | boolean) => {
        const numId = parseInt(id, 10);
        setCurrentData(prev => ({
            ...prev,
            experienceRows: prev.experienceRows.map(row =>
                row.id === numId
                    ? { ...row, [field]: value }
                    : row
            )
        }));
    };

    const handleSaveExperiences = async () => {
        if (currentData.experienceRows.length === 0) return;

        setSavingSection('experiences');
        try {
            await Promise.all(
                currentData.experienceRows.map(row => {
                    const originalDesc = originalExperienceDescriptions.get(row.id);
                    const descriptionChanged = originalDesc !== row.description;
                    const { id, user_id, resume_lang, createdAt, updatedAt, ...data } = row;
                    return updateExperience(row.id, data, { descriptionChanged });
                })
            );
            // Update originals to reflect saved state
            setOriginalExperienceDescriptions(prev => {
                const newMap = new Map(prev);
                currentData.experienceRows.forEach(row => {
                    newMap.set(row.id, row.description);
                });
                return newMap;
            });
        } catch (error) {
            console.error('Failed to save experiences:', error);
        } finally {
            setSavingSection(null);
        }
    };

    // ==========================================================================
    // Certificates Handlers
    // ==========================================================================
    const handleAddCertificate = async () => {
        try {
            const created = await createCertificate(activeLang, {
                certificate_name: '',
                issuer: '',
                issue_date: '',
                expiry_date: '',
                credential_id: '',
                url: '',
            });
            setCurrentData(prev => ({
                ...prev,
                certificateRows: [...prev.certificateRows, created]
            }));
        } catch (error) {
            console.error('Failed to create certificate:', error);
        }
    };

    const handleRemoveCertificate = async (id: string) => {
        const numId = parseInt(id, 10);
        try {
            await deleteCertificate(numId);
            setCurrentData(prev => ({
                ...prev,
                certificateRows: prev.certificateRows.filter(c => c.id !== numId)
            }));
        } catch (error) {
            console.error('Failed to delete certificate:', error);
        }
    };

    const handleUpdateCertificateLocal = (id: string, field: string, value: string) => {
        const numId = parseInt(id, 10);
        setCurrentData(prev => ({
            ...prev,
            certificateRows: prev.certificateRows.map(row =>
                row.id === numId
                    ? { ...row, [field]: value }
                    : row
            )
        }));
    };

    const handleSaveCertificates = async () => {
        if (currentData.certificateRows.length === 0) return;

        setSavingSection('certificates');
        try {
            await Promise.all(
                currentData.certificateRows.map(row => {
                    const { id, user_id, resume_lang, ...data } = row;
                    return updateCertificate(row.id, data);
                })
            );
        } catch (error) {
            console.error('Failed to save certificates:', error);
        } finally {
            setSavingSection(null);
        }
    };

    // ==========================================================================
    // Projects Handlers
    // ==========================================================================
    const handleAddProject = async () => {
        try {
            const created = await createProject(activeLang, {
                project_name: '',
                description: '',
                url: '',
            });
            setCurrentData(prev => ({
                ...prev,
                projectRows: [...prev.projectRows, created]
            }));
        } catch (error) {
            console.error('Failed to create project:', error);
        }
    };

    const handleRemoveProject = async (id: string) => {
        const numId = parseInt(id, 10);
        try {
            await deleteProject(numId);
            setCurrentData(prev => ({
                ...prev,
                projectRows: prev.projectRows.filter(p => p.id !== numId)
            }));
        } catch (error) {
            console.error('Failed to delete project:', error);
        }
    };

    const handleUpdateProjectLocal = (id: string, field: string, value: string | string[]) => {
        const numId = parseInt(id, 10);
        setCurrentData(prev => ({
            ...prev,
            projectRows: prev.projectRows.map(row =>
                row.id === numId
                    ? { ...row, [field]: value }
                    : row
            )
        }));
    };

    const handleSaveProjects = async () => {
        if (currentData.projectRows.length === 0) return;

        setSavingSection('projects');
        try {
            await Promise.all(
                currentData.projectRows.map(row => {
                    const { id, user_id, resume_lang, ...data } = row;
                    return updateProject(row.id, data);
                })
            );
        } catch (error) {
            console.error('Failed to save projects:', error);
        } finally {
            setSavingSection(null);
        }
    };

    // ==========================================================================
    // Education Handlers
    // ==========================================================================
    const handleAddEducation = async () => {
        try {
            const created = await createEducation(activeLang, {
                university: '',
                degree: '',
                start_date: '',
                end_date: '',
                current: false,
            });
            setCurrentData(prev => ({
                ...prev,
                educationRows: [...prev.educationRows, created]
            }));
        } catch (error) {
            console.error('Failed to create education:', error);
        }
    };

    const handleRemoveEducation = async (id: string) => {
        const numId = parseInt(id, 10);
        try {
            await deleteEducation(numId);
            setCurrentData(prev => ({
                ...prev,
                educationRows: prev.educationRows.filter(e => e.id !== numId)
            }));
        } catch (error) {
            console.error('Failed to delete education:', error);
        }
    };

    const handleUpdateEducationLocal = (id: string, field: string, value: string | boolean) => {
        const numId = parseInt(id, 10);
        setCurrentData(prev => ({
            ...prev,
            educationRows: prev.educationRows.map(row =>
                row.id === numId
                    ? { ...row, [field]: value }
                    : row
            )
        }));
    };

    const handleSaveEducation = async () => {
        if (currentData.educationRows.length === 0) return;

        setSavingSection('education');
        try {
            await Promise.all(
                currentData.educationRows.map(row => {
                    const { id, user_id, resume_lang, ...data } = row;
                    return updateEducation(row.id, data);
                })
            );
        } catch (error) {
            console.error('Failed to save education:', error);
        } finally {
            setSavingSection(null);
        }
    };

    // ==========================================================================
    // Render
    // ==========================================================================

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <p className="text-lg text-muted-foreground">{t.loading}</p>
            </div>
        );
    }

    // Save button component for sections
    const SaveButton = ({ section, onClick }: { section: string; onClick: () => void }) => (
        <Button
            onClick={onClick}
            disabled={savingSection === section}
            size="sm"
            variant="outline"
        >
            {savingSection === section ? t.saving : t.save}
        </Button>
    );

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
            {/* Language Toggle */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <h1 className="text-2xl font-bold">{t.title}</h1>
                <div className="flex items-center gap-2 bg-muted rounded-lg p-1">
                    <button
                        onClick={() => setActiveLang('EN')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${activeLang === 'EN'
                            ? 'bg-white shadow-md text-foreground ring-2 ring-blue-500 font-bold'
                            : 'text-muted-foreground hover:text-foreground hover:bg-gray-100'
                            }`}
                    >
                        <span className="text-lg">🇬🇧</span>
                        <span>EN</span>
                    </button>
                    <button
                        onClick={() => setActiveLang('PL')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${activeLang === 'PL'
                            ? 'bg-white shadow-md text-foreground ring-2 ring-red-500 font-bold'
                            : 'text-muted-foreground hover:text-foreground hover:bg-gray-100'
                            }`}
                    >
                        <span className="text-lg">🇵🇱</span>
                        <span>PL</span>
                    </button>
                </div>
            </div>

            {/* Contact Section */}
            <ContactSection
                data={currentData.contact ?? { first_name: '', last_name: '', email: '', phone_number: '', linkedin: '', github: '', website: '', location: '' }}
                onChange={handleContactChange}
                extraHeaderAction={<SaveButton section="contact" onClick={handleSaveContact} />}
                lang={activeLang}
            />

            {/* Experiences Section */}
            <ExperienceSection
                experiences={currentData.experienceRows.map(row => ({
                    id: String(row.id),
                    company: row.company,
                    position: row.position,
                    start_date: row.start_date,
                    end_date: row.end_date,
                    current: row.current,
                    description: row.description,
                }))}
                onAdd={handleAddExperience}
                onRemove={handleRemoveExperience}
                onUpdate={handleUpdateExperienceLocal}
                extraHeaderAction={<SaveButton section="experiences" onClick={handleSaveExperiences} />}
                lang={activeLang}
            />

            {/* Skills Section */}
            <SkillsSection
                skills={currentData.skillRows.map(row => ({
                    id: String(row.id),
                    skill: row.skill,
                    level: row.level ?? '',
                    category: row.category ?? '',
                }))}
                onAdd={handleAddSkill}
                onRemove={handleRemoveSkill}
                onUpdate={handleUpdateSkill}
                extraHeaderAction={<SaveButton section="skills" onClick={() => {}} />}
                lang={activeLang}
            />

            {/* Education Section */}
            <EducationSection
                educationRows={currentData.educationRows.map(row => ({
                    id: String(row.id),
                    university: row.university,
                    degree: row.degree,
                    start_date: row.start_date,
                    end_date: row.end_date,
                    current: row.current,
                }))}
                onAdd={handleAddEducation}
                onRemove={handleRemoveEducation}
                onUpdate={handleUpdateEducationLocal}
                extraHeaderAction={<SaveButton section="education" onClick={handleSaveEducation} />}
                lang={activeLang}
            />

            {/* Certificates Section */}
            <CertificatesSection
                certificates={currentData.certificateRows.map(row => ({
                    id: String(row.id),
                    certificate_name: row.certificate_name,
                    issuer: row.issuer,
                    issue_date: row.issue_date,
                    expiry_date: row.expiry_date,
                    credential_id: row.credential_id,
                    url: row.url,
                }))}
                onAdd={handleAddCertificate}
                onRemove={handleRemoveCertificate}
                onUpdate={handleUpdateCertificateLocal}
                extraHeaderAction={<SaveButton section="certificates" onClick={handleSaveCertificates} />}
                lang={activeLang}
            />

            {/* Projects Section */}
            <ProjectsSection
                projects={currentData.projectRows.map(row => ({
                    id: String(row.id),
                    project_name: row.project_name,
                    description: row.description,
                    url: row.url,
                }))}
                onAdd={handleAddProject}
                onRemove={handleRemoveProject}
                onUpdate={handleUpdateProjectLocal}
                extraHeaderAction={<SaveButton section="projects" onClick={handleSaveProjects} />}
                lang={activeLang}
            />

            {/* Languages Section */}
            <LanguagesSection
                languages={currentData.languageRows.map(row => ({
                    id: String(row.id),
                    name: row.name,
                    level: row.level,
                }))}
                onAdd={handleAddLanguage}
                onRemove={handleRemoveLanguage}
                onUpdate={handleUpdateLanguage}
                extraHeaderAction={<SaveButton section="languages" onClick={() => {}} />}
                lang={activeLang}
            />

            {/* Interests Section */}
            <InterestsSection
                interests={currentData.interestRows.map(row => ({
                    id: String(row.id),
                    interest: row.interest,
                }))}
                onAdd={handleAddInterest}
                onRemove={handleRemoveInterest}
                onUpdate={handleUpdateInterest}
                extraHeaderAction={<SaveButton section="interests" onClick={() => {}} />}
                lang={activeLang}
            />
        </div>
    );
}
