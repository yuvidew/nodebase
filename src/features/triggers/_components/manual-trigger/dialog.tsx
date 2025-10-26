"use client";
import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

interface Props {
    open: boolean;
    onOpenChange: (open : boolean) => void;
}

export const ManualTriggerDialog = ({open, onOpenChange}: Props) => {
    return (
        <Dialog onOpenChange={onOpenChange} open={open}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Manual Trigger</DialogTitle>
                    <DialogDescription>
                        Configure settings for the manual trigger node.
                    </DialogDescription>
                </DialogHeader>
                <div className='py-4'>
                    <p className='text-sm text-muted-foreground'>
                        Used to manually execute a workflow, no configuration available.
                    </p>
                </div>
            </DialogContent>
        </Dialog>
    )
}
