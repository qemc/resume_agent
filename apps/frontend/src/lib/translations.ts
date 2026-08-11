import type { ResumeLang } from '@/types';

export type LangLabels<T extends Record<ResumeLang, Record<string, string>>> = T[ResumeLang];

export function pickLang<T extends Record<ResumeLang, Record<string, string>>>(
    dict: T,
    lang: ResumeLang
): T[ResumeLang] {
    return dict[lang];
}

export const common = {
    EN: {
        save: 'Save',
        saving: 'Saving...',
        cancel: 'Cancel',
        edit: 'Edit',
        delete: 'Delete',
        open: 'Open',
        loading: 'Loading...',
    },
    PL: {
        save: 'Zapisz',
        saving: 'Zapisywanie...',
        cancel: 'Anuluj',
        edit: 'Edytuj',
        delete: 'Usuń',
        open: 'Otwórz',
        loading: 'Wczytywanie...',
    },
} as const;

export const resumePage = {
    EN: {
        title: 'My Resume Data',
        loading: 'Loading your resume data...',
    },
    PL: {
        title: 'Moje Dane CV',
        loading: 'Wczytywanie danych CV...',
    },
} as const;

export const careerPathsPage = {
    EN: {
        title: 'Career Paths',
        loading: 'Loading career paths...',
        noCareerPaths: 'No career paths yet. Click the + button to create your first one.',
        namePlaceholder: 'e.g., Data Engineering - Cloud Focus',
        descriptionPlaceholder:
            'Describe your desired position in your own words. Include the type of role, key responsibilities, technologies you want to work with, industry preferences, and any other details that define your ideal career direction.',
        addNew: 'Add Career Path',
        titleLabel: 'Title',
        descriptionLabel: 'Description',
    },
    PL: {
        title: 'Ścieżki Kariery',
        loading: 'Wczytywanie ścieżek kariery...',
        noCareerPaths: 'Brak ścieżek kariery. Kliknij + aby utworzyć pierwszą.',
        namePlaceholder: 'np. Inżynieria Danych - Fokus na Chmurę',
        descriptionPlaceholder:
            'Opisz swoją wymarzoną pozycję własnymi słowami. Uwzględnij rodzaj roli, kluczowe obowiązki, technologie z którymi chcesz pracować, preferencje branżowe i inne szczegóły definiujące Twój idealny kierunek kariery.',
        addNew: 'Dodaj Ścieżkę Kariery',
        titleLabel: 'Tytuł',
        descriptionLabel: 'Opis',
    },
} as const;

export const careerPathDetail = {
    EN: {
        backLink: '← Back to Career Paths',
        titleLabel: 'Title',
        descriptionLabel: 'Description',
        namePlaceholder: 'e.g., Data Engineering - Cloud Focus',
        descriptionPlaceholder: 'Describe your desired position in your own words...',
        loading: 'Loading career path...',
        notFound: 'Career path not found.',
        backToList: 'Go back to Career Paths',
        experiencesTitle: 'Experience Topics',
        experiencesLoading: 'Loading experiences...',
        noExperiences: 'No experiences found. Add experiences in My Resume Data first.',
    },
    PL: {
        backLink: '← Powrót do Ścieżek Kariery',
        titleLabel: 'Tytuł',
        descriptionLabel: 'Opis',
        namePlaceholder: 'np. Inżynieria Danych - Fokus na Chmurę',
        descriptionPlaceholder: 'Opisz swoją wymarzoną pozycję własnymi słowami...',
        loading: 'Wczytywanie ścieżki kariery...',
        notFound: 'Nie znaleziono ścieżki kariery.',
        backToList: 'Wróć do Ścieżek Kariery',
        experiencesTitle: 'Tematy Doświadczeń',
        experiencesLoading: 'Ładowanie doświadczeń...',
        noExperiences: 'Brak doświadczeń. Dodaj doświadczenia najpierw w Moich Danych CV.',
    },
} as const;

export const deleteModal = {
    EN: {
        title: 'Delete Career Path',
        message: 'Are you sure you want to delete',
        warning: 'This action cannot be undone.',
    },
    PL: {
        title: 'Usuń Ścieżkę Kariery',
        message: 'Czy na pewno chcesz usunąć',
        warning: 'Tej operacji nie można cofnąć.',
    },
} as const;

