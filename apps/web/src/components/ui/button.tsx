import type { ButtonHTMLAttributes } from "react";
import { cx } from "@/lib/cx";
import { buttonClass, type ButtonStyle } from "./button-styles";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & ButtonStyle;

export function Button({
    variant = "default",
    size = "md",
    className,
    type = "button",
    ...props
}: ButtonProps) {
    return (
        <button
            type={type}
            className={cx(
                buttonClass({ variant, size }),
                // Buttons keep the browser's default control font size; links inherit the text size.
                size === "md" && "text-[0.8333rem]",
                "enabled:hover:-translate-y-px",
                className,
            )}
            {...props}
        />
    );
}
