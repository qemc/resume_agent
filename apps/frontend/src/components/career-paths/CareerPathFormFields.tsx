import { Input, Textarea } from '@/components/ui';
import type { ResumeLang } from '@/types';
import { pickLang, careerPathsPage as labels } from '@/lib/translations';

interface CareerPathFormFieldsProps {
    lang: ResumeLang;
    name: string;
    description: string;
    onNameChange: (value: string) => void;
    onDescriptionChange: (value: string) => void;
}

export function CareerPathFormFields({
    lang,
    name,
    description,
    onNameChange,
    onDescriptionChange,
}: CareerPathFormFieldsProps) {
    const t = pickLang(labels, lang);

    return (
        <>
            <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">{t.titleLabel}</label>
                <Input
                    value={name}
                    onChange={(e) => onNameChange(e.target.value)}
                    placeholder={t.namePlaceholder}
                    className="text-lg font-semibold"
                />
            </div>
            <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                    {t.descriptionLabel}
                </label>
                <Textarea
                    value={description}
                    onChange={(e) => onDescriptionChange(e.target.value)}
                    placeholder={t.descriptionPlaceholder}
                    rows={6}
                />
            </div>
        </>
    );
}
