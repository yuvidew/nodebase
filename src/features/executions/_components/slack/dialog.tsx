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


import { Textarea } from "@/components/ui/textarea";

import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ScrollArea } from "@/components/ui/scroll-area";



const formSchema = z.object({
    variableName: z
        .string()
        .min(1, { message: "Variable name is required" })
        .regex(/^[A-Za-z_$][A-Za-z0-9_$]*$/, {
            message: "Variable name must start with a letter or underscore and contain only letters, numbers, and underscores"
        }),
    webhookUrl: z.string().min(1, "Webhook URL is required"),
    content: z
        .string()
        .min(1, "Message Content is required")
        .max(2000, "Slack message cannot exceed 2000 characters"),
});

export type SlackFromValues = z.infer<typeof formSchema>;

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (values: z.infer<typeof formSchema>) => void;
    defaultValues?: Partial<SlackFromValues>
}



export const SlackDialog = ({
    open,
    onOpenChange,
    onSubmit,
    defaultValues
}: Props) => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            variableName: defaultValues?.variableName || "",
            webhookUrl: defaultValues?.webhookUrl || "",
            content: defaultValues?.content || "",
        },
    });

    const watchVariableName = form.watch("variableName") || "mySlack";

    const handleSubmit = (values: z.infer<typeof formSchema>) => {
        onSubmit(values);
        onOpenChange(false);
    };

    // Reset form values when dialog opens with new defaults
    useEffect(() => {
        if (open) {
            form.reset({
                variableName: defaultValues?.variableName || "",
                content: defaultValues?.content || "",
                webhookUrl: defaultValues?.webhookUrl || "",
            })
        }
    }, [open, defaultValues, form])

    return (
        <Dialog onOpenChange={onOpenChange} open={open}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Slack Configuration</DialogTitle>
                    <DialogDescription>
                        Configure the Slack webhook settings for this node.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(handleSubmit)}
                        className=" mt-4"
                    >
                        <ScrollArea >
                            <div className="flex flex-col gap-y-8 w-[97%] m-auto p-0">
                                <FormField
                                    control={form.control}
                                    name="variableName"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Variable Name</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="mySlack"
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
                                    name="webhookUrl"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Webhook URL</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="https://hook.slack.com/sevices/..."
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                Get this from Slack: Workspace Setting → Workflows → Webhooks
                                            </FormDescription>
                                            <FormDescription>
                                                Make sure you have &quot;content&quot; variable
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="content"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel> Message Content</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder={`Summary: {{mySlack.text}}`}
                                                    className="min-h-[80px] font-mono text-sm"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormDescription>
                                                The message to send. Use {"{{variables}}"} for simple values or
                                                {"{{json variable}}"} to stringify objects
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
