import { useState, useEffect, useCallback, useMemo } from 'react';
import type { Contact, ResumeData, ResumeLang, ExperienceRow } from '@/types';
import { emptyResumeData, emptyContact } from '@/lib/constants';
import { stripRowForPatch } from '@/lib/row-utils';
import { useCrudRows } from '@/hooks/useCrudRows';
import {
    mapExperience,
    mapEducation,
    mapSkill,
    mapCertificate,
    mapProject,
    mapLanguage,
    mapInterest,
} from '@/lib/mappers';
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
    updateSkill,
    deleteSkill,
    getLanguages,
    createLanguage,
    updateLanguage,
    deleteLanguage,
    getInterests,
    createInterest,
    updateInterest,
    deleteInterest,
} from '@/services/resume';

export function useResumePage(onError?: (message: string) => void) {
    const [activeLang, setActiveLang] = useState<ResumeLang>('EN');
    const [isLoading, setIsLoading] = useState(true);
    const [savingSection, setSavingSection] = useState<string | null>(null);
    const [enData, setEnData] = useState<ResumeData>(emptyResumeData);
    const [plData, setPlData] = useState<ResumeData>(emptyResumeData);
    const [originalExperienceDescriptions, setOriginalExperienceDescriptions] = useState<
        Map<number, string>
    >(new Map());

    const currentData = activeLang === 'EN' ? enData : plData;
    const setCurrentData = activeLang === 'EN' ? setEnData : setPlData;

    const setRows = useCallback(
        <K extends keyof ResumeData>(key: K, updater: (rows: ResumeData[K]) => ResumeData[K]) => {
            setCurrentData((prev) => ({
                ...prev,
                [key]: updater(prev[key]),
            }));
        },
        [setCurrentData]
    );

    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            try {
                const [
                    enContact,
                    enExps,
                    enEdus,
                    enCerts,
                    enProjs,
                    enSkills,
                    enLangs,
                    enInts,
                    plContact,
                    plExps,
                    plEdus,
                    plCerts,
                    plProjs,
                    plSkills,
                    plLangs,
                    plInts,
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

                const expDescMap = new Map<number, string>();
                [...enExps, ...plExps].forEach((row) => {
                    expDescMap.set(row.id, row.description);
                });
                setOriginalExperienceDescriptions(expDescMap);
            } catch (error) {
                console.error('Failed to load resume data:', error);
                onError?.('Failed to load resume data. Please refresh the page.');
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, [onError]);

    const handleContactChange = (field: keyof Contact, value: string) => {
        setCurrentData((prev) => ({
            ...prev,
            contact: prev.contact
                ? { ...prev.contact, [field]: value }
                : {
                      id: 0,
                      user_id: 0,
                      resume_lang: activeLang,
                      ...emptyContact,
                      [field]: value,
                  },
        }));
    };

    const handleSaveContact = async () => {
        setSavingSection('contact');
        try {
            if (currentData.contact?.id) {
                await updateContact(activeLang, currentData.contact);
            } else {
                const contactToSave = currentData.contact ?? emptyContact;
                const created = await createContact({
                    resume_lang: activeLang,
                    ...contactToSave,
                });
                setCurrentData((prev) => ({ ...prev, contact: created }));
            }
        } catch (error) {
            console.error('Failed to save contact:', error);
            onError?.('Failed to save contact information.');
        } finally {
            setSavingSection(null);
        }
    };

    const crudConfig = {
        setSavingSection,
        onError,
    };

    const skills = useCrudRows({
        ...crudConfig,
        sectionKey: 'skills',
        getRows: () => currentData.skillRows,
        setRows: (updater) => setRows('skillRows', updater),
        create: () => createSkill(activeLang, { skill: '' }),
        remove: deleteSkill,
        saveRow: (row) => updateSkill(row.id, stripRowForPatch(row)),
    });

    const languages = useCrudRows({
        ...crudConfig,
        sectionKey: 'languages',
        getRows: () => currentData.languageRows,
        setRows: (updater) => setRows('languageRows', updater),
        create: () => createLanguage(activeLang, { name: '', level: 'B1' }),
        remove: deleteLanguage,
        saveRow: (row) => updateLanguage(row.id, stripRowForPatch(row)),
    });

    const interests = useCrudRows({
        ...crudConfig,
        sectionKey: 'interests',
        getRows: () => currentData.interestRows,
        setRows: (updater) => setRows('interestRows', updater),
        create: () => createInterest(activeLang, { interest: '' }),
        remove: deleteInterest,
        saveRow: (row) => updateInterest(row.id, stripRowForPatch(row)),
    });

    const experiences = useCrudRows({
        ...crudConfig,
        sectionKey: 'experiences',
        getRows: () => currentData.experienceRows,
        setRows: (updater) => setRows('experienceRows', updater),
        create: () =>
            createExperience(activeLang, {
                company: '',
                position: '',
                start_date: '',
                end_date: '',
                current: false,
                description: '',
            }),
        remove: deleteExperience,
        saveRow: async (row) => {
            const originalDesc = originalExperienceDescriptions.get(row.id);
            const descriptionChanged = originalDesc !== row.description;
            await updateExperience(row.id, stripRowForPatch(row), { descriptionChanged });
        },
    });

    const handleSaveExperiences = async () => {
        await experiences.saveAll();
        setOriginalExperienceDescriptions((prev) => {
            const next = new Map(prev);
            currentData.experienceRows.forEach((row) => {
                next.set(row.id, row.description);
            });
            return next;
        });
    };

    const certificates = useCrudRows({
        ...crudConfig,
        sectionKey: 'certificates',
        getRows: () => currentData.certificateRows,
        setRows: (updater) => setRows('certificateRows', updater),
        create: () =>
            createCertificate(activeLang, {
                certificate_name: '',
                issuer: '',
                issue_date: '',
                expiry_date: '',
                credential_id: '',
                url: '',
            }),
        remove: deleteCertificate,
        saveRow: (row) => updateCertificate(row.id, stripRowForPatch(row)),
    });

    const projects = useCrudRows({
        ...crudConfig,
        sectionKey: 'projects',
        getRows: () => currentData.projectRows,
        setRows: (updater) => setRows('projectRows', updater),
        create: () =>
            createProject(activeLang, {
                project_name: '',
                description: '',
                url: '',
            }),
        remove: deleteProject,
        saveRow: (row) => updateProject(row.id, stripRowForPatch(row)),
    });

    const education = useCrudRows({
        ...crudConfig,
        sectionKey: 'education',
        getRows: () => currentData.educationRows,
        setRows: (updater) => setRows('educationRows', updater),
        create: () =>
            createEducation(activeLang, {
                university: '',
                degree: '',
                start_date: '',
                end_date: '',
                current: false,
            }),
        remove: deleteEducation,
        saveRow: (row) => updateEducation(row.id, stripRowForPatch(row)),
    });

    const handleUpdateExperienceLocal = (id: string, field: string, value: string | boolean) => {
        experiences.updateLocal(
            id,
            field as keyof ExperienceRow,
            value as ExperienceRow[keyof ExperienceRow]
        );
    };

    const handleUpdateEducationLocal = (id: string, field: string, value: string | boolean) => {
        education.updateLocal(
            id,
            field as keyof typeof currentData.educationRows[0],
            value as (typeof currentData.educationRows)[0][keyof (typeof currentData.educationRows)[0]]
        );
    };

    const handleUpdateCertificateLocal = (id: string, field: string, value: string) => {
        certificates.updateLocal(
            id,
            field as keyof typeof currentData.certificateRows[0],
            value
        );
    };

    const handleUpdateProjectLocal = (id: string, field: string, value: string) => {
        projects.updateLocal(id, field as keyof typeof currentData.projectRows[0], value);
    };

    const formData = useMemo(
        () => ({
            contact: currentData.contact ?? emptyContact,
            experiences: currentData.experienceRows.map(mapExperience),
            education: currentData.educationRows.map(mapEducation),
            certificates: currentData.certificateRows.map(mapCertificate),
            projects: currentData.projectRows.map(mapProject),
            skills: currentData.skillRows.map(mapSkill),
            languages: currentData.languageRows.map(mapLanguage),
            interests: currentData.interestRows.map(mapInterest),
        }),
        [currentData]
    );

    return {
        activeLang,
        setActiveLang,
        isLoading,
        savingSection,
        formData,
        handleContactChange,
        handleSaveContact,
        skills,
        languages,
        interests,
        experiences,
        handleSaveExperiences,
        certificates,
        projects,
        education,
        handleUpdateExperienceLocal,
        handleUpdateEducationLocal,
        handleUpdateCertificateLocal,
        handleUpdateProjectLocal,
    };
}
