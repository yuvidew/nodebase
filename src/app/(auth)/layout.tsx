
import { Logo } from "@/components/logo";

export default function AuthLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    
    return (
        <div className="bg-muted relative  flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
            <div className=" absolute top-3 w-full px-4 flex items-center justify-between">
                <Logo/>
            </div>
            <div className="w-full max-w-sm ">
                {children}
            </div>
        </div>
    )
}