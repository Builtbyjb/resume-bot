import type { Job } from "@resume-bot/shared";

export default function JobsTable({
  jobs,
  // selectedId,
  onOpen,
}: {
  jobs: Job[];
  selectedId?: string;
  onOpen: (job: Job) => void;
}) {
  return (
    <div className="overflow-x-auto rounded-xl border border-muted/12">
      <table className="w-full border-collapse text-[0.9rem]">
        <thead>
          <tr>
            <th scope="col" >
              Job title
            </th>
            <th scope="col" >
              Company
            </th>
            <th scope="col" >
              Applied
            </th>
            <th scope="col" >
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((job) => (
            <tr
              key={job.id}
              tabIndex={0}
              aria-haspopup="dialog"
              aria-controls="job-drawer"
              onClick={() => onOpen(job)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onOpen(job);
                }
              }}
            // className={cx(
            //   "cursor-pointer outline-none transition-[background-color] duration-150 [&:last-child>td]:border-b-0",
            //   job.id === selectedId
            //     ? "bg-accent/12 shadow-[inset_2px_0_0_var(--color-accent)]"
            //     : "hover:bg-muted/5 focus-visible:bg-muted/5 focus-visible:shadow-[inset_2px_0_0_var(--color-accent)]",
            // )}
            >
              <td className={`font-grotesk text-[0.975rem] font-medium`}>
                {job.title}
              </td>
              <td >{job.company}</td>
              <td >
                {/*<AppliedDate date={job.appliedAt} />*/}
              </td>
              <td >
                {/*<JobStatusBadge status={job.status} />*/}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
