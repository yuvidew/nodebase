"use client";

import React, { ReactNode, useCallback } from 'react';
import { createId } from "@paralleldrive/cuid2";
import { useReactFlow } from '@xyflow/react';
import {
    Globe2Icon,
    MousePointer2Icon,
    WebhookIcon
} from "lucide-react";

import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";

import { NodeType } from '@/generated/prisma';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

export type NodeTypeOption = {
    type: NodeType,
    label: string,
    description: string,
    icon: React.ComponentType<{ className?: string }> | string;
}

const triggerNodes: NodeTypeOption[] = [
    {
        type: NodeType.MANUAL_TRIGGER,
        label: "Trigger manually",
        description: "Runs the flow on clicking a button, Good for getting started quickly",
        icon: MousePointer2Icon,
    },
];

const executionNodes: NodeTypeOption[] = [
    {
        type: NodeType.HTTP_REQUEST,
        label: "HTTP Request",
        description: "Makes an HTTP request",
        icon: Globe2Icon,
    }
]


interface Props {
    open: boolean,
    onOpenChange: (open: boolean) => void;
    children : ReactNode
}

/**
 * Drawer for picking a node to insert into the workflow.
 * @param {boolean} open Controls visibility of the selector sheet.
 * @param {(open: boolean) => void} onOpenChange Callback fired when the sheet toggles.
 * @param {ReactNode} children Trigger element rendered as the sheet trigger.
 */
export const NodeSelector = ({open, onOpenChange, children}: Props) => {
    const {setNodes, getNodes, screenToFlowPosition} = useReactFlow();

    const handleNodeSelect = useCallback((selection: NodeTypeOption) => {
        // Check if trying to add a manual trigger when one already exists
        if (selection.type === NodeType.MANUAL_TRIGGER) {
            const nodes = getNodes();
            const hasManualTrigger = nodes.some(
                (node) => node.type === NodeType.MANUAL_TRIGGER,
            );

            if (hasManualTrigger) {
                toast.error("Only one manual trigger is allowed per workflow");
                return;
            };

        }

        setNodes((nodes) => {
            const hasInitialTrigger = nodes.some(
                (node) => node.type === NodeType.INITIAL,
            );

            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;

            const flowPosition = screenToFlowPosition({
                x : centerX + (Math.random() - 0.5) * 200,
                y : centerY + (Math.random() - 0.5) * 200,
            });

            const newNode = {
                id: createId(),
                data: {},
                position : flowPosition,
                type: selection.type,
            };

            if (hasInitialTrigger) {
                return [newNode];
            }

            return [...nodes, newNode];
        });

        onOpenChange(false);
    }, [
        setNodes,
        getNodes,
        onOpenChange,
        screenToFlowPosition,
    ]);


    return (
        <Sheet open= {open} onOpenChange={onOpenChange}>
            <SheetTrigger asChild>{children}</SheetTrigger>
            <SheetContent 
                side='right'
                className='w-full sm:max-w-md overflow-x-auto'
            >
                <SheetHeader>
                    <SheetTitle>What trigger this workflow?</SheetTitle>
                    <SheetDescription>
                        A trigger is a stop that starts your workflow.
                    </SheetDescription>
                </SheetHeader>
                <div>
                    {triggerNodes.map((nodeType) => {
                        const Icon = nodeType.icon;

                        return (
                            <div 
                                key={nodeType.type}
                                className='w-full justify-start h-auto py-5 px-4 rounded-none cursor-pointer border-l-2 border-transparent hover:border-l-primary'
                                onClick={() => handleNodeSelect(nodeType)}
                            >
                                <div className='flex items-center gap-6 w-full overflow-hidden'>
                                    {typeof Icon === "string" ? (
                                        <img
                                            src={Icon}
                                            alt={nodeType.label}
                                            className='size-5 object-contain rounded-sm'
                                        />
                                    ) : (
                                        <Icon className='size-5'/>
                                    )}
                                    <div className=' flex flex-col items-start text-left'>
                                        <span className='font-medium text-sm'>
                                            {nodeType.label}
                                        </span>
                                        <span className=' text-xs text-muted-foreground'>
                                            {nodeType.description}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
                <Separator/>
                <div>
                    {executionNodes.map((nodeType) => {
                        const Icon = nodeType.icon;

                        return (
                            <div 
                                key={nodeType.type}
                                className='w-full justify-start h-auto py-5 px-4 rounded-none cursor-pointer border-l-2 border-transparent hover:border-l-primary'
                                onClick={() => handleNodeSelect(nodeType)}
                            >
                                <div className='flex items-center gap-6 w-full overflow-hidden'>
                                    {typeof Icon === "string" ? (
                                        <img
                                            src={Icon}
                                            alt={nodeType.label}
                                            className='size-5 object-contain rounded-sm'
                                        />
                                    ) : (
                                        <Icon className='size-5'/>
                                    )}
                                    <div className=' flex flex-col items-start text-left'>
                                        <span className='font-medium text-sm'>
                                            {nodeType.label}
                                        </span>
                                        <span className=' text-xs text-muted-foreground'>
                                            {nodeType.description}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </SheetContent>
        </Sheet>
    )
}
