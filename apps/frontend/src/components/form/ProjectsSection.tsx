import { Card, CardItem, Input, Textarea, Button } from '@/components/ui';
import type { Project } from '@/types';
import { FORM_VALIDATION } from '@/lib/constants';

// Labels in English and Polish
const labels = {
    EN: {
        title: 'Projects',
        addProject: 'Add Project',
        name: 'Project Name',
        technologies: 'Technologies Used',
        description: 'Description',
        url: 'Project URL',
        namePlaceholder: 'My Awesome Project',
        technologiesPlaceholder: 'React, Node.js, PostgreSQL',
        descriptionPlaceholder: 'Describe your project and its impact...',
        emptyMessage: 'No projects added yet. Click the button above to add one.',
    },
    PL: {
        title: 'Projekty',
        addProject: 'Dodaj projekt',
        name: 'Nazwa projektu',
        technologies: 'Użyte technologie',
        description: 'Opis',
        url: 'Link do projektu',
        namePlaceholder: 'Mój świetny projekt',
        technologiesPlaceholder: 'React, Node.js, PostgreSQL',
        descriptionPlaceholder: 'Opisz swój projekt i jego wpływ...',
        emptyMessage: 'Nie dodano jeszcze projektów. Kliknij powyższy przycisk, aby dodać.',
    },
};

/**
 * Plus icon component.
 */
const PlusIcon = () => (
    <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v16m8-8H4"
        />
    </svg>
);

/**
 * Props for ProjectsSection component.
 */
export interface ProjectsSectionProps {
    /** Array of project entries */
    projects: Project[];
    /** Add a new project entry */
    onAdd: () => void;
    /** Remove a project by ID */
    onRemove: (id: string) => void;
    /** Update a field in a project entry */
    onUpdate: (id: string, field: keyof Project, value: string) => void;
    /** Extra action to display in header (e.g., Save button) */
    extraHeaderAction?: React.ReactNode;
    /** Language for labels (default: 'EN') */
    lang?: 'EN' | 'PL';
}

/**
 * Projects section of the resume form.
 */
export function ProjectsSection({
    projects,
    onAdd,
    onRemove,
    onUpdate,
    extraHeaderAction,
    lang = 'EN',
}: ProjectsSectionProps) {
    const t = labels[lang];

    return (
        <Card
            sectionNumber={6}
            title={t.title}
            badgeColor="teal"
            isOptional
            headerAction={
                <div className="flex flex-wrap items-center gap-2 mt-2 sm:mt-0">
                    {extraHeaderAction}
                    <Button
                        variant="primary"
                        size="sm"
                        onClick={onAdd}
                        leftIcon={<PlusIcon />}
                        className="bg-teal-600 hover:bg-teal-700"
                    >
                        {t.addProject}
                    </Button>
                </div>
            }
        >
            {projects.length === 0 ? (
                <p className="text-muted-foreground text-center py-6 break-words px-2">
                    {t.emptyMessage}
                </p>
            ) : (
                <div className="space-y-4">
                    {projects.map((proj) => (
                        <CardItem
                            key={proj.id}
                            onRemove={() => onRemove(proj.id)}
                            canRemove
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="md:col-span-2">
                                    <Input
                                        label={t.name}
                                        required
                                        value={proj.project_name}
                                        onChange={(e) => onUpdate(proj.id, 'project_name', e.target.value)}
                                        placeholder={t.namePlaceholder}
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <Textarea
                                        label={t.description}
                                        required
                                        value={proj.description}
                                        onChange={(e) => onUpdate(proj.id, 'description', e.target.value)}
                                        placeholder={t.descriptionPlaceholder}
                                        rows={3}
                                        showCount
                                        maxLength={FORM_VALIDATION.maxProjectDescriptionLength}
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <Input
                                        label={t.url}
                                        type="url"
                                        value={proj.url || ''}
                                        onChange={(e) => onUpdate(proj.id, 'url', e.target.value)}
                                        placeholder="https://github.com/username/project"
                                    />
                                </div>
                            </div>
                        </CardItem>
                    ))}
                </div>
            )}
        </Card>
    );
}
