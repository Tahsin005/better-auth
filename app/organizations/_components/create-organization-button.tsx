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

const createOrganizationSchema = z.object({
    name: z.string().min(1),
});

type CreateOrganizationForm = z.infer<typeof createOrganizationSchema>;

export function CreateOrganizationButton() {
    const [open, setOpen] = useState(false)
    const router = useRouter();
    const {
        register: organizationCreateForm,
        reset,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<CreateOrganizationForm>({
        resolver: zodResolver(createOrganizationSchema),
        defaultValues: {
            name: "",
        },
    });

    async function handleCreateOrganization(data: CreateOrganizationForm) {
        const slug = data.name
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
        const res = await authClient.organization.create({
            name: data.name,
            slug,
        })

        if (res.error) {
            toast.error(res.error.message || "Failed to create organization")
        } else {
            reset()
            setOpen(false)
            await authClient.organization.setActive({ organizationId: res.data.id })
        }
    }
    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>Create Organization</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create New Organization</DialogTitle>
                    <DialogDescription>
                        Create a new organization to collaborate with your team.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit(handleCreateOrganization)} className="space-y-6">
                    <FieldSet>
                        <FieldGroup>
                            {/* name */}
                            <Field>
                                <FieldLabel>Name</FieldLabel>
                                <FieldContent>
                                    <Input
                                        type="text"
                                        placeholder="Enter organization name"
                                        {...organizationCreateForm("name")}
                                    />
                                </FieldContent>
                                {errors.name && <FieldError>{errors.name.message}</FieldError>}
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
                                Create Organization
                            </LoadingSwap>
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}