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
import { PasswordInput } from "@/components/ui/password-input";
import { LoadingSwap } from "@/components/ui/loading-swap";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const signInSchema = z.object({
    email: z.email().min(1),
    password: z.string().min(6),
});

type SignInForm = z.infer<typeof signInSchema>;
export function SignInTab({
    openVerificationEmailTab,
}: {
    openVerificationEmailTab: (email: string) => void;
}) {
    const router = useRouter();
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<SignInForm>({
        resolver: zodResolver(signInSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    async function handleSignIn(data: SignInForm) {
        await authClient.signIn.email({ ...data, callbackURL: "/"}, {
            onError: (error) => {
                if (error.error.code === "EMAIL_NOT_VERIFIED") {
                    openVerificationEmailTab(data.email)
                }
                toast.error(error.error.message || "Failed to sign in");
            },
            onSuccess: () => {
                router.push("/");
            }
        })
    }
    return (
        <form onSubmit={handleSubmit(handleSignIn)} className="space-y-6">
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

            <Button type="submit" className="w-full" disabled={isSubmitting}>
                <LoadingSwap isLoading={isSubmitting}>
                    Sign In
                </LoadingSwap>
            </Button>
        </form>
    );
}