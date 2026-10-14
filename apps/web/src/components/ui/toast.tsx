import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { cx } from "@/lib/cx";
import { ToastContext, type ToastVariant } from "./toast-context";

type Toast = { message: string; variant: ToastVariant };

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toast, setToast] = useState<Toast | null>(null);
    const timer = useRef<number>(undefined);

    const showToast = useCallback((message: string, variant: ToastVariant = "success") => {
        setToast({ message, variant });
        window.clearTimeout(timer.current);
        timer.current = window.setTimeout(() => setToast(null), 4000);
    }, []);

    useEffect(() => () => window.clearTimeout(timer.current), []);

    return (
        <ToastContext value={showToast}>
            {children}
            <div
                role="status"
                aria-live="polite"
                className={cx(
                    "fixed right-6 bottom-6 z-20 rounded-[10px] border px-[1.1rem] py-[0.7rem] text-[0.875rem] shadow-[0_12px_32px_rgba(0,0,0,0.45)] empty:hidden",
                    toast?.variant === "error"
                        ? "border-danger/40 bg-[#2a1f1f] text-danger"
                        : "border-success/40 bg-[#1f2a22] text-success",
                )}
            >
                {toast?.message}
            </div>
        </ToastContext>
    );
}
