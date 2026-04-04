import { Card, CardItem, Input, Select, Button } from '@/components/ui';
import type { Skill } from '@/types';
import { SKILL_LEVELS } from '@/lib/constants';

// Labels in English and Polish
const labels = {
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
 * Props for SkillsSection component.
 */
export interface SkillsSectionProps {
    /** Array of skill entries */
    skills: Skill[];
    /** Add a new skill entry */
    onAdd: () => void;
    /** Remove a skill by ID */
    onRemove: (id: string) => void;
    /** Update a field in a skill entry */
    onUpdate: (id: string, field: keyof Skill, value: string) => void;
    /** Extra action to display in header (e.g., Save button) */
    extraHeaderAction?: React.ReactNode;
    /** Language for labels (default: 'EN') */
    lang?: 'EN' | 'PL';
}

/**
 * Convert skill levels to select options.
 */
const skillLevelOptions = SKILL_LEVELS.map((level) => ({
    value: level,
    label: level,
}));

/**
 * Skills section of the resume form.
 */
export function SkillsSection({
    skills,
    onAdd,
    onRemove,
    onUpdate,
    extraHeaderAction,
    lang = 'EN',
}: SkillsSectionProps) {
    const t = labels[lang];

    return (
        <Card
            sectionNumber={3}
            title={t.title}
            badgeColor="purple"
            headerAction={
                <div className="flex flex-wrap items-center gap-2 mt-2 sm:mt-0">
                    {extraHeaderAction}
                    <Button
                        variant="primary"
                        size="sm"
                        onClick={onAdd}
                        leftIcon={<PlusIcon />}
                        className="bg-purple-600 hover:bg-purple-700"
                    >
                        {t.addSkill}
                    </Button>
                </div>
            }
        >
            {skills.length === 0 ? (
                <p className="text-muted-foreground text-center py-6 break-words px-2">
                    {t.emptyMessage}
                </p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {skills.map((skill) => (
                        <CardItem
                            key={skill.id}
                            onRemove={() => onRemove(skill.id)}
                            canRemove={skills.length > 1}
                            className="p-3"
                        >
                            <div className="space-y-2 pr-6">
                                <Input
                                    required
                                    value={skill.skill}
                                    onChange={(e) => onUpdate(skill.id, 'skill', e.target.value)}
                                    placeholder={t.placeholder}
                                    className="text-sm"
                                />
                                <Select
                                    value={skill.level}
                                    onChange={(e) => onUpdate(skill.id, 'level', e.target.value)}
                                    options={skillLevelOptions}
                                    className="text-sm"
                                />
                            </div>
                        </CardItem>
                    ))}
                </div>
            )}
        </Card>
    );
}
