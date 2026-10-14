import { useCallback, useRef } from "react";
import { useBlocker } from "@tanstack/react-router";

/**
 * Asks for confirmation before leaving the page (in-app or closing the tab) while `dirty`.
 * Returns a function that lets the next navigation through, e.g. after deleting the account.
 */
export function useUnsavedChanges(dirty: boolean) {
    const bypass = useRef(false);

    useBlocker({
        shouldBlockFn: () =>
            !bypass.current && !window.confirm("You have unsaved changes. Leave this page anyway?"),
        enableBeforeUnload: () => dirty && !bypass.current,
        disabled: !dirty,
    });

    return useCallback(() => {
        bypass.current = true;
    }, []);
}
