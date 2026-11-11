import type { ReactNode } from "react";

type Props = {
  icon: ReactNode;
  text: ReactNode;
};

export default function Banner({ icon, text }: Props) {
  return (
    <div
      role="status"
      className="mb-4 flex items-center gap-3 rounded-xl border border-warning/40 bg-warning/10 px-4 py-3 text-sm text-warning"
    >
      <span aria-hidden="true" className="shrink-0 [&>svg]:size-5">
        {icon}
      </span>
      <p className="text-foreground/90">{text}</p>
    </div>
  );
}
