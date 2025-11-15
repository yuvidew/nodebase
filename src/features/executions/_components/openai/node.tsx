"use client";

import React, { memo, useState } from 'react'
import { useReactFlow, type Node, type NodeProps } from "@xyflow/react";
import { BaseExecutionNode } from "../base-execution-node";
import {  OpenAiDialog, OpenAiFromValues } from './dialog';
import { useNodeStatus } from '../../hooks/use-node-status';
import { OPENAI_CHANNEL_NAME } from '@/inngest/channels/openai';
import { fetchOpenaiRealtimeToken } from './actions';

type OpenAINodeData = {
    credentialId? : string;
    variableName? :string;
    systemPrompt? :string;
    userPrompt? :string
};

type OpenAINodeType = Node<OpenAINodeData>;


/**
 * OpenAINode
 *
 * A workflow node component that represents an openai action
 * within the visual automation builder. It allows configuration of
 * endpoint, method, and body parameters via a dialog.
 *
 * @component
 *
 * @param {NodeProps<OpenAINodeType>} props - The props provided by React Flow for this node.
 * @param {string} props.id - Unique identifier for the node.
 * @param {OpenAINodeData} props.data - Data associated with this openai node, including endpoint, method, and body.
 *
 * @returns {JSX.Element} A memoized React component rendering an openai node with configuration dialog.
 *
 * @example
 * ```tsx
 * <OpenAINode
 *   id="http-1"
 *   data={{
 *     endpoint: "https://api.example.com/users",
 *     method: "GET",
 *   }}
 *   position={{ x: 100, y: 200 }}
 * />
 * ```
 */

export const OpenAINode = memo((props: NodeProps<OpenAINodeType>) => {
    const [dialogOpen, setDialogOpen] = useState(false);
    const { setNodes } = useReactFlow()
    const nodeStatus = useNodeStatus({
        nodeId : props.id,
        channel : OPENAI_CHANNEL_NAME,
        topic : "status",
        refreshToken : fetchOpenaiRealtimeToken
    });
    const nodeData = props.data;
    const description = nodeData?.userPrompt ? `gpt-4 : ${nodeData.userPrompt.slice(0, 50)}...` : "Not configured";

    const handleSubmit = (values: OpenAiFromValues) => {
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
            <OpenAiDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                onSubmit={handleSubmit}
                defaultValues={nodeData}
            />
            <BaseExecutionNode
                {...props}
                id={props.id}
                icon={"/openai.svg"}
                name="OpenAI"
                description={description}
                onSetting={handleOpenSetting}
                onDoubleClick={handleOpenSetting}
                status={nodeStatus}
            />
        </>
    )
});

OpenAINode.displayName = "OpenAINode";
