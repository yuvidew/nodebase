"use client";

import { memo } from "react";
import type { NodeProps } from "@xyflow/react"
import { PlaceholderNode } from "./react-flow/placeholder-node";
import { PlusIcon } from "lucide-react";
import { WorkflowNode } from "./workflow-node";


/**
 * @param props React Flow node properties for the initial placeholder node component.
 */
export const InitialNode = memo((props: NodeProps) => {
    return (
        <WorkflowNode showToolbar name = "new node" description="Create a node">
            <PlaceholderNode
                {...props}
                
            >
                <div className=" cursor-pointer flex items-center justify-center">
                    <PlusIcon className=" size-4" />
                </div>
            </PlaceholderNode>
        </WorkflowNode>
    )
});

InitialNode.displayName = "InitialNode"
