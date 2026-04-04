import { Card, CardItem, Input, Button, Checkbox } from '@/components/ui';
import type { Education } from '@/types';

// Labels in English and Polish
const labels = {
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
 * Props for EducationSection component.
 */
export interface EducationSectionProps {
    /** Array of education entries */
    educationRows: Education[];
    /** Add a new education entry */
    onAdd: () => void;
    /** Remove an education entry by ID */
    onRemove: (id: string) => void;
    /** Update a field in an education entry */
    onUpdate: (id: string, field: keyof Education, value: string | boolean) => void;
    /** Extra action to display in header (e.g., Save button) */
    extraHeaderAction?: React.ReactNode;
    /** Language for labels (default: 'EN') */
    lang?: 'EN' | 'PL';
}

/**
 * Education section of the resume form.
 */
export function EducationSection({
    educationRows,
    onAdd,
    onRemove,
    onUpdate,
    extraHeaderAction,
    lang = 'EN',
}: EducationSectionProps) {
    const t = labels[lang];

    return (
        <Card
            sectionNumber={4}
            title={t.title}
            badgeColor="blue"
            headerAction={
                <div className="flex flex-wrap items-center gap-2 mt-2 sm:mt-0">
                    {extraHeaderAction}
                    <Button
                        variant="primary"
                        size="sm"
                        onClick={onAdd}
                        leftIcon={<PlusIcon />}
                        className="bg-blue-600 hover:bg-blue-700"
                    >
                        {t.addEducation}
                    </Button>
                </div>
            }
        >
            {educationRows.length === 0 ? (
                <p className="text-muted-foreground text-center py-6 break-words px-2">
                    {t.emptyMessage}
                </p>
            ) : (
                <div className="space-y-4">
                    {educationRows.map((edu) => (
                        <CardItem
                            key={edu.id}
                            onRemove={() => onRemove(edu.id)}
                            canRemove={educationRows.length > 1}
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input
                                    label={t.university}
                                    required
                                    value={edu.university}
                                    onChange={(e) => onUpdate(edu.id, 'university', e.target.value)}
                                    placeholder={t.universityPlaceholder}
                                />
                                <Input
                                    label={t.degree}
                                    required
                                    value={edu.degree}
                                    onChange={(e) => onUpdate(edu.id, 'degree', e.target.value)}
                                    placeholder={t.degreePlaceholder}
                                />
                                <Input
                                    label={t.startDate}
                                    type="month"
                                    required
                                    value={edu.start_date}
                                    onChange={(e) => onUpdate(edu.id, 'start_date', e.target.value)}
                                />
                                <div className="space-y-2">
                                    <Input
                                        label={t.endDate}
                                        type="month"
                                        value={edu.end_date}
                                        disabled={edu.current}
                                        onChange={(e) => onUpdate(edu.id, 'end_date', e.target.value)}
                                    />
                                    <Checkbox
                                        label={t.currentlyStudying}
                                        checked={edu.current}
                                        onChange={(e) => onUpdate(edu.id, 'current', e.target.checked)}
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
