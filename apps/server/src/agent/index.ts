import { ENV, JobDetails } from "@/lib/types"
import { Job, jobsSchema } from "@resume-bot/shared"
import OpenAI from "openai"

export class AgentService {
    private readonly env: ENV

    constructor(env: ENV) {
        this.env = env
    }

    public async findJobs(jobDetails: JobDetails): Promise<Job[]> {
        try {
            const client = new OpenAI({
                baseURL: this.env.MODEL_BASE_URL,
                apiKey: this.env.MODEL_API_KEY,
            });

            const response = await client.responses.create({
                model: this.env.MODEL_NAME,
                reasoning: { effort: "xhigh" },
                instructions: this.generateInstructions(),
                input: this.generatePrompt(jobDetails),
            });

            // console.log(JSON.stringify(response, null, 2));
            // return jobsSchema.parse(response)
            console.log(response.output_text)
            return [];

        } catch (error) {
            console.log(error)
            return []
        }
    }

    private generateInstructions(): string {
        return "You are an expert job researcher. Your output should be JSON only with no explanation"
    }

    private generatePrompt(jobDetails: JobDetails): string {
        return `
        Search this job boards for ${jobDetails.jobBoards} for jobs relating to ${jobDetails.role}.
        Your output should be a list JSON objects following the example structure below:
        """
        [
          {
            "title": "Software Engineer",
            "company": "Google",
            "postingUrl": "https://careers.google.com/jobs/software-engineer",
            "postedDate": "2026-11-01T10:30:00.000Z"
            "location": "Toronto, ON, Canada",
            "workMode": "hybrid",
            "salary": "$90,000 - $120,000 CAD",
            "source": "LinkedIn",
            "description": "Responsible for designing, developing, testing, and maintaining scalable software applications. Collaborate with cross-functional teams to build reliable and efficient software solutions.",
          },
          {
            "title": "Frontend Developer",
            "company": "Shopify",
            "postingUrl": "https://www.shopify.com/careers",
            "postedDate": "2026-11-01T10:30:00.000Z"
            "location": "Remote, Canada",
            "workMode": "remote",
            "salary": null,
            "source": "Company Website",
            "description": "Build and maintain responsive user interfaces using modern JavaScript frameworks. Work closely with designers and backend engineers to deliver excellent user experiences.",
          }
        ]
        """

        where;
        title - is the role of the job description.
        company - the company the posted the job.
        postingURL - the url to the job posting.
        postedDate - the date the job was posting if available
        location - the location were the employee is going to work.
        workMode - mode of the work it can be hybrid, onsite and remote.
        salary - the salary listed in the job posting.
        source - the job board where the job posting was found.
        description - A summary for the job description on the job posting.( Make sure the summary all relevant information)



        IMPORTANT: Only return jobs posted after this date and time ${jobDetails.lastPostedDate} and return as many jobs as you can find across all the job boards in ${jobDetails.jobBoards}
        `
    }
}
