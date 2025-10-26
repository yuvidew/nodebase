"use client";

import { type NodeProps, Position, useReactFlow } from "@xyflow/react";
import type { LucideIcon } from "lucide-react";
import { BaseNode, BaseNodeContent } from "@/components/react-flow/base-node";
import { BaseHandle } from "@/components/react-flow/base-handle";
import { WorkflowNode } from "@/components/workflow-node";
import { memo, type ReactNode } from "react";
import Image from "next/image";
import { NodeStatus, NodeStatusIndicator } from "@/components/react-flow/node-status-indicator";

interface BaseExecutionNodeProps extends NodeProps {
    icon: LucideIcon | string;
    name: string;
    description?: string;
    children?: ReactNode;
    onSetting?: () => void;
    onDoubleClick?: () => void;
    status?: NodeStatus

}


/**
 * BaseExecutionNode
 *
 * A reusable workflow node component used in the visual workflow builder.
 * It provides a standardized layout with icon, description, handles, and status indicator.
 *
 * @component
 *
 * @param {string} id - Unique identifier for the node (provided by React Flow).
 * @param {LucideIcon | string} icon - Icon component or image URL representing the node.
 * @param {string} name - Display name of the node.
 * @param {string} [description] - Optional description of the node.
 * @param {ReactNode} [children] - Additional child components to render inside the node.
 * @param {() => void} [onSetting] - Optional callback triggered when the settings button is clicked.
 * @param {() => void} [onDoubleClick] - Optional callback triggered when the node is double-clicked.
 * @param {NodeStatus} [status="initial"] - Current status of the node, controls the border and indicator color.
 *
 * @example
 * ```tsx
 * import { DatabaseIcon } from "lucide-react";
 *
 * <BaseExecutionNode
 *   id="db-node-1"
 *   icon={DatabaseIcon}
 *   name="Database Query"
 *   description="Fetch data from DB"
 *   status="running"
 *   onSetting={() => console.log("Open settings")}
 *   onDoubleClick={() => console.log("Node opened")}
 * />
 * ```
 */

export const BaseExecutionNode = memo(
    ({
        id,
        icon: Icon,
        name,
        description,
        children,
        onSetting,
        onDoubleClick,
        status = "initial"
    }: BaseExecutionNodeProps) => {
        const { setNodes, setEdges } = useReactFlow();

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
                >

                    <BaseNode status={status} onDoubleClick={onDoubleClick} >
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
                            )}
                            {children}
                            <BaseHandle
                                id={"target-1"}
                                type="target"
                                position={Position.Left}
                            />
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

BaseExecutionNode.displayName = "BaseExecutionNode";
