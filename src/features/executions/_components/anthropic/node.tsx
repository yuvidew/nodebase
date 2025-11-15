"use client";

import React, { memo, useState } from 'react'
import { useReactFlow, type Node, type NodeProps } from "@xyflow/react";
import { BaseExecutionNode } from "../base-execution-node";
import {  AnthropicDialog, AnthropicFromValues } from './dialog';
import { useNodeStatus } from '../../hooks/use-node-status';
import { fetchAnthropicRealtimeToken } from './actions';
import { ANTHROPIC_CHANNEL_NAME } from '@/inngest/channels/anthropic';

type AnthropicNodeData = {
    credentialId? : string;
    variableName? :string;
    systemPrompt? :string;
    userPrompt? :string
};

type AnthropicNodeType = Node<AnthropicNodeData>;


/**
 * AnthropicNode
 *
 * A workflow node component that represents an anthropic action
 * within the visual automation builder. It allows configuration of
 * endpoint, method, and body parameters via a dialog.
 *
 * @component
 *
 * @param {NodeProps<OpenAINodeType>} props - The props provided by React Flow for this node.
 * @param {string} props.id - Unique identifier for the node.
 * @param {AnthropicNodeData} props.data - Data associated with this openai node, including endpoint, method, and body.
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

export const AnthropicNode = memo((props: NodeProps<AnthropicNodeType>) => {
    const [dialogOpen, setDialogOpen] = useState(false);
    const { setNodes } = useReactFlow()
    const nodeStatus = useNodeStatus({
        nodeId : props.id,
        channel : ANTHROPIC_CHANNEL_NAME,
        topic : "status",
        refreshToken : fetchAnthropicRealtimeToken
    });
    const nodeData = props.data;
    const description = nodeData?.userPrompt ? `claude-sonnet-4-5 : ${nodeData.userPrompt.slice(0, 50)}...` : "Not configured";

    const handleSubmit = (values: AnthropicFromValues) => {
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
            <AnthropicDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                onSubmit={handleSubmit}
                defaultValues={nodeData}
            />
            <BaseExecutionNode
                {...props}
                id={props.id}
                icon={"/anthropic.svg"}
                name="Anthropic"
                description={description}
                onSetting={handleOpenSetting}
                onDoubleClick={handleOpenSetting}
                status={nodeStatus}
            />
        </>
    )
});

AnthropicNode.displayName = "AnthropicNode";
