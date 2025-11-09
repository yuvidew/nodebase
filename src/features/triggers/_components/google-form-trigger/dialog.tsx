"use client";
import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useParams } from 'next/navigation';
import { toast } from 'sonner';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CopyIcon } from 'lucide-react';
import { generateGoogleFormScript } from './utils';

interface Props {
    open: boolean;
    onOpenChange: (open : boolean) => void;
}

export const GoogleFromTriggerDialog = ({open, onOpenChange}: Props) => {
    const {workflowId} = useParams();

    // Construct the webhook URL
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const webhookUrl = `${baseUrl}/api/webhooks/google-form?workflowId=${workflowId}`;

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(webhookUrl);
            toast.success("Webhook URL copied to clipboard");
        } catch {
            toast.error("Failed to copy URL");
        }
    }

    const copyGoogleFormScript = async () => {
        const script = generateGoogleFormScript(webhookUrl)
        try {
            await navigator.clipboard.writeText(script);
            toast.success("Script copied to clipboard");
        } catch {
            toast.error("Failed to script to clipboard");
        }
    }


    return (
        <Dialog onOpenChange={onOpenChange} open={open}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Google Form trigger Configuration</DialogTitle>
                    <DialogDescription>
                        Use this webhook URL in your Google Form&apos;s Apps Script to Trigger this workflow when a form is submitted.
                    </DialogDescription>
                </DialogHeader>
                <div className='space-y-4'>
                    <div className=' space-y-2'>
                        <Label htmlFor='webhook-url'>
                            Webhook URL
                        </Label>

                        <div className=' flex gap-2'>
                            <Input
                                id='webhook-url'
                                value={webhookUrl}
                                readOnly
                                className='font-mono text-sm'
                            />

                            <Button
                                type="button" 
                                size = "icon"
                                variant={"outline"}
                                onClick={copyToClipboard}
                            >
                                <CopyIcon className='size-4' />
                            </Button>
                        </div>
                    </div>
                    <div className=' rounded-lg bg-muted p-4 space-y-2'>
                        <h4 className=' font-medium text-sm'>Setup instructions:</h4>
                        <ol className=' text-sm text-muted-foreground space-y-1 list-decimal list-inside'>
                            <li>Open your Google Form</li>
                            <li>Click the three dots menu → Script editor</li>
                            <li>Copy and paste the script below</li>
                            <li>Replace WEBHOOK_URL with your webhook URL above</li>
                            <li>Save and click &quot;Triggers&quot; → Add Trigger</li>
                            <li>Choose: form → on form submit → Save</li>
                        </ol>
                    </div>

                    <div className=' rounded-lg bg-muted p-4 space-y-3'>
                        <h4 className=' text-sm font-medium'>Google Apps Script</h4>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={copyGoogleFormScript}
                        >
                            <CopyIcon className='size-4 mr-2' />

                            Copy Google Apps Script

                        </Button>

                        <p className='text-sm text-muted-foreground'>
                            This script include your webhook URL and handles form submission
                        </p>
                    </div>

                    <div className=' rounded-lg bg-muted p-4 space-y-2'>
                        <h4 className=' font-medium text-sm'>
                            Available Variables
                        </h4>

                        <ul className="text-sm text-muted-foreground space-y-1">
                            <li>
                                <code className=' bg-background px-1 py-0.5 rounded'>
                                    {"{{googleForm.respondentEmail}}"}
                                </code>
                                - Respondent&apos;s email
                            </li>

                            <li>
                                <code className=' bg-background px-1 py-0.5 rounded'>
                                    {"{{googleForm.respondentEmail['Question Name']}}"}
                                </code>
                                - specific answer
                            </li>

                            <li>
                                <code className=' bg-background px-1 py-0.5 rounded'>
                                    {"{{json googleForm.responses}}"}
                                </code>
                                - All response as JSON
                            </li>
                        </ul>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}
