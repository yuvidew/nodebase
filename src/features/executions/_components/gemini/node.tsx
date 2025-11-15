"use client";

import React, { memo, useState } from 'react'
import { useReactFlow, type Node, type NodeProps } from "@xyflow/react";
import { BaseExecutionNode } from "../base-execution-node";
import {  GeminiDialog, GeminiFromValues } from './dialog';
import { useNodeStatus } from '../../hooks/use-node-status';
import { GEMINI_CHANNEL_NAME } from '@/inngest/channels/gemini';
import { fetchGeminiRealtimeToken } from './actions';

type GeminiNodeData = {
    credentialId? : string;
    variableName? :string;
    systemPrompt? :string;
    userPrompt? :string
};

type GeminiNodeType = Node<GeminiNodeData>;


/**
 * GeminiNode
 *
 * A workflow node component that represents an gemini action
 * within the visual automation builder. It allows configuration of
 * endpoint, method, and body parameters via a dialog.
 *
 * @component
 *
 * @param {NodeProps<GeminiNodeType>} props - The props provided by React Flow for this node.
 * @param {string} props.id - Unique identifier for the node.
 * @param {GeminiNodeData} props.data - Data associated with this gemini node, including endpoint, method, and body.
 *
 * @returns {JSX.Element} A memoized React component rendering an gemini node with configuration dialog.
 *
 * @example
 * ```tsx
 * <GeminiNode
 *   id="http-1"
 *   data={{
 *     endpoint: "https://api.example.com/users",
 *     method: "GET",
 *   }}
 *   position={{ x: 100, y: 200 }}
 * />
 * ```
 */

export const GeminiNode = memo((props: NodeProps<GeminiNodeType>) => {
    const [dialogOpen, setDialogOpen] = useState(false);
    const { setNodes } = useReactFlow()
    const nodeStatus = useNodeStatus({
        nodeId : props.id,
        channel : GEMINI_CHANNEL_NAME,
        topic : "status",
        refreshToken : fetchGeminiRealtimeToken
    });
    const nodeData = props.data;
    const description = nodeData?.userPrompt ? `gemini-2.0-flash : ${nodeData.userPrompt.slice(0, 50)}...` : "Not configured";

    const handleSubmit = (values: GeminiFromValues) => {
        setNodes((nodes) => nodes.map((node) => {
            if (node.id === props.id) {
                return {
                    ...node,
                    data : {
                        ...node.data,
                        ...values
                    },
                };
            };

            return node;
        }));
    };

    
    const handleOpenSetting = () => setDialogOpen(true);
    return (
        <>
            <GeminiDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                onSubmit={handleSubmit}
                defaultValues={nodeData}
            />
            <BaseExecutionNode
                {...props}
                id={props.id}
                icon={"/gemini.svg"}
                name="Gemini"
                description={description}
                onSetting={handleOpenSetting}
                onDoubleClick={handleOpenSetting}
                status={nodeStatus}
            />
        </>
    )
});

GeminiNode.displayName = "GeminiNode";
