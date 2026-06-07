import { Card, CardItem, Input, Button } from '@/components/ui';
import { PlusIcon } from '@/components/icons/PlusIcon';
import type { Language, LanguageLevel, ResumeLang } from '@/types';
import { pickLang, languages as languagesLabels } from '@/lib/translations';

export interface LanguagesSectionProps {
    languages: Language[];
    onAdd: () => void;
    onRemove: (id: string) => void;
    onUpdate: (id: string, field: keyof Language, value: string) => void;
    extraHeaderAction?: React.ReactNode;
    /** Language for labels (default: 'EN') */
    lang?: ResumeLang;
}

const LANGUAGE_LEVELS: LanguageLevel[] = [
    'A1',
    'A2',
    'B1',
    'B2',
    'C1',
    'Native'
];

export function LanguagesSection({
    languages,
    onAdd,
    onRemove,
    onUpdate,
    extraHeaderAction,
    lang = 'EN',
}: LanguagesSectionProps) {
    const t = pickLang(languagesLabels, lang);

    return (
        <Card
            sectionNumber={7}
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
                        {t.addLanguage}
                    </Button>
                </div>
            }
        >
            {languages.length === 0 ? (
                <p className="text-muted-foreground text-center py-6 break-words px-2">
                    {t.emptyMessage}
                </p>
            ) : (
                <div className="space-y-4">
                    {languages.map((item) => (
                        <CardItem
                            key={item.id}
                            onRemove={() => onRemove(item.id)}
                            canRemove
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input
                                    label={t.language}
                                    required
                                    value={item.name}
                                    onChange={(e) => onUpdate(item.id, 'name', e.target.value)}
                                    placeholder={t.placeholder}
                                />
                                <div>
                                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                        {t.level} <span className="text-destructive">*</span>
                                    </label>
                                    <select
                                        className="w-full px-3 py-2 mt-1 border border-input rounded-md bg-background focus:ring-2 focus:ring-ring focus:border-input outline-none transition-all"
                                        value={item.level}
                                        onChange={(e) => onUpdate(item.id, 'level', e.target.value as LanguageLevel)}
                                    >
                                        {LANGUAGE_LEVELS.map((level) => (
                                            <option key={level} value={level}>
                                                {level}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </CardItem>
                    ))}
                </div>
            )}
        </Card>
    );
}
