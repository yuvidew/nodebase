"use client";

import { memo, useState } from "react";
import type { NodeProps } from "@xyflow/react"
import { PlaceholderNode } from "./react-flow/placeholder-node";
import { PlusIcon } from "lucide-react";
import { WorkflowNode } from "./workflow-node";
import { NodeSelector } from "./node-selector";


/**
 * @param props React Flow node properties for the initial placeholder node component.
 */
export const InitialNode = memo((props: NodeProps) => {
    const [open, setOpen] = useState(false)
    return (
        <NodeSelector open={open} onOpenChange={setOpen}>
            <WorkflowNode showToolbar = {false}>
                <PlaceholderNode
                    {...props}
                    onClick={() => setOpen(true)}
                >
                    <div className=" cursor-pointer flex items-center justify-center">
                        <PlusIcon className=" size-4" />
                    </div>
                </PlaceholderNode>
            </WorkflowNode>
        </NodeSelector>

    )
});

InitialNode.displayName = "InitialNode"
