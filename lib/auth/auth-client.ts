import { inferAdditionalFields, twoFactorClient } from "better-auth/client/plugins";
import { passkeyClient } from "@better-auth/passkey/client";
import { createAuthClient } from "better-auth/react";
import { auth } from "./auth";

export const authClient = createAuthClient({
    plugins: [
        inferAdditionalFields<typeof auth>(),
        passkeyClient(),
        twoFactorClient({
            onTwoFactorRedirect: () => {
                window.location.href = "/auth/2fa"
            },
        }),
    ],
})
