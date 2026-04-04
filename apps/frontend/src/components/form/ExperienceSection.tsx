import { Card, CardItem, Input, Textarea, Button, Checkbox } from '@/components/ui';
import type { Experience } from '@/types';
import { FORM_VALIDATION } from '@/lib/constants';

// Labels in English and Polish
const labels = {
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
        descriptionPlaceholder: 'Describe your responsibilities, achievements, and the impact you made. Be as detailed as possible - AI will help format this into bullet points later...',
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
        descriptionPlaceholder: 'Opisz swoje obowiązki, osiągnięcia i wpływ, jaki miałeś. Bądź jak najbardziej szczegółowy - AI pomoże później sformatować to w punkty...',
        emptyMessage: 'Nie dodano jeszcze doświadczenia. Kliknij powyższy przycisk, aby dodać.',
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
 * Props for ExperienceSection component.
 */
export interface ExperienceSectionProps {
    /** Array of experience entries */
    experiences: Experience[];
    /** Add a new experience entry */
    onAdd: () => void;
    /** Remove an experience by ID */
    onRemove: (id: string) => void;
    /** Update a field in an experience entry */
    onUpdate: (id: string, field: keyof Experience, value: string | boolean) => void;
    /** Extra action to display in header (e.g., Save button) */
    extraHeaderAction?: React.ReactNode;
    /** Language for labels (default: 'EN') */
    lang?: 'EN' | 'PL';
}

/**
 * Work Experience section of the resume form.
 */
export function ExperienceSection({
    experiences,
    onAdd,
    onRemove,
    onUpdate,
    extraHeaderAction,
    lang = 'EN',
}: ExperienceSectionProps) {
    const t = labels[lang];

    return (
        <Card
            sectionNumber={2}
            title={t.title}
            badgeColor="green"
            headerAction={
                <div className="flex flex-wrap items-center gap-2 mt-2 sm:mt-0">
                    {extraHeaderAction}
                    <Button
                        variant="primary"
                        size="sm"
                        onClick={onAdd}
                        leftIcon={<PlusIcon />}
                        className="bg-green-600 hover:bg-green-700"
                    >
                        {t.addExperience}
                    </Button>
                </div>
            }
        >
            {experiences.length === 0 ? (
                <p className="text-muted-foreground text-center py-6 break-words px-2">
                    {t.emptyMessage}
                </p>
            ) : (
                <div className="space-y-4">
                    {experiences.map((exp) => (
                        <CardItem
                            key={exp.id}
                            onRemove={() => onRemove(exp.id)}
                            canRemove={experiences.length > 1}
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                <Input
                                    label={t.company}
                                    required
                                    value={exp.company}
                                    onChange={(e) => onUpdate(exp.id, 'company', e.target.value)}
                                    placeholder={t.companyPlaceholder}
                                />
                                <Input
                                    label={t.position}
                                    required
                                    value={exp.position}
                                    onChange={(e) => onUpdate(exp.id, 'position', e.target.value)}
                                    placeholder={t.positionPlaceholder}
                                />
                                <Input
                                    label={t.startDate}
                                    type="month"
                                    required
                                    value={exp.start_date}
                                    onChange={(e) => onUpdate(exp.id, 'start_date', e.target.value)}
                                />
                                <div className="space-y-2">
                                    <Input
                                        label={t.endDate}
                                        type="month"
                                        value={exp.end_date}
                                        disabled={exp.current}
                                        onChange={(e) => onUpdate(exp.id, 'end_date', e.target.value)}
                                    />
                                    <Checkbox
                                        label={t.currentlyWorking}
                                        checked={exp.current}
                                        onChange={(e) => onUpdate(exp.id, 'current', e.target.checked)}
                                    />
                                </div>
                            </div>

                            {/* Description field - single text area for AI processing */}
                            <Textarea
                                label={t.description}
                                required
                                value={exp.description}
                                onChange={(e) => onUpdate(exp.id, 'description', e.target.value)}
                                placeholder={t.descriptionPlaceholder}
                                rows={5}
                                showCount
                                maxLength={FORM_VALIDATION.maxDescriptionLength}
                            />
                        </CardItem>
                    ))}
                </div>
            )}
        </Card>
    );
}
