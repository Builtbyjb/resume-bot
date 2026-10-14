import { useRef, useState, type KeyboardEvent } from "react";
import { useFieldContext } from "@/lib/form-context";

const MAX_TAG_LENGTH = 60;

type Props = {
    labelId: string;
    placeholder: string;
};

/** A list of free-text tags. Enter or comma adds a tag; pasting "a, b, c" adds all of them. */
export function TagInput({ labelId, placeholder }: Props) {
    const field = useFieldContext<string[]>();
    const [draft, setDraft] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);
    const tags = field.state.value;

    const addTags = (raw: string) => {
        const existing = new Set(tags.map((tag) => tag.toLowerCase()));
        const next = [...tags];

        for (const part of raw.split(",")) {
            const value = part.trim().slice(0, MAX_TAG_LENGTH);
            if (!value || existing.has(value.toLowerCase())) continue;
            existing.add(value.toLowerCase());
            next.push(value);
        }

        if (next.length !== tags.length) field.handleChange(next);
    };

    const commitDraft = () => {
        if (!draft.trim()) return;
        addTags(draft);
        setDraft("");
    };

    const removeTag = (index: number) => {
        field.handleChange(tags.filter((_, i) => i !== index));
        inputRef.current?.focus();
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.nativeEvent.isComposing) return;

        if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            commitDraft();
        } else if (e.key === "Backspace" && draft === "" && tags.length) {
            field.handleChange(tags.slice(0, -1));
        }
    };

    const handleChange = (value: string) => {
        // Pasting "React, Vue, Svelte" adds every complete item and keeps the last one editable.
        if (value.includes(",")) {
            const parts = value.split(",");
            const rest = parts.pop() ?? "";
            addTags(parts.join(","));
            setDraft(rest.trimStart());
        } else {
            setDraft(value);
        }
    };

    return (
        <div
            role="group"
            aria-labelledby={labelId}
            onClick={(e) => {
                if (e.target === e.currentTarget) inputRef.current?.focus();
            }}
            className="flex min-h-[2.6rem] cursor-text flex-wrap items-center gap-[0.4rem] rounded-[10px] border border-muted/25 px-[0.45rem] py-[0.35rem] transition-[border-color] duration-150 focus-within:border-accent"
        >
            <ul className="contents">
                {tags.map((tag, index) => (
                    <li
                        key={tag}
                        className="inline-flex max-w-full items-center gap-[0.2rem] rounded-[7px] bg-accent/16 py-[0.15rem] pr-[0.2rem] pl-[0.6rem] text-[0.8rem] text-[#bfdbfe]"
                    >
                        <span className="truncate">{tag}</span>
                        <button
                            type="button"
                            aria-label={`Remove ${tag}`}
                            onClick={() => removeTag(index)}
                            className="inline-flex size-5 cursor-pointer items-center justify-center rounded-[5px] bg-transparent p-0 text-base leading-none text-inherit hover:bg-accent/30 focus-visible:bg-accent/30 focus-visible:outline-none"
                        >
                            ×
                        </button>
                    </li>
                ))}
            </ul>
            <input
                ref={inputRef}
                type="text"
                value={draft}
                maxLength={MAX_TAG_LENGTH}
                placeholder={placeholder}
                aria-labelledby={labelId}
                onChange={(e) => handleChange(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={() => {
                    commitDraft();
                    field.handleBlur();
                }}
                className="min-w-[9rem] flex-1 bg-transparent px-[0.35rem] py-[0.3rem] text-[0.9rem] text-text outline-none"
            />
        </div>
    );
}
