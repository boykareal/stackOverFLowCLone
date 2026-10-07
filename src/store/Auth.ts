import {create} from "zustand";
import { immer } from "zustand/middleware/immer";
import { persist } from "zustand/middleware";

import {AppwriteException, ID, Models, OAuthProvider} from "appwrite"
import { account } from "@/models/client/config";


export interface UserPrefs {
    reputation: number
}

interface IAuthStore{
    session: Models.Session | null;
    jwt: string | null;
    user: Models.User<UserPrefs> | null;
    hydrated: boolean

    setHydrated(): void;
    verifySession(): Promise<string | null>;
    login(
        email: string,
        password: string,
    ): Promise<
    {
        success: boolean; 
        error?: AppwriteException| null}>
    createAccount(
        name: string,
        email: string,
        password: string
    ): Promise<
    {
        success: boolean;
        error?: AppwriteException | null
    }>
    logout(): Promise<void>;
    startOAuth(provider: "google" | "github"): void;
}

export const userAuthStore = create<IAuthStore>()(
    persist(
        immer((set) => ({
            session: null,
            jwt: null,
            user: null,
            hydrated: false,

            setHydrated() {
                set({hydrated: true})
            },

            async verifySession(){
                try {
                    const session = await account.getSession("current");
                    const user = await account.get<UserPrefs>();
                    set({session, user});
                    return null;
                } catch (error) {
                    // Persisted browser state can outlive an Appwrite session.
                    // Clear it so protected UI never relies on an expired session.
                    set({session: null, user: null, jwt: null});
                    if (error instanceof AppwriteException) {
                        return `${error.message} (${error.code}, ${error.type})`;
                    }
                    return error instanceof Error ? error.message : "Unknown session error";
                }
            },

            async login(email: string,password: string){
                try {
                    const session = await account.createEmailPasswordSession(email,password)
                    const [user, {jwt}] = await Promise.all([
                        account.get<UserPrefs>(),
                        account.createJWT()
                    ])
                    if(!user.prefs?.reputation) await account.updatePrefs<UserPrefs>({
                        reputation: 0
                    })

                    set({session, user, jwt})

                    return {success: true}
                } catch (error) {
                    return {
                        success: false,
                        error: error instanceof AppwriteException ? error: null,
                    }
                }
            },

            startOAuth(provider) {
                const origin = window.location.origin;
                account.createOAuth2Session(
                    provider === "google" ? OAuthProvider.Google : OAuthProvider.Github,
                    `${origin}/oauth/callback`,
                    `${origin}/login?oauthError=1`,
                );
            },

            async createAccount(name:string, email:string, password:string) {
                try {
                    await account.create(ID.unique(), email, password, name)
                    return {success: true}
                } catch (error) {
                    return {
                        success: false,
                        error: error instanceof AppwriteException ? error: null,
                    } 
                }
            },
            async logout() {
                try {
                    await account.deleteSessions()
                    set({session: null, jwt: null, user: null})   
                     
                } catch {
                    set({session: null, jwt: null, user: null})
                }
            },
        })),
        {
            name: "auth",
            onRehydrateStorage(){
                return (state, error) => {
                    if(!error) state?.setHydrated()
                }
            }
            
        }
    )
)
