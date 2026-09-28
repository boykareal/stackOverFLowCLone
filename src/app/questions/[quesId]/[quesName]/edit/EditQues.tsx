"use client";

import QuestionForm from "@/components/QuestionForm";
import { databases } from "@/models/client/config";
import { db, questionCollection } from "@/models/name";
import { Question } from "@/models/questionInterdace";
import { userAuthStore } from "@/store/Auth";
import slugify from "@/utils/slugify";
import { useParams, useRouter } from "next/navigation";
import React from "react";

export default function EditQues() {
  const { quesId } = useParams<{ quesId: string }>();
  const { hydrated, user, verifySession } = userAuthStore();
  const router = useRouter();
  const [question, setQuestion] = React.useState<Question | null>(null);
  const [error, setError] = React.useState("");
  const [isCheckingSession, setIsCheckingSession] = React.useState(true);

  React.useEffect(() => {
    if (!hydrated) return;

    void verifySession().finally(() => setIsCheckingSession(false));
  }, [hydrated, verifySession]);

  React.useEffect(() => {
    if (!user || !quesId) return;

    void databases
      .getDocument(db, questionCollection, quesId)
      .then((document) => setQuestion(document as unknown as Question))
      .catch(() => setError("This question could not be loaded."));
  }, [quesId, user]);

  React.useEffect(() => {
    if (!isCheckingSession && !user) {
      router.replace("/login");
      return;
    }

    if (question && user && question.authorId !== user.$id) {
      router.replace(`/questions/${question.$id}/${slugify(question.title)}`);
    }
  }, [isCheckingSession, question, router, user]);

  if (!hydrated || isCheckingSession || !user) {
    return null;
  }

  if (error) {
    return (
      <main className="container mx-auto px-4 pb-20 pt-32">
        <p className="text-red-400">{error}</p>
      </main>
    );
  }

  if (!question || question.authorId !== user.$id) {
    return null;
  }

  return (
    <main className="container mx-auto px-4 pb-20 pt-32">
      <h1 className="mb-10 text-2xl font-bold">Edit your question</h1>
      <div className="max-w-3xl">
        <QuestionForm question={question} />
      </div>
    </main>
  );
}
