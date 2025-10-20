"use client";

import React, { useState } from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import Link from "next/link";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Eye, EyeOff } from "lucide-react";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";


const SignUpSchema = z.object({
    name: z.string().min(3, { message: "Name is required" }),
    email: z.string().email("Invalid email address"),
    password: z
        .string()
        .min(6, { message: "Password must be at least 6 characters long" }),
});

type SignUpFormValue = z.infer<typeof SignUpSchema>

export const SignUpForm = ({
    className,
    ...props
}: React.ComponentProps<"div">) => {
    const router = useRouter()
    const [isEyeOpen, setIsEyeOpen] = useState(false);
    

    const form = useForm<z.infer<typeof SignUpSchema>>({
        resolver: zodResolver(SignUpSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
        },
    });

    const onSubmit = async(value : SignUpFormValue) => {
        let handledError = false;

        try {
            await authClient.signUp.email(
                {
                    name : value.name,
                    email : value.email,
                    password : value.password,
                    callbackURL : "/"
                },
                {
                    onSuccess : () => {
                        toast.success("Sign up successfully")
                        router.push("/")
                    },
                    onError : (ctx) => {
                        handledError = true;
                        toast.error(ctx.error.message)
                    }
                }
            )
        } catch (error) {
            if (!handledError) {
                const message = error instanceof Error
                    ? error.message
                    : "Something went wrong. Please try again."
                toast.error(message)
            }
        } 
    };

    const isPending = form.formState.isSubmitting;

    return (
        <div className={cn("flex flex-col gap-6", className)} {...props}>
                    <Form {...form}>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                form.handleSubmit(onSubmit)();
                            }}
                        >
                            <div className="flex flex-col gap-6">
                                <div className="flex flex-col items-center text-center">
                                    <h1 className="text-2xl font-bold">
                                        Welcome to <span className=" text-primary">Nodebase</span>
                                    </h1>
                                    <p className="text-muted-foreground text-balance">
                                        Create an account
                                    </p>
                                </div>
                                <div className="grid gap-3">
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Name</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        id="name"
                                                        type="text"
                                                        placeholder="e.g. John due"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="grid gap-3">
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Email</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        id="email"
                                                        type="email"
                                                        placeholder="m@example.com"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <div className="grid gap-3">
                                    <FormField
                                        control={form.control}
                                        name="password"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Password</FormLabel>
                                                <FormControl>
                                                    <div className=" relative ">
                                                        <Input
                                                            id="password"
                                                            type={isEyeOpen ? "text" : "password"}
                                                            placeholder={"••••••••"}
                                                            {...field}
                                                            required
                                                        />
                                                        <span onClick={() => setIsEyeOpen(!isEyeOpen)}>
                                                            {isEyeOpen ? (
                                                                <Eye className=" size-4 absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer " />
                                                            ) : (
                                                                <EyeOff className=" size-4 absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer " />
                                                            )}
                                                        </span>
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <Button 
                                    disabled={isPending} 
                                    type="submit" className="w-full">
                                    {isPending ? <Spinner  /> : "Sign up"}
                                </Button>
                                <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t ">
                                    <span className="bg-card text-muted-foreground relative z-10 px-2">
                                        Or continue with
                                    </span>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <Button variant="outline" type="button" className="w-full">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                            {" "}
                                            <path
                                                fill="currentColor"
                                                d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.21 11.39.6.11.82-.26.82-.58 0-.29-.01-1.06-.02-2.08-3.34.73-4.05-1.61-4.05-1.61-.55-1.39-1.33-1.76-1.33-1.76-1.09-.75.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.84 2.81 1.3 3.5 1 .11-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.53.12-3.18 0 0 1.01-.32 3.3 1.23.95-.27 1.97-.4 3-.4s2.05.13 3 .4c2.29-1.55 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.6-2.8 5.62-5.48 5.92.43.38.81 1.1.81 2.22 0 1.61-.02 2.92-.02 3.31 0 .32.21.7.82.58A12 12 0 0024 12c0-6.63-5.37-12-12-12z"
                                            />{" "}
                                        </svg>
                                        <span className="text-sm">Login with Github</span>
                                    </Button>
                                    <Button variant="outline" type="button" className="w-full">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                                            <path
                                                d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                                                fill="currentColor"
                                            />
                                        </svg>
                                        <span className="text-sm">Login with Google</span>
                                    </Button>
                                </div>
                                <div className="text-center text-sm">
                                    Already you have a account?{" "}
                                    <Link
                                        href="/sign-in"
                                        className="underline underline-offset-4"
                                    >
                                        Sign in
                                    </Link>
                                </div>
                            </div>
                        </form>
                    </Form>
            <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
                By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
                and <a href="#">Privacy Policy</a>.
            </div>
        </div>
    );
};
