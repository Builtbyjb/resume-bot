import { useState, type FormEvent } from "react";
import { revalidateLogic } from "@tanstack/react-form";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { loginSchema, otpSchema } from "@resume-bot/shared";
import { cardClass } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { ApiError } from "@/lib/api";
import { requestOtp, verifyOtp } from "@/lib/auth";
import { useAppForm } from "@/lib/form";

export const Route = createFileRoute("/_guest/signin")({
    head: () => ({
        meta: [{ title: "Sign in - Job Bot" }, { name: "description", content: "Sign in to Job Bot" }],
    }),
    component: SigninPage,
});

const wrapClass = "flex justify-center px-8 pt-20 pb-6";
const formClass = `${cardClass} flex w-full max-w-[400px] flex-col gap-4`;
const labelClass = "flex flex-col gap-[0.4rem] text-[0.875rem] text-muted";
const inputClass =
    "rounded-[10px] border border-border bg-bg px-[0.9rem] py-[0.7rem] text-text outline-none transition-[border-color] duration-150 focus:border-accent aria-[invalid=true]:border-danger";

const errorMessage = (error: unknown) =>
    error instanceof ApiError && error.status < 500
        ? error.message
        : "Something went wrong. Please try again.";

const submitHandler = (submit: () => Promise<void>) => (event: FormEvent) => {
    event.preventDefault();
    event.stopPropagation();
    void submit();
};

function SigninPage() {
    const navigate = useNavigate();
    const [otpSent, setOtpSent] = useState(false);
    const [signinError, setSigninError] = useState("");
    const [otpError, setOtpError] = useState("");

    const signinForm = useAppForm({
        defaultValues: { email: "" },
        validationLogic: revalidateLogic(),
        validators: { onDynamic: loginSchema },
        onSubmit: async ({ value }) => {
            setSigninError("");
            try {
                await requestOtp(value.email.trim());
                setOtpSent(true);
            } catch (error) {
                setSigninError(errorMessage(error));
            }
        },
    });

    const otpForm = useAppForm({
        defaultValues: { otp: "" },
        validationLogic: revalidateLogic(),
        validators: { onDynamic: otpSchema },
        onSubmit: async ({ value }) => {
            setOtpError("");
            try {
                await verifyOtp(value.otp.trim());
                await navigate({ to: "/jobs" });
            } catch (error) {
                setOtpError(errorMessage(error));
            }
        },
    });

    return (
        <>
            <div className={wrapClass}>
                <form className={formClass} noValidate onSubmit={submitHandler(signinForm.handleSubmit)}>
                    <h1 className="font-mono text-[1.6rem] italic">Welcome back</h1>
                    <signinForm.AppField name="email">
                        {(field) => (
                            <label className={labelClass}>
                                Email
                                <input
                                    type="email"
                                    name={field.name}
                                    autoComplete="email"
                                    required
                                    className={inputClass}
                                    value={field.state.value}
                                    onChange={(e) => field.handleChange(e.target.value)}
                                    onBlur={field.handleBlur}
                                    aria-invalid={field.state.meta.errors.length > 0 || undefined}
                                />
                                <field.FieldError />
                            </label>
                        )}
                    </signinForm.AppField>
                    <signinForm.Subscribe selector={(state) => state.isSubmitting}>
                        {(isSubmitting) => (
                            <Button type="submit" variant="primary" disabled={isSubmitting}>
                                Sign In
                            </Button>
                        )}
                    </signinForm.Subscribe>
                    {signinError && (
                        <p role="alert" className="text-[0.875rem] text-danger">
                            {signinError}
                        </p>
                    )}
                </form>
            </div>

            {otpSent && (
                <div className={wrapClass}>
                    <form className={formClass} noValidate onSubmit={submitHandler(otpForm.handleSubmit)}>
                        <otpForm.AppField name="otp">
                            {(field) => (
                                <label className={labelClass}>
                                    OTP - One Time Password
                                    <input
                                        type="text"
                                        name={field.name}
                                        autoComplete="one-time-code"
                                        required
                                        className={inputClass}
                                        value={field.state.value}
                                        onChange={(e) => field.handleChange(e.target.value)}
                                        onBlur={field.handleBlur}
                                        aria-invalid={field.state.meta.errors.length > 0 || undefined}
                                    />
                                    <field.FieldError />
                                </label>
                            )}
                        </otpForm.AppField>
                        <otpForm.Subscribe selector={(state) => state.isSubmitting}>
                            {(isSubmitting) => (
                                <Button type="submit" variant="primary" disabled={isSubmitting}>
                                    Submit
                                </Button>
                            )}
                        </otpForm.Subscribe>
                        {otpError && (
                            <p role="alert" className="text-[0.875rem] text-danger">
                                {otpError}
                            </p>
                        )}
                    </form>
                </div>
            )}
        </>
    );
}
