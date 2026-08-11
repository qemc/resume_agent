import { Card, CardItem, Input, Button } from '@/components/ui';
import { PlusIcon } from '@/components/icons/PlusIcon';
import type { Interest, ResumeLang } from '@/types';
import { pickLang, interests as interestsLabels } from '@/lib/translations';

export interface InterestsSectionProps {
    interests: Interest[];
    onAdd: () => void;
    onRemove: (id: string) => void;
    onUpdate: (id: string, field: keyof Interest, value: string) => void;
    extraHeaderAction?: React.ReactNode;
    /** Language for labels (default: 'EN') */
    lang?: ResumeLang;
}

export function InterestsSection({
    interests,
    onAdd,
    onRemove,
    onUpdate,
    extraHeaderAction,
    lang = 'EN',
}: InterestsSectionProps) {
    const t = pickLang(interestsLabels, lang);

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
