import { Button } from '@/components/ui';
import type { ResumeLang } from '@/types';
import { pickLang, topics as topicLabels, common as commonLabels } from '@/lib/translations';

interface TopicDeleteDialogProps {
    lang: ResumeLang;
    onCancel: () => void;
    onConfirm: () => void;
}

export function TopicDeleteDialog({ lang, onCancel, onConfirm }: TopicDeleteDialogProps) {
    const t = pickLang(topicLabels, lang);
    const tc = pickLang(commonLabels, lang);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={onCancel}
                aria-hidden="true"
            />
            <div className="relative bg-white rounded-xl shadow-2xl p-6 max-w-sm w-full mx-4">
                <h3 className="font-semibold mb-2">{t.confirmDeleteTitle}</h3>
                <p className="text-sm text-muted-foreground mb-4">{t.confirmDeleteMessage}</p>
                <div className="flex gap-2 justify-end">
                    <Button size="sm" variant="outline" onClick={onCancel}>
                        {tc.cancel}
                    </Button>
                    <Button
                        size="sm"
                        variant="ghost"
                        className="bg-red-500 text-white hover:bg-red-600"
                        onClick={onConfirm}
                    >
                        {tc.delete}
                    </Button>
                </div>
            </div>
        </div>
    );
}
