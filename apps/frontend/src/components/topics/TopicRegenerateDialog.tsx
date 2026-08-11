import { Button, Textarea } from '@/components/ui';
import type { TopicRow } from '@/types';
import { pickLang, topics as topicLabels, common as commonLabels } from '@/lib/translations';
import type { ResumeLang } from '@/types';

interface TopicRegenerateDialogProps {
    topic: TopicRow;
    lang: ResumeLang;
    hint: string;
    onHintChange: (value: string) => void;
    onCancel: () => void;
    onSubmit: () => void;
}

export function TopicRegenerateDialog({
    topic,
    lang,
    hint,
    onHintChange,
    onCancel,
    onSubmit,
}: TopicRegenerateDialogProps) {
    const t = pickLang(topicLabels, lang);
    const tc = pickLang(commonLabels, lang);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={onCancel}
                aria-hidden="true"
            />
            <div className="relative bg-white rounded-xl shadow-2xl p-6 max-w-md w-full mx-4">
                <h3 className="font-semibold mb-1">{t.regenerateTitle}</h3>
                <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                    &quot;{topic.topic_text}&quot;
                </p>
                <Textarea
                    value={hint}
                    onChange={(e) => onHintChange(e.target.value)}
                    placeholder={t.regenerateHintPlaceholder}
                    rows={2}
                    className="text-sm mb-4"
                    autoFocus
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            onSubmit();
                        }
                    }}
                />
                <div className="flex gap-2 justify-end">
                    <Button size="sm" variant="outline" onClick={onCancel}>
                        {tc.cancel}
                    </Button>
                    <Button size="sm" onClick={onSubmit}>
                        {t.regenerateSubmit}
                    </Button>
                </div>
            </div>
        </div>
    );
}
