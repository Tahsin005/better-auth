"use client"

import { BetterAuthActionButton } from "@/components/auth/better-auth-action-buttion";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Field, FieldContent, FieldError, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { LoadingSwap } from "@/components/ui/loading-swap";
import { authClient } from "@/lib/auth/auth-client";
import { Passkey } from "@better-auth/passkey";
import { zodResolver } from "@hookform/resolvers/zod";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const passkeySchema = z.object({
    name: z.string().min(1),
})

type PasskeyForm = z.infer<typeof passkeySchema>

export function PasskeyManagement({ passkeys }: { passkeys: Passkey[] }) {
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const router = useRouter()
    const {
        register: passkey,
        reset,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<PasskeyForm>({
        resolver: zodResolver(passkeySchema),
        defaultValues: {
            name: "",
        },
    });

    async function handleAddPasskey(data: PasskeyForm) {
        await authClient.passkey.addPasskey(data, {
            onError: error => {
                toast.error(error.error.message || "Failed to add passkey")
            },
            onSuccess: () => {
                router.refresh()
                setIsDialogOpen(false)
            }
        })
    }

    function handleDeletePasskey(passkeyId: string) {
        return authClient.passkey.deletePasskey(
            { 
                id: passkeyId 
            },
            { 
                onSuccess: () => router.refresh() 
            }
        )
    }

    return (
        <div className="space-y-6">
            {passkeys.length === 0 ? (
                <Card>
                    <CardHeader>
                        <CardTitle>No passkeys yet</CardTitle>
                        <CardDescription>
                            Add your first passkey for secure, passwordless authentication.
                        </CardDescription>
                    </CardHeader>
                </Card>
            ): (
                <div className="space-y-4">
                    {passkeys.map(passkey => (
                        <Card key={passkey.id}>
                            <CardHeader className="flex gap-2 items-center justify-between">
                                <div className="space-y-1">
                                    <CardTitle>{passkey.name}</CardTitle>
                                    <CardDescription>
                                        Created {new Date(passkey.createdAt).toLocaleDateString()}
                                    </CardDescription>
                                </div>
                                <BetterAuthActionButton
                                    requireAreYouSure
                                    variant="destructive"
                                    size="icon"
                                    action={() => handleDeletePasskey(passkey.id)}
                                >
                                    <Trash2 />
                                </BetterAuthActionButton>
                            </CardHeader>
                    </Card>
                    ))}
                </div>
            )}

            <Dialog
                open={isDialogOpen}
                onOpenChange={o => {
                    if (o) reset()
                    setIsDialogOpen(o)
                }}
            >
                <DialogTrigger asChild>
                    <Button>New Passkey</Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add New Passkey</DialogTitle>
                        <DialogDescription>
                        Create a new passkey for secure, passwordless authentication.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit(handleAddPasskey)} className="space-y-6">
                        <FieldSet>
                            <FieldGroup>
                                {/* name */}
                                <Field>
                                    <FieldLabel>Code</FieldLabel>
                                    <FieldContent>
                                        <Input
                                            type="text"
                                            placeholder="Enter your passkey"
                                            {...passkey("name")}
                                        />
                                    </FieldContent>

                                    {errors.name && <FieldError>{errors.name.message}</FieldError>}
                                </Field>
                            </FieldGroup>
                        </FieldSet>

                        <Button type="submit" className="w-full" disabled={isSubmitting}>
                            <LoadingSwap isLoading={isSubmitting}>
                                Add
                            </LoadingSwap>
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}