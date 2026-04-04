import { Card, CardItem, Input, Button } from '@/components/ui';
import type { Certificate } from '@/types';

// Labels in English and Polish
const labels = {
    EN: {
        title: 'Certificates',
        addCertificate: 'Add Certificate',
        name: 'Certificate Name',
        issuer: 'Issuing Organization',
        date: 'Date Obtained',
        url: 'Certificate URL',
        namePlaceholder: 'AWS Solutions Architect',
        issuerPlaceholder: 'Amazon Web Services',
        emptyMessage: 'No certificates added yet. Click the button above to add one.',
    },
    PL: {
        title: 'Certyfikaty',
        addCertificate: 'Dodaj certyfikat',
        name: 'Nazwa certyfikatu',
        issuer: 'Organizacja wydająca',
        date: 'Data uzyskania',
        url: 'Link do certyfikatu',
        namePlaceholder: 'AWS Solutions Architect',
        issuerPlaceholder: 'Amazon Web Services',
        emptyMessage: 'Nie dodano jeszcze certyfikatów. Kliknij powyższy przycisk, aby dodać.',
    },
};

/**
 * Plus icon component.
 */
const PlusIcon = () => (
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
            d="M12 4v16m8-8H4"
        />
    </svg>
);

/**
 * Props for CertificatesSection component.
 */
export interface CertificatesSectionProps {
    /** Array of certificate entries */
    certificates: Certificate[];
    /** Add a new certificate entry */
    onAdd: () => void;
    /** Remove a certificate by ID */
    onRemove: (id: string) => void;
    /** Update a field in a certificate entry */
    onUpdate: (id: string, field: keyof Certificate, value: string) => void;
    /** Extra action to display in header (e.g., Save button) */
    extraHeaderAction?: React.ReactNode;
    /** Language for labels (default: 'EN') */
    lang?: 'EN' | 'PL';
}

/**
 * Certificates section of the resume form.
 */
export function CertificatesSection({
    certificates,
    onAdd,
    onRemove,
    onUpdate,
    extraHeaderAction,
    lang = 'EN',
}: CertificatesSectionProps) {
    const t = labels[lang];

    return (
        <Card
            sectionNumber={5}
            title={t.title}
            badgeColor="orange"
            isOptional
            headerAction={
                <div className="flex flex-wrap items-center gap-2 mt-2 sm:mt-0">
                    {extraHeaderAction}
                    <Button
                        variant="primary"
                        size="sm"
                        onClick={onAdd}
                        leftIcon={<PlusIcon />}
                        className="bg-orange-600 hover:bg-orange-700"
                    >
                        {t.addCertificate}
                    </Button>
                </div>
            }
        >
            {certificates.length === 0 ? (
                <p className="text-muted-foreground text-center py-6 break-words px-2">
                    {t.emptyMessage}
                </p>
            ) : (
                <div className="space-y-4">
                    {certificates.map((cert) => (
                        <CardItem
                            key={cert.id}
                            onRemove={() => onRemove(cert.id)}
                            canRemove
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input
                                    label={t.name}
                                    required
                                    value={cert.certificate_name}
                                    onChange={(e) => onUpdate(cert.id, 'certificate_name', e.target.value)}
                                    placeholder={t.namePlaceholder}
                                />
                                <Input
                                    label={t.issuer}
                                    required
                                    value={cert.issuer}
                                    onChange={(e) => onUpdate(cert.id, 'issuer', e.target.value)}
                                    placeholder={t.issuerPlaceholder}
                                />
                                <Input
                                    label={t.date}
                                    type="month"
                                    required
                                    value={cert.issue_date}
                                    onChange={(e) => onUpdate(cert.id, 'issue_date', e.target.value)}
                                />
                                <Input
                                    label={t.url}
                                    type="url"
                                    value={cert.url || ''}
                                    onChange={(e) => onUpdate(cert.id, 'url', e.target.value)}
                                    placeholder="https://..."
                                />
                            </div>
                        </CardItem>
                    ))}
                </div>
            )}
        </Card>
    );
}
