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
import { authClient } from "@/lib/auth/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useState } from "react";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

const createInviteSchema = z.object({
    email: z.email().min(1).trim(),
    role: z.enum(["member", "admin"]),
})

type CreateInviteForm = z.infer<typeof createInviteSchema>;

export function CreateInviteButton() {
    const [open, setOpen] = useState(false)
    const router = useRouter();
    const {
        register: inviteCreateForm,
        reset,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<CreateInviteForm>({
        resolver: zodResolver(createInviteSchema),
        defaultValues: {
            email: "",
            role: "member",
        },
    });

    
    async function handleCreateInvite(data: CreateInviteForm) {
        await authClient.organization.inviteMember(data, {
            onError: error => {
                toast.error(error.error.message || "Failed to invite user")
            },
            onSuccess: () => {
                reset()
                setOpen(false)
            },
        })
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>Invite User</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Invite User</DialogTitle>
                    <DialogDescription>
                        Invite a user to collaborate with your team.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(handleCreateInvite)} className="space-y-6">
                    <FieldSet>
                        <FieldGroup>
                            {/* email */}
                            <Field>
                                <FieldLabel>Name</FieldLabel>
                                <FieldContent>
                                    <Input
                                        type="email"
                                        placeholder="Enter the user's email address"
                                        {...inviteCreateForm("email")}
                                    />
                                </FieldContent>
                                {errors.email && <FieldError>{errors.email.message}</FieldError>}
                            </Field>

                            {/* role */}
                            <Field>
                                <FieldLabel>Role</FieldLabel>
                                <FieldContent>
                                    <Select defaultValue="member" {...inviteCreateForm("role")}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a role" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="member">Member</SelectItem>
                                            <SelectItem value="admin">Admin</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </FieldContent>
                                {errors.role && <FieldError>{errors.role.message}</FieldError>}
                            </Field>
                        </FieldGroup>
                    </FieldSet>
                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => setOpen(false)}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            <LoadingSwap isLoading={isSubmitting}>
                                Invite
                            </LoadingSwap>
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}