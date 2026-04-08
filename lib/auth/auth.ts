import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/drizzle/db";
import { nextCookies } from "better-auth/next-js";
import { sendEmailVerificationEmail } from "../emails/email-verification";
import { sendPasswordResetEmail } from "../emails/password-reset-emai";
import { createAuthMiddleware } from "better-auth/api";
import { sendWelcomeEmail } from "../emails/welcome-email";
import { sendDeleteAccountVerificationEmail } from "../emails/delete-account-verification";
import { twoFactor, admin as adminPlugin, organization } from "better-auth/plugins";
import { passkey } from "@better-auth/passkey"
import { ac, admin, user } from "@/components/auth/permissions"
import { sendOrganizationInviteEmail } from "../emails/organization-invite-email";

export const auth = betterAuth({
    appName: "Better Auth Implementation",
    user: {
        changeEmail: {
            enabled: true,
            sendChangeEmailVerification: async ({ user, url, newEmail }: {
                user: {
                    name: string;
                    email: string;
                },
                url: string;
                newEmail: string;
            }) => {
                await sendEmailVerificationEmail({
                    user: { ...user, email: newEmail },
                    url,
                })
            },
        },
        deleteUser: {
            enabled: true,
            sendDeleteAccountVerification: async ({ user, url }) => {
                await sendDeleteAccountVerificationEmail({ user, url })
            }
        },
        additionalFields: {
            favoriteNumber: {
                type: "number",
                required: true,
            }
        }
    },
    emailAndPassword: {
        enabled: true,
        requireEmailVerification: true,
        sendResetPassword: async ({ user, url }) => {
            await sendPasswordResetEmail({ user, url });
        }
    },
    emailVerification: {
        autoSignInAfterVerification: true,
        sendOnSignUp: true,
        sendVerificationEmail: async ({ user, url }) => {
            await sendEmailVerificationEmail({ user, url });
        }
    },
    socialProviders: {
        github: {
            clientId: process.env.GITHUB_CLIENT_ID!,
            clientSecret: process.env.GITHUB_CLIENT_SECRET!,
            mapProfileToUser: (profile) => {
                return {
                    favoriteNumber: Number(profile.public_repos) || 0
                }
            }
        },
        discord: {
            clientId: process.env.DISCORD_CLIENT_ID!,
            clientSecret: process.env.DISCORD_CLIENT_SECRET!,
            mapProfileToUser: () => {
                return {
                    favoriteNumber: 0
                }
            }
        }
    },
    session: {
        cookieCache: {
            enabled: true,
            maxAge: 60 * 5, // 5 minutes
        }
    },
    plugins: [nextCookies(), twoFactor(), passkey(), adminPlugin({
        ac,
        roles: {
            admin,
            user,
        }
    }), organization({
        sendInvitationEmail: async ({
            email,
            organization,
            inviter,
            invitation
        }) => {
            await sendOrganizationInviteEmail({
                invitation,
                inviter: inviter.user,
                organization,
                email,
            })
        }
    })],
    database: drizzleAdapter(db, {
        provider: "pg"
    }),
    hooks: {
        after: createAuthMiddleware(async ctx => {
            if (ctx.path.startsWith("/sign-up")) {
                const user = ctx.context.newSession?.user ?? {
                    name: ctx.body.name,
                    email: ctx.body.email,
                }

                if (user != null) {
                    await sendWelcomeEmail(user)
                }
            }
        })
    }
});