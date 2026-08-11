import { Button } from '@/components/ui';
import { pickLang, common } from '@/lib/translations';
import type { ResumeLang } from '@/types';

interface SaveButtonProps {
    section: string;
    activeSection: string | null;
    onClick: () => void;
    lang: ResumeLang;
}

export function SaveButton({ section, activeSection, onClick, lang }: SaveButtonProps) {
    const t = pickLang(common, lang);
    const isSaving = activeSection === section;

    return (
        <Button onClick={onClick} disabled={isSaving} size="sm" variant="outline">
            {isSaving ? t.saving : t.save}
        </Button>
    );
}
