"use client";
import { userAuthStore } from "@/store/Auth"
import { useRouter } from "next/navigation";
import { BackgroundBeams } from "@/components/ui/background-beams";
import React from "react";

const Layout = ({children} : {children: React.ReactNode}) => {
    const {session, hydrated, verifySession} = userAuthStore();
    const router = useRouter()
    const [isCheckingSession, setIsCheckingSession] = React.useState(true);

    React.useEffect(() => {
        if (!hydrated) return;

        void verifySession().finally(() => setIsCheckingSession(false));
    }, [hydrated, verifySession]);

    React.useEffect(() => {
        if (session) {
            router.replace("/questions");
        }
    },[session, router])

    if (!hydrated || isCheckingSession || session) {
        return null
    }

    return (
      <div className="relative flex min-h-screen flex-col items-center justify-center py-12">
        <BackgroundBeams />
        <div className="relative">{children}</div>
      </div>
    );
}

export default Layout
