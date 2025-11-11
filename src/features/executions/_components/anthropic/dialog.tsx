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

// import {
//     Select,
//     SelectContent,
//     SelectItem,
//     SelectTrigger,
//     SelectValue,
// } from "@/components/ui/select";

import { Textarea } from "@/components/ui/textarea";

import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

// export const AVAILABLE_MODELS = [
//     "Anthropic-2.0-flash",
//     "Anthropic-1.5-flash",
//     "Anthropic-1.5-flash-8b",
//     "Anthropic-1.5-pro",
//     "Anthropic-1.0-pro",
//     "Anthropic-pro",
// ] as const;

const formSchema = z.object({
    variableName: z
        .string()
        .min(1, { message: "Variable name is required" })
        .regex(/^[A-Za-z_$][A-Za-z0-9_$]*$/, {
            message: "Variable name must start with a letter or underscore and contain only letters, numbers, and underscores"
        }),
    // model: z.string().min(1, 'Model is required'),
    systemPrompt: z.string().optional(),
    userPrompt: z.string().min(1, "User prompt is required"),
});

export type AnthropicFromValues = z.infer<typeof formSchema>;

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (values: z.infer<typeof formSchema>) => void;
    defaultValues?: Partial<AnthropicFromValues>
}



export const AnthropicDialog = ({
    open,
    onOpenChange,
    onSubmit,
    defaultValues
}: Props) => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            variableName: defaultValues?.variableName || "",
            // model: defaultValues?.model || AVAILABLE_MODELS[0],
            systemPrompt: defaultValues?.systemPrompt || "",
            userPrompt: defaultValues?.userPrompt || "",
        },
    });

    const watchVariableName = form.watch("variableName") || "myAnthropic";

    const handleSubmit = (values: z.infer<typeof formSchema>) => {
        onSubmit(values);
        onOpenChange(false);
    };

    // Reset form values when dialog opens with new defaults
    useEffect(() => {
        if (open) {
            form.reset({
                variableName: defaultValues?.variableName || "",
                // model: defaultValues?.model || AVAILABLE_MODELS[0],
                systemPrompt: defaultValues?.systemPrompt || "",
                userPrompt: defaultValues?.userPrompt || "",
            })
        }
    }, [open, defaultValues, form])

    return (
        <Dialog onOpenChange={onOpenChange} open={open}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Anthropic Configuration</DialogTitle>
                    <DialogDescription>
                        Configure the AI model and prompt for this node.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(handleSubmit)}
                        className=" space-y-8 mt-4"
                    >
                        <FormField
                            control={form.control}
                            name="variableName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Variable Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="myAnthropic"
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

                        {/* <FormField
                            control={form.control}
                            name="model"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Modal</FormLabel>
                                    <Select defaultValue={field.value} onValueChange={field.onChange}>
                                        <FormControl>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Theme" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {AVAILABLE_MODELS.map((item, index) => (
                                                <SelectItem
                                                    key={index}
                                                    value={item}>{item}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormDescription>
                                        The Google Anthropic model to use for completion
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />*/}

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
