"use client";

import { type NodeProps, Position, useReactFlow } from "@xyflow/react";
import type { LucideIcon } from "lucide-react";
import { BaseNode, BaseNodeContent } from "../../../components/react-flow/base-node";
import { BaseHandle } from "../../../components/react-flow/base-handle";
import { WorkflowNode } from "../../../components/workflow-node";
import { memo, type ReactNode } from "react";
import Image from "next/image";
import { type NodeStatus, NodeStatusIndicator } from "@/components/react-flow/node-status-indicator";

interface BaseTriggerNodeProps extends NodeProps {
    icon: LucideIcon | string;
    name: string;
    description?: string;
    children?: ReactNode;
    status? : NodeStatus;
    onSetting?: () => void;
    onDoubleClick?: () => void;
}

export const BaseTriggerNode = memo(
    ({
        id,
        icon: Icon,
        name,
        description,
        children,
        onSetting,
        onDoubleClick,
        status = "initial"
    }: BaseTriggerNodeProps) => {
        const {setNodes , setEdges} = useReactFlow();

        const handleDelete = () => { 
            setNodes((currentNodes) => {
                return currentNodes.filter((node) => node.id !== id);
            });

            setEdges((currentEdges) => {
                return currentEdges.filter(
                    (edge) => edge.source !== id && edge.target !== id
                );
            });
        };
        return (
            <WorkflowNode
                name={name}
                description={description}
                onDelete={handleDelete}
                onSettings={onSetting}
                showToolbar
            >
                <NodeStatusIndicator
                    status={status}
                    variant="border"
                    className="rounded-l-2xl"
                >
                    <BaseNode status = {status} onDoubleClick={onDoubleClick} className=" rounded-l-2xl relative group "> 
                        <BaseNodeContent>
                            {typeof Icon === "string" ? (
                                <Image 
                                    src={Icon} 
                                    alt={name} 
                                    width={16} 
                                    height={16}
                                />
                            ) : (
                                <Icon className=" size-4 text-muted-foreground" />
                            ) }

                            {children}
                            <BaseHandle
                                id={"source-1"}
                                type="source"
                                position={Position.Right}
                            />
                        </BaseNodeContent>
                    </BaseNode>
                </NodeStatusIndicator>
            </WorkflowNode>
        );
    }
);

BaseTriggerNode.displayName = "BaseTriggerNode";
