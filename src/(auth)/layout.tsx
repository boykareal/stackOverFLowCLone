"use client";
import { userAuthStore } from "@/store/Auth"
import { useRouter } from "next/router";
import React from "react";

const Layout = ({children} : {children: React.ReactNode}) => {
    const {session} = userAuthStore();
    const router = useRouter()

    React.useEffect(() => {
        if(session){
            router.push("/")
        }
    },[session, router])

    if(session) {
        return null
    }

    return (
        <div className="">
            <div className="">{children}</div>
        </div>
    )
}

export default Layout