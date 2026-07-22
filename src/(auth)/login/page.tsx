"use client"
import { userAuthStore } from "@/store/Auth";
import React from "react";


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
    return(
        <div>LoginPage</div>
    )
}

export default Loginpage