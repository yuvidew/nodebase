
import { Button } from "@/components/ui/button";
import { WorkflowIcon } from "lucide-react";
// import { ModeToggle } from "@/components/ModeToggle";

export default function AuthLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    
    return (
        <div className="bg-muted relative  flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
            <div className=" absolute top-3 w-full px-4 flex items-center justify-between">
                <Button size={"icon-sm"}>
                    <WorkflowIcon />
                </Button>
            </div>
            <div className="w-full max-w-sm md:max-w-3xl">
                {children}
            </div>
        </div>
    )
}