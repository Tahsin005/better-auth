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
import { PasswordInput } from "@/components/ui/password-input";
import { LoadingSwap } from "@/components/ui/loading-swap";
import { authClient } from "@/lib/auth/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { NumberInput } from "@/components/ui/number-input";
import { Checkbox } from "@/components/ui/checkbox";

const changePasswordSchema = z.object({
    currentPassword: z.string().min(1),
    newPassword: z.string().min(6),
    revokeOtherSessions: z.boolean(),
})

type ChangePasswordForm = z.infer<typeof changePasswordSchema>;

export function ChangePasswordForm(){
    const {
        register,
        handleSubmit,
        reset,
        control,
        formState: { errors, isSubmitting },
    } = useForm<ChangePasswordForm>({
        resolver: zodResolver(changePasswordSchema),
        defaultValues: {
            currentPassword: "",
            newPassword: "",
            revokeOtherSessions: true,
        },
    });

    async function handleChangePassword(data: ChangePasswordForm) {
        
        await authClient.changePassword(data, {
            onError: error => {
                toast.error(error.error.message || "Failed to change password")
            },
            onSuccess: () => {
                toast.success("Password changed successfully")
                reset();
            },
        })
    }
    return (
        <form onSubmit={handleSubmit(handleChangePassword)} className="space-y-6">
            <FieldSet>
                <FieldGroup>
                    {/* password */}
                    <Field>
                        <FieldLabel>Current Password</FieldLabel>
                        <FieldContent>
                            <PasswordInput
                                placeholder="Enter your password"
                                {...register("currentPassword")}
                            />
                        </FieldContent>

                        {errors.currentPassword && <FieldError>{errors.currentPassword.message}</FieldError>}
                    </Field>

                    {/* new password */}
                    <Field>
                        <FieldLabel>New Password</FieldLabel>
                        <FieldContent>
                            <PasswordInput
                                placeholder="Enter your new password"
                                {...register("newPassword")}
                            />
                        </FieldContent>

                        {errors.newPassword && <FieldError>{errors.newPassword.message}</FieldError>}
                    </Field>

                    {/* revoke other sessions */}
                    <Field>
                        <FieldLabel>Revoke Other Sessions</FieldLabel>
                        <FieldContent>
                            <Controller
                                name="revokeOtherSessions"
                                control={control}
                                render={({ field }) => (
                                    <Checkbox
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                )}
                            />
                        </FieldContent>
                    </Field>
                </FieldGroup>
            </FieldSet>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
                <LoadingSwap isLoading={isSubmitting}>
                    Change Password
                </LoadingSwap>
            </Button>
        </form>
    );
}