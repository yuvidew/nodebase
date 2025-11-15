"use client";

import { CredentialType } from '@/generated/prisma';
import Image from 'next/image';
import { useRouter, useParams } from 'next/navigation';
import React from 'react';
import { useCreateCredential, useUpdateCredential, useSuspenseCredential } from '../hooks/use-credentials';
import { useUpgradeModal } from '@/hooks/use-upgrade-modal';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { prefetch } from '../../../trpc/server';
import Link from 'next/link';


const formSchema = z.object({
    name: z.string().min(1, "Name is required"),
    type: z.enum(CredentialType),
    value: z.string().min(1, "API key is required")
})

type FormValues = z.infer<typeof formSchema>;

const credentialTypeOptions = [
    {
        value: CredentialType.OPENAI,
        label: "OpenAI",
        logo: "/openai.svg",
    },
    {
        value: CredentialType.ANTHROPIC,
        label: "Anthropic",
        logo: "/anthropic.svg",
    },
    {
        value: CredentialType.GEMINI,
        label: "Gemini",
        logo: "/gemini.svg",
    },
];

interface CredentialFormProps {
    initialData?: {
        id?: string;
        name: string;
        type: CredentialType;
        value: string;
    }
}

export const CredentialForm = ({ initialData }: CredentialFormProps) => {
    const router = useRouter();
    const { mutateAsync: createCredential, isPending: isPendingCreateCredential } = useCreateCredential();
    const { mutateAsync: onUpdateCredential, isPending: isPendingUpdateCredential } = useUpdateCredential();
    const { handleError, modal } = useUpgradeModal();

    const isEdit = !!initialData?.id;

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData || {
            name: "",
            type: CredentialType.OPENAI,
            value: "",
        }
    });

    const onSubmit = async (values: FormValues) => {
        if (isEdit && initialData?.id) {
            await onUpdateCredential({
                id: initialData.id,
                ...values
            }, {
                onSuccess : () => {
                    router.push(`/credentials`)
                },
                onError: (error) => {
                    handleError(error)
                }
            });
        } else {
            await createCredential(values, {
                onSuccess : (data) => {
                    form.reset();
                    router.push(`/credentials/${data.id}`)
                },
                onError: (error) => {
                    handleError(error)
                }
            });
        }
    }

    return (
        <>
            {modal}
            <Card className=' shadow-none'>
                <CardHeader>
                    <CardTitle>
                        {isEdit ? "Edit Credential" : "Create Credential"}
                    </CardTitle>

                    <CardDescription>
                        {isEdit
                            ? "Update your API key or credential details"
                            : "Add a new API key or credential to your account"}
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className='space-y-6'
                        >

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
                                                placeholder="My API key"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="type"
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
                                                {credentialTypeOptions.map(({label, value , logo}) => (
                                                    <SelectItem key={value} value={value}>
                                                        <div className='flex items-center gap-2'>
                                                            <Image 
                                                                src={logo} 
                                                                alt={value}   
                                                                className='size-4 object-contain'
                                                                width={300}
                                                                height={300}
                                                            />
                                                            {label}
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
                                name="value"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>API Key</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="password"
                                                placeholder="sk-..."
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className=' flex gap-4'>
                                <Button
                                    type = "submit"
                                    disabled = {
                                        isPendingCreateCredential ||
                                        isPendingUpdateCredential
                                    }
                                >
                                    {(isPendingCreateCredential || isPendingUpdateCredential) ? <Spinner  /> : isEdit ? "Update" : "Create"}
                                </Button>

                                <Button 
                                    type='button' 
                                    variant={"outline"}
                                    asChild
                                >
                                    <Link href = {"/credentials"} prefetch>
                                    Cancel
                                    </Link>
                                </Button>
                            </div>

                        </form>
                    </Form>
                </CardContent>
            </Card>
        </>
    )
}

interface Props {
    credentialId : string
} 

export const CredentialView = ({credentialId} : Props) => {
    const {data} = useSuspenseCredential(credentialId);

    return <CredentialForm initialData={data} />
}
