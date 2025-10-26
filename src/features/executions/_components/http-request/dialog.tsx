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
import { SaveIcon } from "lucide-react";

const formSchema = z.object({
    endpoint: z.url({ message: "Pleases enter a valid URL" }),
    method: z.enum(["GET", "POST", "PUT", "PATCH", "DELETE"]),
    body: z.string().optional(),
    // .refine(), TODO
});

export type FormType = z.infer<typeof formSchema>;

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (values: z.infer<typeof formSchema>) => void;
    defaultEndpoint?: string;
    defaultMethod?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    defaultBody?: string;
}


/**
 * HttpRequestDialog
 *
 * A modal dialog that allows users to configure an HTTP Request node.
 * Provides form fields for endpoint URL, HTTP method, and optional request body.
 * Uses Zod for schema validation and react-hook-form for form handling.
 *
 * @component
 *
 * @param {boolean} open - Whether the dialog is currently open.
 * @param {(open: boolean) => void} onOpenChange - Function to handle dialog visibility changes.
 * @param {(values: FormType) => void} onSubmit - Function triggered when the user submits the form.
 * @param {string} [defaultEndpoint] - Default value for the endpoint input.
 * @param {"GET" | "POST" | "PUT" | "PATCH" | "DELETE"} [defaultMethod="GET"] - Default selected HTTP method.
 * @param {string} [defaultBody] - Default request body for POST/PUT/PATCH methods.
 *
 * @returns {JSX.Element} The rendered HTTP request configuration dialog.
 *
 * @example
 * ```tsx
 * <HttpRequestDialog
 *   open={isDialogOpen}
 *   onOpenChange={setDialogOpen}
 *   onSubmit={(values) => console.log(values)}
 *   defaultEndpoint="https://api.example.com/users"
 *   defaultMethod="POST"
 *   defaultBody='{ "name": "John" }'
 * />
 * ```
 */
export const HttpRequestDialog = ({
    open,
    onOpenChange,
    onSubmit,
    defaultBody = "",
    defaultEndpoint = "",
    defaultMethod = "GET",
}: Props) => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            endpoint: defaultEndpoint,
            method: defaultMethod,
            body: defaultBody,
        },
    });

    const watchMethod = form.watch("method");
    const showBodyField = ["POST", "PUT", "PATCH"].includes(watchMethod);

    const handleSubmit = (values: z.infer<typeof formSchema>) => {
        onSubmit(values);
        onOpenChange(false);
    };

    // Reset form values when dialog opens with new defaults
    useEffect(() => {
        if (open) {
            form.reset({
                endpoint: defaultEndpoint,
                method: defaultMethod,
                body: defaultBody
            })
        }
    }, [open, defaultBody, defaultEndpoint, defaultMethod, form])

    return (
        <Dialog onOpenChange={onOpenChange} open={open}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle> http request</DialogTitle>
                    <DialogDescription>
                        Configure settings for the HTTP Request node.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(handleSubmit)}
                        className=" space-y-8 mt-4"
                    >
                        <FormField
                            control={form.control}
                            name="method"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Method</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger className="w-full">
                                                <SelectValue
                                                    placeholder="Select a method"
                                                    className="w-full"
                                                />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            <SelectItem value="GET">GET</SelectItem>
                                            <SelectItem value="POST">POST</SelectItem>
                                            <SelectItem value="PUT">PUT</SelectItem>
                                            <SelectItem value="PATCH">PATCH</SelectItem>
                                            <SelectItem value="DELETE">DELETE</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <FormDescription>
                                        The HTTP method to use for this request
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="endpoint"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Endpoint URL</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="https//api.example.com/users/{{httpResponse.data.id}}"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        Static URL or use {"{{variables}}"} for simple value or{" "}
                                        {"{{json variable}}"} to stringify objects
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {showBodyField && (
                            <FormField
                                control={form.control}
                                name="body"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Request Body</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder={`{\n "userId" : "{{httpResponse.data.id}}",\n "name" : "{{httpResponse.data.name}}",\n "items" : "{{httpResponse.data.items}}"\n}`}
                                                className="min-h-[120px] font-mono text-sm"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            JSON with template variable. Use {"{{variables}}"} for simple value or{" "}
                                            {"{{json variable}}"} to stringify objects
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        )}
                        <DialogFooter className=" mt-5">
                            <Button type="submit">
                                <SaveIcon className=" size-4" /> Save
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};
