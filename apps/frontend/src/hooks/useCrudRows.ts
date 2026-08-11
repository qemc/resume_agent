import { useCallback } from 'react';
import { toNumericId } from '@/lib/mappers';

type RowWithId = { id: number };

interface UseCrudRowsConfig<TRow extends RowWithId> {
    getRows: () => TRow[];
    setRows: (updater: (rows: TRow[]) => TRow[]) => void;
    create: () => Promise<TRow>;
    remove: (id: number) => Promise<void>;
    saveRow: (row: TRow) => Promise<unknown>;
    sectionKey: string;
    setSavingSection: (section: string | null) => void;
    onError?: (message: string) => void;
    skipSaveWhenEmpty?: boolean;
}

export function useCrudRows<TRow extends RowWithId>({
    getRows,
    setRows,
    create,
    remove,
    saveRow,
    sectionKey,
    setSavingSection,
    onError,
    skipSaveWhenEmpty = true,
}: UseCrudRowsConfig<TRow>) {
    const handleError = useCallback(
        (message: string, error: unknown) => {
            console.error(message, error);
            onError?.(message);
        },
        [onError]
    );

    const add = useCallback(async () => {
        try {
            const created = await create();
            setRows((rows) => [...rows, created]);
        } catch (error) {
            handleError(`Failed to create ${sectionKey}`, error);
        }
    }, [create, setRows, sectionKey, handleError]);

    const removeById = useCallback(
        async (id: string) => {
            const numId = toNumericId(id);
            try {
                await remove(numId);
                setRows((rows) => rows.filter((row) => row.id !== numId));
            } catch (error) {
                handleError(`Failed to delete ${sectionKey}`, error);
            }
        },
        [remove, setRows, sectionKey, handleError]
    );

    const updateLocal = useCallback(
        (id: string, field: keyof TRow, value: TRow[keyof TRow]) => {
            const numId = toNumericId(id);
            setRows((rows) =>
                rows.map((row) => (row.id === numId ? { ...row, [field]: value } : row))
            );
        },
        [setRows]
    );

    const saveAll = useCallback(async () => {
        const rows = getRows();
        if (skipSaveWhenEmpty && rows.length === 0) return;

        setSavingSection(sectionKey);
        try {
            await Promise.all(rows.map((row) => saveRow(row)));
        } catch (error) {
            handleError(`Failed to save ${sectionKey}`, error);
        } finally {
            setSavingSection(null);
        }
    }, [getRows, saveRow, sectionKey, setSavingSection, skipSaveWhenEmpty, handleError]);

    return { add, remove: removeById, updateLocal, saveAll };
}
