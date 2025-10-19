import { SignUpForm } from "@/features/auth/_components/sign-up-form";
import { requireUnAuth } from "@/lib/auth-utils";




const SignUpPage = async() => {
    await requireUnAuth()
    return (
        <SignUpForm/>
    )
}

export default SignUpPage;