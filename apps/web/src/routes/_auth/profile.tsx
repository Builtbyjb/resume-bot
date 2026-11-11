import { createFileRoute } from "@tanstack/react-router";
import { TriangleAlert } from "lucide-react";
import Header from "@/components/header";
import Banner from "@/components/banner";
import { handleFetch } from "@/lib/api";
import { profileSchema, type Profile } from "@resume-bot/shared";
import { useAppForm } from "@/components/form";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_auth/profile")({
  head: () => ({
    meta: [
      { title: "Profile - Job Bot" },
      {
        name: "description",
        content: "Your details for personalized resumes and cover letters",
      },
    ],
  }),
  loader: async () => {
    const response = await handleFetch({
      path: "/profile",
      method: "GET",
    });

    if (!response) return { profile: null };

    const result = await response.json();
    const parsedResult = profileSchema.parse(result.data);

    return { profile: parsedResult };
  },
  component: ProfileRoute,
});

function ProfileRoute() {
  const { profile } = Route.useLoaderData();

  const defaultValues: Profile = {
    name: "",
    role: "",
    phone: "",
    address: "",
    experience: [
      {
        title: "",
        location: "",
        company: "",
        startDate: null,
        endDate: null,
        achievements: [],
      },
    ],
    salary: "",
    workMode: "remote",
    location: "",
    radius: "",
  };

  const form = useAppForm({
    defaultValues,
    validators: { onSubmit: profileSchema },
    onSubmit: async ({ value }) => {
      console.log(value);
    },
  });

  return (
    <>
      {!profile && (
        <Banner
          icon={<TriangleAlert />}
          text="Your profile is incomplete. Fill it in so the bot can find relevant jobs, tailor resumes and cover letters for you."
        />
      )}

      <Header title="Profile" />

      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        <form.AppField
          name="name"
          children={(field) => <field.TextField label="Full Name" />}
        />
        <form.AppField
          name="role"
          children={(field) => <field.TextField label="Role" />}
        />
        <form.AppField
          name="phone"
          children={(field) => <field.TextField label="Phone Number" />}
        />
        <form.AppField
          name="address"
          children={(field) => <field.TextField label="Address" />}
        />

        <div className="">
          <form.AppField
            name="experience"
            mode="array"
            children={(field) => (
              <>
                <div className="flex gap-4 items-center mb-4">
                  <p>Experiences</p>
                  <Button
                    onClick={() =>
                      field.pushValue({
                        title: "",
                        location: "",
                        company: "",
                        startDate: null,
                        endDate: null,
                        achievements: [],
                      })
                    }
                  >
                    {" "}
                    +
                  </Button>
                </div>
                {field.state.value.map((_, i) => (
                  <Card className="space-y-4 mb-4" key={i}>
                    <Button onClick={() => field.removeValue(i)}>-</Button>
                    <form.AppField
                      name={`experience[${i}].title`}
                      children={(field) => <field.TextField label="Title" />}
                    />
                    <form.AppField
                      name={`experience[${i}].location`}
                      children={(field) => <field.TextField label="Location" />}
                    />
                    <form.AppField
                      name={`experience[${i}].company`}
                      children={(field) => <field.TextField label="Company" />}
                    />

                    <div className="flex gap-4">
                      <form.AppField
                        name={`experience[${i}].startDate`}
                        children={(field) => (
                          <field.DateField label="Start Date" />
                        )}
                      />
                      <form.AppField
                        name={`experience[${i}].endDate`}
                        children={(field) => (
                          <field.DateField label="End Date" />
                        )}
                      />
                    </div>

                    <form.AppField
                      name={`experience[${i}].achievements`}
                      mode="array"
                      children={(field) => (
                        <>
                          <div className="flex gap-4 items-center">
                            <p>Achievements</p>
                            <Button onClick={() => field.pushValue("")}>
                              +
                            </Button>
                          </div>
                          {field.state.value.map((_, k) => (
                            <div key={k}>
                              <Button onClick={() => field.removeValue(k)}>
                                -
                              </Button>
                              <form.AppField
                                name={`experience[${i}].achievements[${k}]`}
                                children={(field) => (
                                  <field.TextField label="" required={false} />
                                )}
                              />
                            </div>
                          ))}
                        </>
                      )}
                    />
                  </Card>
                ))}
              </>
            )}
          />
        </div>
        <form.AppField
          name="salary"
          children={(field) => <field.TextField label="Salary" />}
        />

        <Button type="submit">Submit</Button>
      </form>
    </>
  );
}
