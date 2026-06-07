import type { ResumeLang } from '@/types';

interface LanguageToggleProps {
    activeLang: ResumeLang;
    onChange: (lang: ResumeLang) => void;
}

export function LanguageToggle({ activeLang, onChange }: LanguageToggleProps) {
    return (
        <div className="flex items-center gap-2 bg-muted rounded-lg p-1">
            <button
                type="button"
                onClick={() => onChange('EN')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
                    activeLang === 'EN'
                        ? 'bg-white shadow-md text-foreground ring-2 ring-blue-500 font-bold'
                        : 'text-muted-foreground hover:text-foreground hover:bg-gray-100'
                }`}
            >
                <span className="text-lg">🇬🇧</span>
                <span>EN</span>
            </button>
            <button
                type="button"
                onClick={() => onChange('PL')}
                className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all ${
                    activeLang === 'PL'
                        ? 'bg-white shadow-md text-foreground ring-2 ring-red-500 font-bold'
                        : 'text-muted-foreground hover:text-foreground hover:bg-gray-100'
                }`}
            >
                <span className="text-lg">🇵🇱</span>
                <span>PL</span>
            </button>
        </div>
    );
}
