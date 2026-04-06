"use client";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SignUpTab } from "./_components/sign-up-tab";
import { SignInTab } from "./_components/sign-in-tab";
import { Separator } from "@/components/ui/separator";
import { SocialAuthButtons } from "./_components/social-auth-buttons";
import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { redirect, useRouter } from "next/navigation";
import { EmailVerification } from "./_components/email-verification";

type Tab = "signin" | "signup" | "email-verification";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [selectedTab, setSelectedTab] = useState<Tab>("signin");
    useEffect(() => {
        authClient.getSession().then((session) => {
            if (session.data != null) {
                router.push("/");
            }
        });
    }, [router]);

    function openVerificationEmailTab(email: string) {
        setEmail(email)
        setSelectedTab("email-verification")
    }

    return <Tabs value={selectedTab} onValueChange={(t) => setSelectedTab(t as Tab)} className="max-auto w-full my-6 px-4">
        {(selectedTab === "signin" || selectedTab === "signup") && (
            <TabsList>
            <TabsTrigger value="signin">Sign In</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
        )}
        <TabsContent value="signin">
            <Card>
                <CardHeader className="text-2xl font-bold">
                    <CardTitle>Sign In</CardTitle>
                </CardHeader>
                <CardContent>
                    <SignInTab openVerificationEmailTab={openVerificationEmailTab} />
                </CardContent>

                <Separator />

                <CardFooter className="grid grid-cols-2 gap-3">
                    <SocialAuthButtons />
                </CardFooter>
            </Card>
        </TabsContent>
        <TabsContent value="signup">
            <Card>
                <CardHeader className="text-2xl font-bold">
                    <CardTitle>Sign Up</CardTitle>
                </CardHeader>
                <CardContent>
                    <SignUpTab openVerificationEmailTab={openVerificationEmailTab} />
                </CardContent>

                <Separator />

                <CardFooter className="grid grid-cols-2 gap-3">
                    <SocialAuthButtons />
                </CardFooter>
            </Card>
        </TabsContent>
        <TabsContent value="email-verification">
            <Card>
                <CardHeader className="text-2xl font-bold">
                    <CardTitle>Verfiy Your Email</CardTitle>
                </CardHeader>
                <CardContent>
                    <EmailVerification email={email} />
                </CardContent>
            </Card>
        </TabsContent>
    </Tabs>
}