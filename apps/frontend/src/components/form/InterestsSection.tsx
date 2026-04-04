import { Card, CardItem, Input, Button } from '@/components/ui';
import type { Interest } from '@/types';

// Labels in English and Polish
const labels = {
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

export interface InterestsSectionProps {
    interests: Interest[];
    onAdd: () => void;
    onRemove: (id: string) => void;
    onUpdate: (id: string, field: keyof Interest, value: string) => void;
    extraHeaderAction?: React.ReactNode;
    /** Language for labels (default: 'EN') */
    lang?: 'EN' | 'PL';
}

export function InterestsSection({
    interests,
    onAdd,
    onRemove,
    onUpdate,
    extraHeaderAction,
    lang = 'EN',
}: InterestsSectionProps) {
    const t = labels[lang];

    return (
        <Card
            sectionNumber={8}
            title={t.title}
            badgeColor="orange"
            headerAction={
                <div className="flex flex-wrap items-center gap-2 mt-2 sm:mt-0">
                    {extraHeaderAction}
                    <Button
                        variant="primary"
                        size="sm"
                        onClick={onAdd}
                        leftIcon={<PlusIcon />}
                        className="bg-orange-600 hover:bg-orange-700"
                    >
                        {t.addInterest}
                    </Button>
                </div>
            }
        >
            {interests.length === 0 ? (
                <p className="text-muted-foreground text-center py-6 break-words px-2">
                    {t.emptyMessage}
                </p>
            ) : (
                <div className="space-y-4">
                    {interests.map((item) => (
                        <CardItem
                            key={item.id}
                            onRemove={() => onRemove(item.id)}
                            canRemove
                        >
                            <Input
                                label={t.interest}
                                required
                                value={item.interest}
                                onChange={(e) => onUpdate(item.id, 'interest', e.target.value)}
                                placeholder={t.placeholder}
                            />
                        </CardItem>
                    ))}
                </div>
            )}
        </Card>
    );
}
