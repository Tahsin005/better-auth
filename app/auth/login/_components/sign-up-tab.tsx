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

const signUpSchema = z.object({
    name: z.string().min(1),
    email: z.email().min(1),
    password: z.string().min(6),
});

type SignUpForm = z.infer<typeof signUpSchema>;

export function SignUpTab({
    openVerificationEmailTab,
}: {
    openVerificationEmailTab: (email: string) => void;
}) {
    const router = useRouter();
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<SignUpForm>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
        },
    });

    async function handleSignUp(data: SignUpForm) {
        const result = await authClient.signUp.email({ ...data, callbackURL: "/"}, {
            onError: (error) => {
                toast.error(error.error.message || "Failed to sign up");
            }
        })

        if (result.error == null && !result.data.user.emailVerified) {
            openVerificationEmailTab(data.email)
        }
    }
    return (
        <form onSubmit={handleSubmit(handleSignUp)} className="space-y-6">
            <FieldSet>
                <FieldGroup>
                    {/* name */}
                    <Field>
                        <FieldLabel>Name</FieldLabel>
                        <FieldContent>
                            <Input placeholder="Enter your name" {...register("name")} />
                        </FieldContent>

                        {errors.name && <FieldError>{errors.name.message}</FieldError>}
                    </Field>

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
                    Sign Up
                </LoadingSwap>
            </Button>
        </form>
    );
}