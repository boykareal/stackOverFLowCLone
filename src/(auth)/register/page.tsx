"use client"
import { userAuthStore } from "@/store/Auth";
import React from "react";

function RegisterPage() {
    const {createAccount, login} = userAuthStore();
    const [isLoading, setIsLoading] = React.useState(false)
    const [error, setError] = React.useState("")

    const handleSubmit  = async(e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault()

        const formData = new FormData(e.currentTarget)
        const firstName = formData.get("firstname")
        const lastName = formData.get("lastname")
        const email = formData.get("email")
        const password = formData.get("password")

        if(!firstName || !lastName || !email || !password){
            setError(() => "Please fill out all the fields")
            return
        }

        setIsLoading(true)
        setError("")

        const response = await createAccount(
            `${firstName} ${lastName}`,
            email?.toString(),
            password?.toString()
        )

        if(response.error){
            setError(() => response.error!.message)
        }else{
            const loginresponse = await login(email.toString(),password.toString())
            if(loginresponse.error){
                setError(() => loginresponse.error!.message)
            }
        }

        setIsLoading(() => false)

        
    }
    return (
        <div>
            {error && (
                <p>{error}</p>
            )}

            <form onSubmit={handleSubmit}>

            </form>
            </div>
    )
}