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
import { useState } from "react";
import QRCode from "react-qr-code";

const twoFactorAuthSchema = z.object({
    password: z.string().min(1),
})

type TwoFactorAuthForm = z.infer<typeof twoFactorAuthSchema>
type TwoFactorData = {
    totpURI: string
    backupCodes: string[]
}

export function TwoFactorAuth({ isEnabled }: { isEnabled: boolean }) {
    const [twoFactorData, setTwoFactorData] = useState<TwoFactorData | null>(null)
    const router = useRouter();
    const {
        register: twoFactorAuth,
        handleSubmit,
        reset,
        control,
        formState: { errors, isSubmitting },
    } = useForm<TwoFactorAuthForm>({
        resolver: zodResolver(twoFactorAuthSchema),
        defaultValues: {
            password: "",
        },
    });

    async function handleDisableTwoFactorAuth(data: TwoFactorAuthForm) {
            await authClient.twoFactor.disable(
                {
                    password: data.password,
                },
                {
                    onError: error => {
                        toast.error(error.error.message || "Failed to disable 2FA")
                    },
                    onSuccess: () => {
                        reset()
                        router.refresh()
                    },
                }
            )
    }

    async function handleEnableTwoFactorAuth(data: TwoFactorAuthForm) {
        const result = await authClient.twoFactor.enable({
            password: data.password,
        })

        if (result.error) {
            toast.error(result.error.message || "Failed to enable 2FA")
        } 
        {
            setTwoFactorData(result.data)
            reset()
        }
    }

    if (twoFactorData != null) {
        return (
            <QRCodeVerify
                {...twoFactorData}
                onDone={() => {
                    setTwoFactorData(null)
                }}
            />
        )
    }

    return (
        <form onSubmit={handleSubmit(isEnabled ? handleDisableTwoFactorAuth : handleEnableTwoFactorAuth)} className="space-y-6">
            <FieldSet>
                <FieldGroup>
                    {/* password */}
                    <Field>
                        <FieldLabel>Password</FieldLabel>
                        <FieldContent>
                            <PasswordInput
                                placeholder="Enter your password"
                                {...twoFactorAuth("password")}
                            />
                        </FieldContent>

                        {errors.password && <FieldError>{errors.password.message}</FieldError>}
                    </Field>
                </FieldGroup>
            </FieldSet>

            <Button variant={isEnabled ? "destructive" : "default"} type="submit" className="w-full" disabled={isSubmitting}>
                <LoadingSwap isLoading={isSubmitting}>
                    {isEnabled ? "Disable 2FA" : "Enable 2FA"}
                </LoadingSwap>
            </Button>
        </form>
    );
}

const qrSchema = z.object({
    token: z.string().length(6),
})

type QrForm = z.infer<typeof qrSchema>

function QRCodeVerify({
    totpURI,
    backupCodes,
    onDone,
}: TwoFactorData & { onDone: () => void }) {
    const router = useRouter();
    const [successfullyEnabled, setSuccessfullyEnabled] = useState(false)
    const {
        register: qrinfo,
        handleSubmit,
        reset,
        control,
        formState: { errors, isSubmitting },
    } = useForm<QrForm>({
        resolver: zodResolver(qrSchema),
        defaultValues: {
            token: "",
        },
    });

    async function handleQrCode(data: QrForm) {
        await authClient.twoFactor.verifyTotp(
            {
                code: data.token,
            },
            {
                onError: error => {
                    toast.error(error.error.message || "Failed to verify code")
                },
                onSuccess: () => {
                    setSuccessfullyEnabled(true)
                    router.refresh()
                },
            }
        )
    }

    if (successfullyEnabled) {
        return (
            <>
                <p className="text-sm text-muted-foreground mb-2">
                    Save these backup codes in a safe place. You can use them to access
                your account.
                </p>
                <div className="grid grid-cols-2 gap-2 mb-4">
                    {backupCodes.map((code, index) => (
                        <div key={index} className="font-mono text-sm">
                        {code}
                        </div>
                    ))}
                </div>
                <Button variant="outline" onClick={onDone}>
                    Done
                </Button>
            </>
        )
    }


    return (
        <div className="space-y-4">
            <p className="text-muted-foreground">
                Scan this QR code with your authenticator app and enter the code below:
            </p>
            <form onSubmit={handleSubmit(handleQrCode)} className="space-y-6">
                <FieldSet>
                    <FieldGroup>
                        {/* token */}
                        <Field>
                            <FieldLabel>Verification Code</FieldLabel>
                            <FieldContent>
                                <Input
                                    placeholder="Enter your password"
                                    {...qrinfo("token")}
                                />
                            </FieldContent>
                            {errors.token && <FieldError>{errors.token.message}</FieldError>}
                        </Field>
                    </FieldGroup>
                </FieldSet>
                <Button type="submit" disabled={isSubmitting} className="w-full">
                    <LoadingSwap isLoading={isSubmitting}>Submit Code</LoadingSwap>
                </Button>
            </form>

            <div className="p-4 bg-white w-fit">
                <QRCode size={256} value={totpURI} />
            </div>
        </div>
    );
}