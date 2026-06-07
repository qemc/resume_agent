interface ErrorBannerProps {
    message: string | null;
    onDismiss?: () => void;
}

export function ErrorBanner({ message, onDismiss }: ErrorBannerProps) {
    if (!message) return null;

    return (
        <div className="mb-4 p-3 bg-destructive/10 text-destructive text-sm rounded-lg flex items-start justify-between gap-2">
            <span>{message}</span>
            {onDismiss && (
                <button
                    type="button"
                    onClick={onDismiss}
                    className="shrink-0 text-destructive/80 hover:text-destructive font-medium"
                    aria-label="Dismiss"
                >
                    ×
                </button>
            )}
        </div>
    );
}
