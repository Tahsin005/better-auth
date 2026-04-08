
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
import { authClient } from "@/lib/auth/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const backupCodeSchema = z.object({
    code: z.string().length(6),
});

type BackupCodeForm = z.infer<typeof backupCodeSchema>
export function BackupCodeTab() {
    const router = useRouter();
    const {
        register: backupCode,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<BackupCodeForm>({
        resolver: zodResolver(backupCodeSchema),
        defaultValues: {
            code: "",
        },
    });

    async function handleBackupCodeVerification(data: BackupCodeForm) {
        await authClient.twoFactor.verifyBackupCode(data, {
            onError: error => {
                toast.error(error.error.message || "Failed to verify code")
            },
            onSuccess: () => {
                router.push("/")
            },
        })
    }
    
    return (
        <form onSubmit={handleSubmit(handleBackupCodeVerification)} className="space-y-6">
            <FieldSet>
                <FieldGroup>
                    {/* code */}
                    <Field>
                        <FieldLabel>Code</FieldLabel>
                        <FieldContent>
                            <Input
                                type="text"
                                placeholder="Enter your code"
                                {...backupCode("code")}
                            />
                        </FieldContent>

                        {errors.code && <FieldError>{errors.code.message}</FieldError>}
                    </Field>
                </FieldGroup>
            </FieldSet>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
                <LoadingSwap isLoading={isSubmitting}>
                    Verify
                </LoadingSwap>
            </Button>
        </form>
    );
}