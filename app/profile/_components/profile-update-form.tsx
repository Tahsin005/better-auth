"use client";

import { Controller, useForm } from "react-hook-form";
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
import { authClient } from "@/lib/auth/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { NumberInput } from "@/components/ui/number-input";

const profileUpdateSchema = z.object({
    name: z.string().min(1),
    email: z.email().min(1),
    favoriteNumber: z.number().int(),
});

type ProfileUpdateForm = z.infer<typeof profileUpdateSchema>;

export function ProfileUpdateForm({
    user,
}: {    
    user: {
        name: string;
        email: string;
        favoriteNumber: number;
    }
}) {
    const router = useRouter();
    const {
        register,
        handleSubmit,
        control,
        formState: { errors, isSubmitting },
    } = useForm<ProfileUpdateForm>({
        resolver: zodResolver(profileUpdateSchema),
        defaultValues: {
            name: user.name,
            email: user.email,
            favoriteNumber: user.favoriteNumber,
        },
    });

    async function handleProfileUpdate(data: ProfileUpdateForm) {
        const promises = [
            authClient.updateUser({
                name: data.name,
                favoriteNumber: data.favoriteNumber,
            })
        ]

        if (data.email !== user.email) {
            promises.push(
                authClient.changeEmail({
                    newEmail: data.email,
                    callbackURL: "/profile",
                })
            )
        }

        const res = await Promise.all(promises)

        const updateUserResult = res[0]
        const emailResult = res[1] ?? { error: false }

        if (updateUserResult.error) {
            toast.error(updateUserResult.error.message || "Failed to update profile")
        } else if (emailResult.error) {
            toast.error(emailResult.error.message || "Failed to change email")
        } else {
            if (data.email !== user.email) {
                toast.success("Verify your new email address to complete the change.")
            } else {
                toast.success("Profile updated successfully")
            }
            router.refresh()
        }
    }
    return (
        <form onSubmit={handleSubmit(handleProfileUpdate)} className="space-y-6">
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

                    {/* favorite number */}
                    <Field>
                        <FieldLabel>Favorite Number</FieldLabel>
                        <FieldContent>
                            <Controller
                                name="favoriteNumber"
                                control={control}
                                render={({ field }) => (
                                    <NumberInput
                                        placeholder="Enter your favorite number"
                                        value={field.value}
                                        onChange={field.onChange}
                                    />
                                )}
                            />
                        </FieldContent>

                        {errors.favoriteNumber && <FieldError>{errors.favoriteNumber.message}</FieldError>}
                    </Field>
                </FieldGroup>
            </FieldSet>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
                <LoadingSwap isLoading={isSubmitting}>
                    Update Profile
                </LoadingSwap>
            </Button>
        </form>
    );
}