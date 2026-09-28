"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { account } from "@/models/client/config";
import { UserPrefs, userAuthStore } from "@/store/Auth";
import slugify from "@/utils/slugify";
import { useParams, useRouter } from "next/navigation";
import React from "react";

export default function EditProfilePage() {
  const { userId } = useParams<{ userId: string }>();
  const { hydrated, user, verifySession } = userAuthStore();
  const router = useRouter();
  const [isCheckingSession, setIsCheckingSession] = React.useState(true);
  const [name, setName] = React.useState("");
  const [error, setError] = React.useState("");
  const [isSaving, setIsSaving] = React.useState(false);

  React.useEffect(() => {
    if (!hydrated) return;

    void verifySession().finally(() => setIsCheckingSession(false));
  }, [hydrated, verifySession]);

  React.useEffect(() => {
    if (!isCheckingSession && !user) {
      router.replace("/login");
      return;
    }

    if (user && user.$id !== userId) {
      router.replace(`/users/${user.$id}/${slugify(user.name)}`);
      return;
    }

    if (user) setName(user.name);
  }, [isCheckingSession, router, user, userId]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedName = name.trim();

    if (!trimmedName) {
      setError("Display name is required.");
      return;
    }

    setIsSaving(true);
    setError("");

    try {
      await account.updateName(trimmedName);
      const updatedUser = await account.get<UserPrefs>();
      userAuthStore.setState({ user: updatedUser });
      router.replace(`/users/${updatedUser.$id}/${slugify(updatedUser.name)}`);
      router.refresh();
    } catch (caughtError: unknown) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Unable to update your profile.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (!hydrated || isCheckingSession || !user || user.$id !== userId) {
    return null;
  }

  return (
    <main className="w-full max-w-2xl">
      <h2 className="text-2xl font-bold">Edit profile</h2>
      <p className="mt-2 text-sm text-white/70">
        Update the name other community members see on your questions and
        answers.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        {error ? <p className="text-sm text-red-400">{error}</p> : null}

        <div className="space-y-2">
          <Label htmlFor="display-name">Display name</Label>
          <Input
            id="display-name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            maxLength={128}
            autoComplete="name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email address</Label>
          <Input id="email" value={user.email} disabled readOnly />
          <p className="text-xs text-white/60">
            Email changes require Appwrite password verification and are not
            available from this profile form.
          </p>
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="rounded-md bg-orange-500 px-5 py-2 font-medium text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSaving ? "Saving…" : "Save profile"}
        </button>
      </form>
    </main>
  );
}
