"use client";

import Link from "next/link";
import React from "react";
import { useRouter } from "next/navigation";
import { userAuthStore } from "@/store/Auth";
import { account } from "@/models/client/config";

export default function OAuthCallbackPage() {
  const router = useRouter();
  const { hydrated, verifySession } = userAuthStore();
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    if (!hydrated) return;

    let active = true;
    void (async () => {
      const params = new URLSearchParams(window.location.search);
      const userId = params.get("userId");
      const secret = params.get("secret");
      const oauthError = params.get("error");
      window.history.replaceState({}, "", window.location.pathname);

      try {
        if (oauthError) throw new Error("The identity provider could not complete sign-in.");
        if (!userId || !secret) throw new Error("The OAuth callback did not include the session credentials.");

        await account.createSession(userId, secret);
        const sessionError = await verifySession();
        if (!active) return;

        if (userAuthStore.getState().user) {
          router.replace("/questions");
        } else {
          setError(sessionError
            ? `Appwrite could not create an active session: ${sessionError}`
            : "Appwrite did not return an active session. Please try signing in again.");
        }
      } catch (callbackError) {
        if (active) {
          setError(callbackError instanceof Error ? callbackError.message : "OAuth sign-in failed.");
        }
      }
    })();

    return () => {
      active = false;
    };
  }, [hydrated, router, verifySession]);

  return (
    <div className="container mx-auto flex min-h-[50vh] items-center justify-center px-4 text-center">
      <div className="max-w-md rounded-2xl border border-slate-800 bg-slate-950 p-8">
        {error ? (
          <>
            <h1 className="text-xl font-semibold text-white">Sign-in could not be completed</h1>
            <p className="mt-3 text-sm text-slate-300">{error}</p>
            <Link href="/login" className="mt-6 inline-block rounded-md bg-orange-500 px-4 py-2 text-sm font-semibold text-white hover:bg-orange-400">
              Return to login
            </Link>
          </>
        ) : (
          <p className="text-slate-200" role="status">Finishing sign-in…</p>
        )}
      </div>
    </div>
  );
}
