"use client";

import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import {
    Field,
    FieldContent,
    FieldError,
    FieldGroup,
    FieldLabel,
    FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button";
import { LoadingSwap } from "@/components/ui/loading-swap";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

const forgotPasswordSchema = z.object({
    email: z.email().min(1),
});

type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;
export function ForgotPassword({
    openSignInTab,
}: {
    openSignInTab: () => void;
}) {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<ForgotPasswordForm>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: {
            email: "",
        },
    });

    async function handleForgotPassword(data: ForgotPasswordForm) {
        await authClient.requestPasswordReset(
            {
                ...data,
                redirectTo: "/auth/reset-password",
            },
            {
                onError: error => {
                    toast.error(
                        error.error.message || "Failed to send password reset email"
                    )
                },
                onSuccess: () => {
                    toast.success("Password reset email sent")
                },
            }
        )
    }
    return (
        <form onSubmit={handleSubmit(handleForgotPassword)} className="space-y-6">
            <FieldSet>
                <FieldGroup>
                    {/* email */}
                    <Field>
                        <FieldLabel>Email</FieldLabel>
                        <FieldContent>
                            <Input
                                type="email"
                                placeholder="Enter your email"
                                {...register("email")}
                            />
                        </FieldContent>

                        {errors.email && <FieldError>{errors.email.message}</FieldError>}
                    </Field>
                </FieldGroup>
            </FieldSet>

            <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={openSignInTab}>
                    Back
                </Button>
                <Button type="submit" disabled={isSubmitting} className="flex-1">
                    <LoadingSwap isLoading={isSubmitting}>Send Reset Email</LoadingSwap>
                </Button>
            </div>
        </form>
    );
}