import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { Button } from "./button";
import { fieldInputClass } from "./styles";

type Props = {
    open: boolean;
    onClose: () => void;
    titleId: string;
    title: string;
    description: ReactNode;
    cancelLabel?: string;
    confirmLabel: string;
    workingLabel?: string;
    /** When set, the user has to type this text before confirming. */
    confirmText?: string;
    onConfirm: () => Promise<void>;
};

export function ConfirmDialog({
    open,
    onClose,
    titleId,
    title,
    description,
    cancelLabel = "Cancel",
    confirmLabel,
    workingLabel = "Working…",
    confirmText,
    onConfirm,
}: Props) {
    const dialogRef = useRef<HTMLDialogElement>(null);
    const [typed, setTyped] = useState("");
    const [working, setWorking] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const dialog = dialogRef.current;
        if (!dialog) return;
        if (open && !dialog.open) dialog.showModal();
        if (!open && dialog.open) dialog.close();
    }, [open]);

    const handleClose = () => {
        setTyped("");
        setWorking(false);
        setError("");
        onClose();
    };

    const confirmed = !confirmText || typed.trim() === confirmText;

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        if (!confirmed || working) return;

        setWorking(true);
        setError("");
        try {
            await onConfirm();
        } catch {
            setError("Something went wrong. Please try again.");
            setWorking(false);
        }
    };

    return (
        <dialog
            ref={dialogRef}
            aria-labelledby={titleId}
            onClose={handleClose}
            className="m-auto w-[min(440px,calc(100vw-2rem))] rounded-2xl border border-muted/15 bg-bg p-6 text-text open:animate-dialog-in backdrop:bg-black/60"
        >
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <h2 id={titleId} className="text-[1.2rem]">
                    {title}
                </h2>
                <p className="text-[0.875rem] text-muted">{description}</p>
                {confirmText && (
                    <label className="flex flex-col gap-[0.4rem] text-[0.85rem] text-muted">
                        Type {confirmText} to confirm
                        <input
                            type="text"
                            className={fieldInputClass}
                            value={typed}
                            onChange={(e) => setTyped(e.target.value)}
                            autoComplete="off"
                            spellCheck={false}
                        />
                    </label>
                )}
                <p role="alert" className="text-[0.85rem] text-danger empty:hidden">
                    {error}
                </p>
                <footer className="flex justify-end gap-2">
                    <Button size="compact" onClick={() => dialogRef.current?.close()}>
                        {cancelLabel}
                    </Button>
                    <Button
                        type="submit"
                        variant="dangerSolid"
                        size="compact"
                        disabled={!confirmed || working}
                    >
                        {working ? workingLabel : confirmLabel}
                    </Button>
                </footer>
            </form>
        </dialog>
    );
}
