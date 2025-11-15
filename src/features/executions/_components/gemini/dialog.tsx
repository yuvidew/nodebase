"use client";
import React, { useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { Textarea } from "@/components/ui/textarea";

import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useCredentialByType } from "@/features/credentials/hooks/use-credentials";
import { CredentialType } from "@/generated/prisma";
import { Spinner } from "@/components/ui/spinner";
import Image from "next/image";
import { ScrollArea } from "@/components/ui/scroll-area";



const formSchema = z.object({
    variableName: z
        .string()
        .min(1, { message: "Variable name is required" })
        .regex(/^[A-Za-z_$][A-Za-z0-9_$]*$/, {
            message: "Variable name must start with a letter or underscore and contain only letters, numbers, and underscores"
        }),
    credentialId: z.string().min(1, 'Credential is required'),
    systemPrompt: z.string().optional(),
    userPrompt: z.string().min(1, "User prompt is required"),
});

export type GeminiFromValues = z.infer<typeof formSchema>;

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (values: z.infer<typeof formSchema>) => void;
    defaultValues?: Partial<GeminiFromValues>
}



export const GeminiDialog = ({
    open,
    onOpenChange,
    onSubmit,
    defaultValues
}: Props) => {
    const { data: credentials, isLoading: isLoadingCredential } = useCredentialByType(CredentialType.GEMINI);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            variableName: defaultValues?.variableName || "",
            credentialId: defaultValues?.credentialId || "",
            systemPrompt: defaultValues?.systemPrompt || "",
            userPrompt: defaultValues?.userPrompt || "",
        },
    });

    const watchVariableName = form.watch("variableName") || "myGemini";

    const handleSubmit = (values: z.infer<typeof formSchema>) => {
        onSubmit(values);
        onOpenChange(false);
    };

    // Reset form values when dialog opens with new defaults
    useEffect(() => {
        if (open) {
            form.reset({
                variableName: defaultValues?.variableName || "",
                credentialId: defaultValues?.credentialId || "",
                systemPrompt: defaultValues?.systemPrompt || "",
                userPrompt: defaultValues?.userPrompt || "",
            })
        }
    }, [open, defaultValues, form])

    return (
        <Dialog onOpenChange={onOpenChange} open={open}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Gemini Configuration</DialogTitle>
                    <DialogDescription>
                        Configure the AI model and prompt for this node.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(handleSubmit)}
                        className=" mt-4"
                    >
                        <ScrollArea className="h-96">
                            <div className="flex flex-col gap-y-8 w-[97%] m-auto p-0">
                                <FormField
                                    control={form.control}
                                    name="variableName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Variable Name</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="myGemini"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                Use this name to reference the result in other nodes:{" "} {`{{${watchVariableName}.text}}`}
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="credentialId"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Gemini Credential</FormLabel>
                                            <Select
                                                defaultValue={field.value}
                                                onValueChange={field.onChange}
                                                disabled={
                                                    isLoadingCredential || !credentials?.length
                                                }
                                            >
                                                <FormControl>
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Select credential..." />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {isLoadingCredential ? (
                                                        <div className="flex items-center justify-center">
                                                            <Spinner color="text-primary" />
                                                        </div>
                                                    ) : credentials?.map(({ id, name }) => (
                                                        <SelectItem key={id} value={id} >
                                                            <div className='flex items-center gap-2'>
                                                                <Image
                                                                    src={"/gemini.svg"}
                                                                    alt={"gemini"}
                                                                    className='size-4 object-contain'
                                                                    width={300}
                                                                    height={300}
                                                                />
                                                                {name}
                                                            </div>
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="systemPrompt"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>System prompt (Optional)</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder={`You are a helpful assistant.`}
                                                    className="min-h-[80px] font-mono text-sm"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                Sets the behavior of the assistant. Use {"{{variables}}"} for simple value or
                                                {"{{json variable}}"} to stringify objects
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="userPrompt"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>User prompt</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder={`Summarize this commit: {{json @params.commit}}`}
                                                    className="min-h-[120px] font-mono text-sm"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                The prompt to send to the AI. Use {"{{variables}}"} for simple value or
                                                {"{{json variable}}"} to stringify objects. Include run parameters such as commits with
                                                {" {{json @params.commit}}"} (e.g. {`Summarize this commit: {{json @params.commit}}`}).
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </ScrollArea>
                        <DialogFooter className=" mt-5">
                            <Button type="submit">
                                Save
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};
