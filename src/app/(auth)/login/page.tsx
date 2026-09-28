"use client"
import { userAuthStore } from "@/store/Auth";
import React from "react";
import {cn} from "@/lib/utils";
import Link from "next/link";
import { IconBrandGithub, IconBrandGoogle } from "@tabler/icons-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const BottomGradient = () => {
  return (
    <>
      <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
      <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
    </>
  );
};

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex w-full flex-col space-y-2", className)}>
      {children}
    </div>
  );
};



function Loginpage() {
    const {login} = userAuthStore()
    const [isLoading, setIsLoading] = React.useState(false)
    const [error, setError] = React.useState("")

    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault()

        const formData = new FormData(e.currentTarget)
        const email = formData.get("email")
        const password = formData.get("password")

        if(!email || !password){
            setError(() => "Please fill all the fields")
            return
        }

        setIsLoading(() => true)
        setError(() => "")

        const LoginResponse = await login(email.toString(), password.toString())

        if(LoginResponse.error){
            setError(() => LoginResponse.error!.message)
        }

        setIsLoading(() => false)

    }
    return (
      <div className="mx-auto w-full max-w-md rounded-none border border-slate-700 bg-slate-950 p-4 shadow-2xl shadow-black/30 md:rounded-2xl md:p-8">
        <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200">
          Login to Stack Overflow Clone
        </h2>
        <p className="mt-2 max-w-sm text-sm text-neutral-600 dark:text-neutral-300">
          Log in to ask questions, share answers, and vote on helpful content.
          <br /> If you don&apos;t have an account,{" "}
          <Link href="/register" className="text-orange-500 hover:underline">
            register
          </Link>{" "}
          to get started.
        </p>

        {error && (
          <p className="mt-8 text-center text-sm text-red-500 dark:text-red-400">
            {error}
          </p>
        )}
        <form className="my-8" onSubmit={handleSubmit}>
          <LabelInputContainer className="mb-4">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              name="email"
              placeholder="projectmayhem@fc.com"
              type="email"
            />
          </LabelInputContainer>
          <LabelInputContainer className="mb-4">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              placeholder="••••••••"
              type="password"
            />
          </LabelInputContainer>

          <button
            className="group/btn relative block h-10 w-full rounded-md bg-gradient-to-br from-black to-neutral-600 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:bg-zinc-800 dark:from-zinc-900 dark:to-zinc-900 dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
            type="submit"
            disabled={isLoading}
          >
            Log in &rarr;
            <BottomGradient />
          </button>

          <div className="my-8 h-[1px] w-full bg-gradient-to-r from-transparent via-neutral-300 to-transparent dark:via-neutral-700" />

          <div className="flex flex-col space-y-4">
            <button
              className="group/btn relative flex h-10 w-full items-center justify-start space-x-2 rounded-md border border-slate-700 bg-slate-900 px-4 font-medium text-slate-100 shadow-input"
              type="button"
              disabled={isLoading}
            >
              <IconBrandGoogle className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
              <span className="text-sm text-slate-200">
                Google
              </span>
              <BottomGradient />
            </button>
            <button
              className="group/btn relative flex h-10 w-full items-center justify-start space-x-2 rounded-md border border-slate-700 bg-slate-900 px-4 font-medium text-slate-100 shadow-input"
              type="button"
              disabled={isLoading}
            >
              <IconBrandGithub className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
              <span className="text-sm text-slate-200">
                GitHub
              </span>
              <BottomGradient />
            </button>
          </div>
        </form>
      </div>
    );
}

export default Loginpage