export const auth = {
    EN: {
        loginTitle: 'Welcome Back',
        loginSubtitle: 'Sign in to your account',
        registerTitle: 'Create Account',
        registerSubtitle: 'Start building your resume',
        email: 'Email',
        password: 'Password',
        confirmPassword: 'Confirm Password',
        signIn: 'Sign In',
        createAccount: 'Create Account',
        loginFailed: 'Login failed. Please try again.',
        registerFailed: 'Registration failed. Please try again.',
        passwordsNoMatch: 'Passwords do not match',
        passwordRequirements: 'Password does not meet requirements',
        noAccount: "Don't have an account?",
        createOne: 'Create one',
        hasAccount: 'Already have an account?',
        signInLink: 'Sign in',
        passwordReqLength: 'At least 8 characters',
        passwordReqUpper: 'At least 1 uppercase letter',
        passwordReqNumber: 'At least 1 number',
        passwordReqSpecial: 'At least 1 special character',
    },
    PL: {
        loginTitle: 'Witaj ponownie',
        loginSubtitle: 'Zaloguj się do konta',
        registerTitle: 'Utwórz konto',
        registerSubtitle: 'Zacznij budować swoje CV',
        email: 'E-mail',
        password: 'Hasło',
        confirmPassword: 'Potwierdź hasło',
        signIn: 'Zaloguj się',
        createAccount: 'Utwórz konto',
        loginFailed: 'Logowanie nie powiodło się. Spróbuj ponownie.',
        registerFailed: 'Rejestracja nie powiodła się. Spróbuj ponownie.',
        passwordsNoMatch: 'Hasła nie są zgodne',
        passwordRequirements: 'Hasło nie spełnia wymagań',
        noAccount: 'Nie masz konta?',
        createOne: 'Utwórz je',
        hasAccount: 'Masz już konto?',
        signInLink: 'Zaloguj się',
        passwordReqLength: 'Co najmniej 8 znaków',
        passwordReqUpper: 'Co najmniej 1 wielka litera',
        passwordReqNumber: 'Co najmniej 1 cyfra',
        passwordReqSpecial: 'Co najmniej 1 znak specjalny',
    },
} as const;

export const contact = {
    EN: {
        title: 'Contact Information',
        firstName: 'First Name',
        lastName: 'Last Name',
        phone: 'Phone Number',
        email: 'Email',
        linkedin: 'LinkedIn Profile',
        github: 'GitHub Profile',
    },
    PL: {
        title: 'Dane kontaktowe',
        firstName: 'Imię',
        lastName: 'Nazwisko',
        phone: 'Numer telefonu',
        email: 'E-mail',
        linkedin: 'Profil LinkedIn',
        github: 'Profil GitHub',
    },
} as const;

export const experience = {
    EN: {
        title: 'Work Experience',
        addExperience: 'Add Experience',
        company: 'Company',
        position: 'Position',
        startDate: 'Start Date',
        endDate: 'End Date',
        currentlyWorking: 'Currently working here',
        description: 'Description',
        companyPlaceholder: 'Acme Inc.',
        positionPlaceholder: 'Software Engineer',
        descriptionPlaceholder:
            'Describe your responsibilities, achievements, and the impact you made. Be as detailed as possible - AI will help format this into bullet points later...',
        emptyMessage: 'No experiences added yet. Click the button above to add one.',
    },
    PL: {
        title: 'Doświadczenie zawodowe',
        addExperience: 'Dodaj doświadczenie',
        company: 'Firma',
        position: 'Stanowisko',
        startDate: 'Data rozpoczęcia',
        endDate: 'Data zakończenia',
        currentlyWorking: 'Obecnie pracuję tutaj',
        description: 'Opis',
        companyPlaceholder: 'Nazwa firmy',
        positionPlaceholder: 'Inżynier oprogramowania',
        descriptionPlaceholder:
            'Opisz swoje obowiązki, osiągnięcia i wpływ, jaki miałeś. Bądź jak najbardziej szczegółowy - AI pomoże później sformatować to w punkty...',
        emptyMessage: 'Nie dodano jeszcze doświadczenia. Kliknij powyższy przycisk, aby dodać.',
    },
} as const;

export const skills = {
    EN: {
        title: 'Skills',
        addSkill: 'Add Skill',
        placeholder: 'e.g., React, Python, AWS',
        emptyMessage: 'No skills added yet. Click the button above to add one.',
    },
    PL: {
        title: 'Umiejętności',
        addSkill: 'Dodaj umiejętność',
        placeholder: 'np. React, Python, AWS',
        emptyMessage: 'Nie dodano jeszcze umiejętności. Kliknij powyższy przycisk, aby dodać.',
    },
} as const;

export const education = {
    EN: {
        title: 'Education',
        addEducation: 'Add Education',
        university: 'University / Institution',
        degree: 'Degree / Field of Study',
        startDate: 'Start Date',
        endDate: 'End Date',
        currentlyStudying: 'Currently studying here',
        universityPlaceholder: 'XYZ University',
        degreePlaceholder: 'Bachelor of Science in Computer Science',
        emptyMessage: 'No education history added yet. Click the button above to add one.',
    },
    PL: {
        title: 'Edukacja',
        addEducation: 'Dodaj edukację',
        university: 'Uczelnia / Instytucja',
        degree: 'Kierunek / Stopień',
        startDate: 'Data rozpoczęcia',
        endDate: 'Data zakończenia',
        currentlyStudying: 'Obecnie tutaj studiuję',
        universityPlaceholder: 'Nazwa uczelni',
        degreePlaceholder: 'Inżynier informatyki',
        emptyMessage: 'Nie dodano jeszcze edukacji. Kliknij powyższy przycisk, aby dodać.',
    },
} as const;

