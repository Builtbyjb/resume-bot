import { useRef, useState } from "react";

/**
 * Focus handling for add/remove entry lists: a new entry focuses its first field,
 * and removing an entry moves focus to the list's "Add" button.
 */
export function useEntryList() {
    const addButtonRef = useRef<HTMLButtonElement>(null);
    const [newEntryId, setNewEntryId] = useState<string | null>(null);

    return {
        addButtonRef,
        isNew: (id: string) => id === newEntryId,
        added: (id: string) => setNewEntryId(id),
        removed: () => addButtonRef.current?.focus(),
    };
}
