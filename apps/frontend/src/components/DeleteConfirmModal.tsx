import { Button } from '@/components/ui';
import type { ResumeLang } from '@/types';
import { pickLang, deleteModal as deleteLabels, common as commonLabels } from '@/lib/translations';

export function DeleteConfirmModal({
    isOpen,
    itemName,
    onConfirm,
    onCancel,
    lang,
}: {
    isOpen: boolean;
    itemName: string;
    onConfirm: () => void;
    onCancel: () => void;
    lang: ResumeLang;
}) {
    if (!isOpen) return null;

    const t = pickLang(deleteLabels, lang);
    const tc = pickLang(commonLabels, lang);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onCancel}
                aria-hidden="true"
            />

            <div className="relative bg-card rounded-xl shadow-2xl p-6 sm:p-8 max-w-md w-full mx-4 border border-border">
                <h2 className="text-xl font-bold text-foreground mb-2">{t.title}</h2>
                <p className="text-muted-foreground mb-1">
                    {t.message} <span className="font-semibold text-foreground">{itemName}</span>?
                </p>
                <p className="text-sm text-destructive mb-6">{t.warning}</p>

                <div className="flex flex-wrap gap-3 justify-end">
                    <Button variant="ghost" onClick={onCancel}>
                        {tc.cancel}
                    </Button>
                    <Button variant="destructive" onClick={onConfirm}>
                        {tc.delete}
                    </Button>
                </div>
            </div>
        </div>
    );
}
