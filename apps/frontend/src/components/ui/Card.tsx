

import { type HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
    /** Section number badge (1, 2, 3, etc.) */
    sectionNumber?: number;
    /** Title of the card section */
    title?: string;
    /** Subtitle or description */
    subtitle?: string;
    /** Color theme for the section badge */
    badgeColor?: 'blue' | 'green' | 'purple' | 'orange' | 'teal';
    /** Whether this section is optional */
    isOptional?: boolean;
    /** Action button in the header (e.g., "Add" button) */
    headerAction?: React.ReactNode;
}

const badgeColors = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600',
    teal: 'bg-teal-100 text-teal-600',
} as const;

export const Card = forwardRef<HTMLDivElement, CardProps>(
    (
        {
            className,
            sectionNumber,
            title,
            subtitle,
            badgeColor = 'blue',
            isOptional = false,
            headerAction,
            children,
            ...props
        },
        ref
    ) => {
        return (
            <div
                ref={ref}
                className={cn(
                    'bg-card rounded-xl p-6 shadow-lg border border-border',
                    'transition-shadow duration-200 hover:shadow-xl',
                    className
                )}
                {...props}
            >

                {(title || headerAction) && (
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
                        <div className="flex items-center gap-3">
                            {sectionNumber && (
                                <span
                                    className={cn(
                                        'w-8 h-8 rounded-full flex items-center justify-center',
                                        'text-sm font-bold shrink-0',
                                        badgeColors[badgeColor]
                                    )}
                                >
                                    {sectionNumber}
                                </span>
                            )}
                            <div>
                                <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                                    {title}
                                    {isOptional && (
                                        <span className="text-sm font-normal text-muted-foreground">
                                            (Optional)
                                        </span>
                                    )}
                                </h2>
                                {subtitle && (
                                    <p className="text-sm text-muted-foreground mt-0.5">
                                        {subtitle}
                                    </p>
                                )}
                            </div>
                        </div>
                        {headerAction && (
                            <div className="shrink-0">{headerAction}</div>
                        )}
                    </div>
                )}


                {children}
            </div>
        );
    }
);

Card.displayName = 'Card';

export interface CardItemProps extends HTMLAttributes<HTMLDivElement> {
    /** Show remove button */
    onRemove?: () => void;
    /** Disable remove functionality */
    canRemove?: boolean;
}

export const CardItem = forwardRef<HTMLDivElement, CardItemProps>(
    ({ className, onRemove, canRemove = true, children, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(
                    'p-4 bg-secondary/50 rounded-lg border border-border relative',
                    'transition-all duration-200 hover:bg-secondary/70',
                    className
                )}
                {...props}
            >
                {onRemove && canRemove && (
                    <button
                        type="button"
                        onClick={onRemove}
                        className={cn(
                            'absolute top-2 right-2 p-1.5 rounded-md',
                            'text-muted-foreground hover:text-destructive',
                            'hover:bg-destructive/10 transition-colors',
                            'focus:outline-none focus:ring-2 focus:ring-destructive'
                        )}
                        aria-label="Remove item"
                    >
                        <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            aria-hidden="true"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                )}
                {children}
            </div>
        );
    }
);

CardItem.displayName = 'CardItem';
