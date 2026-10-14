import type { ElementType, ReactNode } from "react";
import { cx } from "@/lib/cx";

type CardProps = {
    title: ReactNode;
    titleId: string;
    description: ReactNode;
    danger?: boolean;
    id?: string;
    className?: string;
    children: ReactNode;
};

export function Card({ title, titleId, description, danger, id, className, children }: CardProps) {
    return (
        <section
            id={id}
            aria-labelledby={titleId}
            className={cx(
                "rounded-[14px] border",
                danger ? "border-danger/35" : "border-muted/12",
                className,
            )}
        >
            <header className="px-6 py-5">
                <h2 id={titleId} className={cx("mb-1 text-[1.15rem]", danger && "text-danger")}>
                    {title}
                </h2>
                <p className="text-[0.85rem] text-muted opacity-70">{description}</p>
            </header>
            {children}
        </section>
    );
}

export const cardBodyClass = "flex flex-col gap-5 border-t border-muted/8 px-6 pt-5 pb-6";

export function CardBody({ children }: { children: ReactNode }) {
    return <div className={cardBodyClass}>{children}</div>;
}

export function SettingRow({ children }: { children: ReactNode }) {
    return (
        <div className="grid grid-cols-[1fr_auto] items-center gap-x-8 gap-y-3 border-t border-muted/8 px-6 py-[1.1rem] max-[640px]:grid-cols-1">
            {children}
        </div>
    );
}

type SettingLabelProps = {
    as?: ElementType;
    htmlFor?: string;
    id?: string;
    title?: ReactNode;
    description: ReactNode;
};

export function SettingLabel({ as: Tag = "div", htmlFor, id, title, description }: SettingLabelProps) {
    return (
        <Tag htmlFor={htmlFor} id={id} className="flex flex-col gap-[0.2rem]">
            {title && <strong className="text-[0.95rem] font-normal">{title}</strong>}
            <small className="text-[0.8rem] leading-normal text-muted opacity-65">
                {description}
            </small>
        </Tag>
    );
}

export function PageHeader({ title }: { title: string }) {
    return (
        <header className="mb-7">
            <h1 className="text-[2rem]">{title}</h1>
        </header>
    );
}

export const stackClass = "flex max-w-[760px] flex-col gap-6";
