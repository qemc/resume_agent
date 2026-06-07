interface PageLoadingProps {
    message: string;
}

export function PageLoading({ message }: PageLoadingProps) {
    return (
        <div className="flex items-center justify-center min-h-[50vh]">
            <p className="text-lg text-muted-foreground">{message}</p>
        </div>
    );
}
