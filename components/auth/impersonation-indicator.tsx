"use client"

import { authClient } from "@/lib/auth/auth-client"
import { ShieldAlert, UserX } from "lucide-react"
import { useRouter } from "next/navigation"
import { BetterAuthActionButton } from "./better-auth-action-buttion"

export function ImpersonationIndicator() {
    const router = useRouter()
    const { data: session, refetch } = authClient.useSession()

    if (!session?.session.impersonatedBy) return null

    return (
        <div className="fixed bottom-4 right-4 z-50">
            <div className="flex items-center gap-3 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 shadow-lg backdrop-blur-md">
                <div className="flex items-center gap-2 text-red-500">
                    <ShieldAlert className="h-5 w-5" />
                    <div className="leading-tight">
                        <p className="text-xs font-semibold uppercase tracking-wide">
                            Impersonation Active
                        </p>
                        <p className="text-[11px] text-red-400/80">
                            You are acting as another user
                        </p>
                    </div>
                </div>

                <BetterAuthActionButton
                    action={() =>
                        authClient.admin.stopImpersonating(undefined, {
                            onSuccess: () => {
                                router.push("/admin")
                                refetch()
                            },
                        })
                    }
                    variant="destructive"
                    size="sm"
                    className="rounded-xl px-3 py-2"
                >
                    <UserX className="h-4 w-4 mr-2" />
                    Exit
                </BetterAuthActionButton>
            </div>
        </div>
    )
}