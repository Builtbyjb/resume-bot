import { useState } from "react";
import { MAX_RESUME_BYTES, type Resume } from "@resume-bot/shared";
import { FileIcon, UploadIcon } from "@/components/ui/icons";
import { useToast } from "@/components/ui/toast-context";
import { api } from "@/lib/api";
import { mediumDate } from "@/lib/format";
import { ProfileSection, RemoveButton } from "../components";

type UploadedResume = Omit<Resume, "uploadedAt"> & { uploadedAt: string };

/** Uploads happen immediately, not through the profile form's Save button. */
export function ResumeSection({
    resume,
    onChange,
}: {
    resume: Resume | null;
    onChange: (resume: Resume | null) => void;
}) {
    const showToast = useToast();
    const [uploading, setUploading] = useState(false);
    const [dragging, setDragging] = useState(false);

    const upload = async (file: File) => {
        const isPdf = file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
        if (!isPdf) return showToast("Please choose a PDF file.", "error");
        if (file.size > MAX_RESUME_BYTES) return showToast("That file is larger than 5 MB.", "error");

        const body = new FormData();
        body.append("resume", file);
        setUploading(true);
        showToast("Uploading resume…");

        try {
            const uploaded = await api<UploadedResume>("/profile/resume", { method: "POST", body });
            onChange({ ...uploaded, uploadedAt: new Date(uploaded.uploadedAt) });
            showToast("Resume uploaded");
        } catch {
            showToast("Couldn't upload your resume. Please try again.", "error");
        } finally {
            setUploading(false);
        }
    };

    const remove = async () => {
        if (!confirm("Remove your uploaded resume?")) return;
        try {
            await api("/profile/resume", { method: "DELETE" });
            onChange(null);
            showToast("Resume removed");
        } catch {
            showToast("Couldn't remove your resume. Please try again.", "error");
        }
    };

    return (
        <ProfileSection
            id="resume"
            description="Upload your current resume. The AI uses it as reference material alongside the details below."
        >
            <div
                hidden={!resume}
                className="flex flex-wrap items-center gap-[0.9rem] rounded-xl border border-muted/12 px-4 py-[0.9rem] [&>svg]:size-6 [&>svg]:shrink-0 [&>svg]:text-muted"
            >
                <FileIcon />
                <span className="flex min-w-[10rem] flex-1 flex-col">
                    <a
                        href={resume?.url ?? "#"}
                        download={resume?.fileName ?? ""}
                        className="truncate text-[0.9rem] hover:text-accent"
                    >
                        {resume?.fileName}
                    </a>
                    <small className="text-[0.75rem] text-muted opacity-60">
                        {resume ? `Uploaded ${mediumDate.format(resume.uploadedAt)}` : ""}
                    </small>
                </span>
                <div className="flex gap-1">
                    <label
                        htmlFor="resume-input"
                        className="cursor-pointer rounded-lg px-[0.6rem] py-[0.35rem] text-[0.8rem] text-muted hover:bg-muted/8 hover:text-text"
                    >
                        Replace
                    </label>
                    <RemoveButton className="ml-0" onClick={remove} />
                </div>
            </div>
            <label
                hidden={Boolean(resume)}
                aria-busy={uploading || undefined}
                data-dragging={dragging || undefined}
                className="relative flex cursor-pointer flex-col items-center gap-[0.35rem] rounded-xl border-[1.5px] border-dashed border-muted/25 px-6 py-8 text-center transition-[border-color,background-color] duration-150 hover:border-accent hover:bg-accent/6 has-focus-visible:border-accent has-focus-visible:bg-accent/6 data-dragging:border-accent data-dragging:bg-accent/6 aria-busy:pointer-events-none aria-busy:opacity-60 [&>svg]:mb-1 [&>svg]:size-7 [&>svg]:text-muted"
            >
                <UploadIcon />
                <strong className="text-[0.95rem] font-normal">
                    Drop your resume here or click to browse
                </strong>
                <small className="text-[0.8rem] text-muted opacity-65">PDF, up to 5 MB</small>
                <input
                    type="file"
                    id="resume-input"
                    accept="application/pdf,.pdf"
                    aria-label="Upload resume (PDF)"
                    className="absolute inset-0 cursor-pointer opacity-0"
                    onDragEnter={() => setDragging(true)}
                    onDragLeave={() => setDragging(false)}
                    onDrop={() => setDragging(false)}
                    onChange={(e) => {
                        const file = e.target.files?.[0];
                        e.target.value = "";
                        if (file) void upload(file);
                    }}
                />
            </label>
        </ProfileSection>
    );
}
