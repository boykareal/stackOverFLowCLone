"use client";

import QuestionForm from "@/components/QuestionForm";
import { userAuthStore } from "@/store/Auth";
import { useRouter } from "next/navigation";
import React from "react";

export default function AskQuestionPage() {
  const { hydrated, user, verifySession } = userAuthStore();
  const router = useRouter();
  const [isCheckingSession, setIsCheckingSession] = React.useState(true);

  React.useEffect(() => {
    if (!hydrated) return;

    void verifySession().finally(() => setIsCheckingSession(false));
  }, [hydrated, verifySession]);

  React.useEffect(() => {
    if (!isCheckingSession && !user) {
      router.replace("/login");
    }
  }, [isCheckingSession, router, user]);

  if (!hydrated || isCheckingSession || !user) {
    return null;
  }

  return (
    <main className="container mx-auto px-4 pb-20 pt-32">
      <div className="max-w-3xl rounded-2xl border border-slate-800 bg-slate-950/60 p-6 shadow-2xl shadow-black/20 sm:p-8">
      <h1 className="mb-3 text-3xl font-bold text-slate-50">Ask a public question</h1>
      <p className="mb-10 max-w-2xl text-sm leading-6 text-slate-400">
        Share enough detail for other developers to understand and answer your
        question.
      </p>
      <div>
        <QuestionForm />
      </div>
      </div>
    </main>
  );
}