export const certificates = {
    EN: {
        title: 'Certificates',
        addCertificate: 'Add Certificate',
        name: 'Certificate Name',
        issuer: 'Issuing Organization',
        date: 'Date Obtained',
        url: 'Certificate URL',
        namePlaceholder: 'AWS Solutions Architect',
        issuerPlaceholder: 'Amazon Web Services',
        emptyMessage: 'No certificates added yet. Click the button above to add one.',
    },
    PL: {
        title: 'Certyfikaty',
        addCertificate: 'Dodaj certyfikat',
        name: 'Nazwa certyfikatu',
        issuer: 'Organizacja wydająca',
        date: 'Data uzyskania',
        url: 'Link do certyfikatu',
        namePlaceholder: 'AWS Solutions Architect',
        issuerPlaceholder: 'Amazon Web Services',
        emptyMessage: 'Nie dodano jeszcze certyfikatów. Kliknij powyższy przycisk, aby dodać.',
    },
} as const;

export const projects = {
    EN: {
        title: 'Projects',
        addProject: 'Add Project',
        name: 'Project Name',
        description: 'Description',
        url: 'Project URL',
        namePlaceholder: 'My Awesome Project',
        descriptionPlaceholder: 'Describe your project and its impact...',
        emptyMessage: 'No projects added yet. Click the button above to add one.',
    },
    PL: {
        title: 'Projekty',
        addProject: 'Dodaj projekt',
        name: 'Nazwa projektu',
        description: 'Opis',
        url: 'Link do projektu',
        namePlaceholder: 'Mój świetny projekt',
        descriptionPlaceholder: 'Opisz swój projekt i jego wpływ...',
        emptyMessage: 'Nie dodano jeszcze projektów. Kliknij powyższy przycisk, aby dodać.',
    },
} as const;

export const languages = {
    EN: {
        title: 'Languages',
        addLanguage: 'Add Language',
        language: 'Language',
        level: 'Level',
        placeholder: 'English, Spanish, etc.',
        emptyMessage: 'No languages added yet. Click the button above to add one.',
    },
    PL: {
        title: 'Języki',
        addLanguage: 'Dodaj język',
        language: 'Język',
        level: 'Poziom',
        placeholder: 'Angielski, Hiszpański itp.',
        emptyMessage: 'Nie dodano jeszcze języków. Kliknij powyższy przycisk, aby dodać.',
    },
} as const;

export const interests = {
    EN: {
        title: 'Interests',
        addInterest: 'Add Interest',
        interest: 'Interest',
        placeholder: 'Hiking, Photography, AI, etc.',
        emptyMessage: 'No interests added yet. Click the button above to add one.',
    },
    PL: {
        title: 'Zainteresowania',
        addInterest: 'Dodaj zainteresowanie',
        interest: 'Zainteresowanie',
        placeholder: 'Turystyka, Fotografia, AI itp.',
        emptyMessage: 'Nie dodano jeszcze zainteresowań. Kliknij powyższy przycisk, aby dodać.',
    },
} as const;

export const topics = {
    EN: {
        generateAll: '⚡ Generate All',
        generating: 'Generating...',
        regenerating: 'Regenerating...',
        addManually: 'Add bullet point',
        regenerate: '⚡',
        emptyState: 'No bullet points yet.',
        emptyHint: 'Generate with AI or add manually.',
        newTopicPlaceholder: 'Type your bullet point...',
        topicPlaceholder: 'Edit bullet point text...',
        confirmDeleteTitle: 'Delete bullet point?',
        confirmDeleteMessage: 'This will permanently remove this bullet point.',
        regenerateTitle: 'Regenerate bullet point',
        regenerateHintPlaceholder:
            'Optional: guide the AI (e.g. "focus on leadership", "make it shorter")...',
        regenerateSubmit: '⚡ Regenerate',
    },
    PL: {
        generateAll: '⚡ Generuj wszystkie',
        generating: 'Generowanie...',
        regenerating: 'Regenerowanie...',
        addManually: 'Dodaj punkt',
        regenerate: '⚡',
        emptyState: 'Brak punktów.',
        emptyHint: 'Wygeneruj z AI lub dodaj ręcznie.',
        newTopicPlaceholder: 'Wpisz swój punkt...',
        topicPlaceholder: 'Edytuj tekst punktu...',
        confirmDeleteTitle: 'Usunąć punkt?',
        confirmDeleteMessage: 'To trwale usunie ten punkt.',
        regenerateTitle: 'Regeneruj punkt',
        regenerateHintPlaceholder:
            'Opcjonalnie: wskazówka dla AI (np. "skup się na przywództwie", "skróć")...',
        regenerateSubmit: '⚡ Regeneruj',
    },
} as const;
