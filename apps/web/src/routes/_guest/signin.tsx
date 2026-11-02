import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { loginSchema, otpSchema } from "@resume-bot/shared";
import { ApiError, handleFetch } from "@/lib/api";
import { useAppForm } from "@/components/form";

export const Route = createFileRoute("/_guest/signin")({
  head: () => ({
    meta: [{ title: "Sign in - Job Bot" }, { name: "description", content: "Sign in to Job Bot" }],
  }),
  component: SigninPage,
});

function SigninPage() {
  const navigate = useNavigate();
  const [otpSent, setOtpSent] = useState(false);
  const [signinError, setSigninError] = useState("");
  const [otpError, setOtpError] = useState("");

  const isSubmitting = false;

  const signinForm = useAppForm({
    defaultValues: { email: "" },
    validators: { onSubmit: loginSchema },
    onSubmit: async ({ value }) => {
      try {
        await handleFetch({
          path: "/auth/signin",
          method: "POST",
          contentType: "application/json",
          body: value
        })

        setOtpSent(true)
      } catch (error: unknown) {
        // TODO: Proper error handling
        console.log(error)
      }
    },
  });

  const otpForm = useAppForm({
    defaultValues: { otp: "" },
    validators: { onSubmit: otpSchema },
    onSubmit: async ({ value }) => {
      try {
        const response = await handleFetch({
          path: "/auth/otp",
          method: "POST",
          contentType: "application/json",
          body: value
        })

        const result = await response.json()
        // TODO: Zod validation for result
        localStorage.setItem("userData", result.userData)
        navigate({ to: "/jobs" })
      } catch (error) {
        console.log(error)
      }
    },
  });

  return (
    <div className="w-150 mx-auto">
      <div>
        <h1 className="font-mono text-[1.6rem] italic">Welcome back</h1>

        <form className="mb-2" onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          signinForm.handleSubmit()
        }}>
          <div className="mb-2">
            <signinForm.AppField name="email" children={(field) => <field.TextField label="Email" />} />
          </div>
          <button type="submit" disabled={isSubmitting}> Get OTP </button>
          {signinError && (
            <p role="alert" className="text-[0.875rem] text-danger">
              {signinError}
            </p>
          )}
        </form>

        <form onSubmit={(e) => {
          e.preventDefault()
          e.stopPropagation()
          otpForm.handleSubmit()
        }}>
          <div className="mb-8">
            <otpForm.AppField
              name="otp"
              children={(field) => <field.TextField label="OTP - One Time Password" disabled={!otpSent} />}
            />
          </div>
          <button type="submit" disabled={isSubmitting}> Sign In </button>
          {otpError && (
            <p role="alert" className="text-[0.875rem] text-danger">
              {otpError}
            </p>
          )}
        </form>
      </div >
    </div >
  );
}
