import type { ButtonHTMLAttributes, ReactNode, Ref } from "react";
import { Card, CardBody } from "@/components/ui/card";
import { cx } from "@/lib/cx";
import { sectionTitle, type SectionId } from "./profile-form";

export function ProfileSection({
    id,
    description,
    children,
}: {
    id: SectionId;
    description: string;
    children: ReactNode;
}) {
    return (
        <Card
            id={id}
            titleId={`${id}-title`}
            title={sectionTitle(id)}
            description={description}
            className="scroll-mt-6"
        >
            <CardBody>{children}</CardBody>
        </Card>
    );
}

export const fieldGridClass = "grid grid-cols-2 gap-x-5 gap-y-4 max-[640px]:grid-cols-1";

export const dateRangeClass = "grid grid-cols-2 gap-3";

export function EntryList({ emptyText, children }: { emptyText: string; children: ReactNode[] }) {
    return (
        <div className="flex flex-col gap-3">
            {children.length ? (
                children
            ) : (
                <div className="rounded-xl border border-dashed border-muted/18 p-5 text-center text-[0.85rem] text-muted opacity-70">
                    {emptyText}
                </div>
            )}
        </div>
    );
}

export function EntryCard({ inline, children }: { inline?: boolean; children: ReactNode }) {
    return (
        <div
            className={cx(
                "flex gap-4 rounded-xl border border-muted/12 bg-muted/2",
                inline
                    ? "flex-row items-end px-[1.1rem] py-[0.9rem] [&>div]:flex-1"
                    : "flex-col px-[1.1rem] pt-[1.1rem] pb-[0.9rem]",
            )}
        >
            {children}
        </div>
    );
}

export function EntryFooter({ children }: { children: ReactNode }) {
    return <footer className="flex items-center justify-between gap-4">{children}</footer>;
}

export function RemoveButton({
    className,
    children = "Remove",
    ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button
            type="button"
            className={cx(
                "cursor-pointer rounded-lg bg-transparent px-[0.6rem] py-[0.35rem] text-[0.8rem] text-muted opacity-70 transition-[background-color,color,opacity] duration-150 hover:bg-danger/10 hover:text-danger hover:opacity-100 focus-visible:bg-danger/10 focus-visible:text-danger focus-visible:opacity-100 focus-visible:outline-none",
                className ?? "ml-auto",
            )}
            {...props}
        >
            {children}
        </button>
    );
}

export function AddButton({
    ref,
    onClick,
    children,
}: {
    ref?: Ref<HTMLButtonElement>;
    onClick: () => void;
    children: ReactNode;
}) {
    return (
        <button
            ref={ref}
            type="button"
            onClick={onClick}
            className="cursor-pointer self-start rounded-[10px] border border-dashed border-muted/30 bg-transparent px-[0.9rem] py-2 text-[0.85rem] text-muted transition-[border-color,color] duration-150 hover:border-accent hover:text-text focus-visible:border-accent focus-visible:text-text focus-visible:outline-none"
        >
            + {children}
        </button>
    );
}
