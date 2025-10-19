import { headers} from "next/headers";
import {redirect} from "next/navigation";
import { auth } from "./auth";

// it's help to protect the routing when is the user is not sign in 
export const requireAuth = async () => {
    const session = await auth.api.getSession({
        headers : await headers()
    });

    if (!session) {
        redirect("/sign-in");
    }

    return session;
}


export const requireUnAuth = async () => {
    const session = await auth.api.getSession({
        headers : await headers()
    });

    if (session) {
        redirect("/");
    }

}