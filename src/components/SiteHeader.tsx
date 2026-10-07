"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { userAuthStore } from "@/store/Auth";
import slugify from "@/utils/slugify";
import React from "react";

export default function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, session, hydrated, logout, verifySession } = userAuthStore();
  const profileHref = user ? `/users/${user.$id}/${slugify(user.name || "user")}` : "/login";

  React.useEffect(() => {
    if (hydrated) void verifySession();
  }, [hydrated, verifySession]);

  async function handleLogout() {
    await logout();
    router.push("/login");
  }

  const linkClass = (href: string) =>
    `rounded-md px-3 py-2 text-sm transition hover:bg-white/10 ${pathname === href ? "text-orange-400" : "text-slate-300"}`;

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-slate-950/90 backdrop-blur">
      <nav className="container mx-auto flex min-h-16 items-center justify-between gap-4 px-4" aria-label="Main navigation">
        <Link href="/questions" className="shrink-0 text-lg font-bold text-white">
          <span className="text-orange-500">Stack</span> Overflow
        </Link>
        <div className="flex items-center gap-1">
          <Link href="/questions" className={linkClass("/questions")}>Home</Link>
          <Link href="/questions" className={linkClass("/questions")}>Questions</Link>
          <Link href="/questions/ask" className={linkClass("/questions/ask")}>Ask</Link>
          {hydrated && session ? (
            <>
              <Link href={profileHref} className={linkClass(profileHref)}>Profile</Link>
              <button onClick={handleLogout} className="rounded-md px-3 py-2 text-sm text-slate-300 hover:bg-white/10">Log out</button>
            </>
          ) : (
            <Link href="/login" className="ml-1 rounded-md bg-orange-500 px-3 py-2 text-sm font-semibold text-white hover:bg-orange-400">Log in</Link>
          )}
        </div>
      </nav>
    </header>
  );
}
