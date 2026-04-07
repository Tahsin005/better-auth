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
import { Button } from "@/components/ui/button";
import { LoadingSwap } from "@/components/ui/loading-swap";
import { authClient } from "@/lib/auth/auth-client";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { PasswordInput } from "@/components/ui/password-input";

const resetPasswordSchema = z.object({
    password: z.string().min(6),
})

type ResetPasswordForm = z.infer<typeof resetPasswordSchema>

export default function ResetPasswordPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const token = searchParams.get("token")
    const error = searchParams.get("error")

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<ResetPasswordForm>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            password: "",
        },
    });

    async function handleResetPassword(data: ResetPasswordForm) {
        if (token == null) return

        await authClient.resetPassword(
            {
                newPassword: data.password,
                token,
            },
            {
                onError: error => {
                    toast.error(error.error.message || "Failed to reset password")
                },
                onSuccess: () => {
                    toast.success("Password reset successful", {
                        description: "Redirection to login...",
                    })
                    setTimeout(() => {
                        router.push("/auth/login")
                    }, 1000)
                },
            }
        )
    }

    if (token == null || error != null) {
        return (
            <div className="my-6 px-4">
                <Card className="w-full max-w-md mx-auto">
                    <CardHeader>
                        <CardTitle>Invalid Reset Link</CardTitle>
                        <CardDescription>
                            The password reset link is invalid or has expired.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button className="w-full" asChild>
                            <Link href="/auth/login">Back to Login</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }
    return (
        <div className="my-6 px-4">
            <Card className="w-full max-w-md mx-auto">
                <CardHeader>
                    <CardTitle className="text-2xl">Reset Your Password</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(handleResetPassword)} className="space-y-6">
                        <FieldSet>
                            <FieldGroup>
                                {/* password */}
                                <Field>
                                    <FieldLabel>Password</FieldLabel>
                                    <FieldContent>
                                        <PasswordInput
                                            placeholder="Enter your password"
                                            {...register("password")}
                                        />
                                    </FieldContent>
                                    {errors.password && <FieldError>{errors.password.message}</FieldError>}
                                </Field>
                            </FieldGroup>
                        </FieldSet>
                        <Button type="submit" disabled={isSubmitting} className="flex-1">
                            <LoadingSwap isLoading={isSubmitting}>
                                Reset Password
                            </LoadingSwap>
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}