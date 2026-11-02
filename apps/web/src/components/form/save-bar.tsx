import { useFormContext } from "@/components/form/form-context";

/** Sticky "unsaved changes" bar. Must be rendered inside the <form>. */
export function SaveBar({ dirty, onDiscard }: { dirty: boolean; onDiscard: () => void }) {
  const form = useFormContext();
  return (
    <div
      hidden={!dirty}
      className="sticky bottom-4 z-5 flex flex-wrap items-center justify-between gap-x-4 gap-y-3 rounded-xl border border-muted/18 bg-surface py-3 pr-3 pl-5 text-[0.875rem] shadow-[0_12px_32px_rgba(0,0,0,0.45)]"
    >
      <span>You have unsaved changes</span>
      <form.Subscribe selector={(state) => state.isSubmitting}>
        {(isSubmitting) => (
          <div className="flex gap-2">
            <button onClick={onDiscard} disabled={isSubmitting}>
              Discard
            </button>
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving…" : "Save changes"}
            </button>
          </div>
        )}
      </form.Subscribe>
    </div>
  );
}
