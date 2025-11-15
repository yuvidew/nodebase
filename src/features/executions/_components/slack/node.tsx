"use client";

import React, { memo, useState } from 'react'
import { useReactFlow, type Node, type NodeProps } from "@xyflow/react";
import { BaseExecutionNode } from "../base-execution-node";
import {   SlackFromValues, SlackDialog } from './dialog';
import { useNodeStatus } from '../../hooks/use-node-status';
import { fetchSlackRealtimeToken } from './actions';
import { SLACK_CHANNEL_NAME } from '@/inngest/channels/slack';

type SlackNodeData = {
    webhookUrl? : string;
    content? :string;
};

type SlackNodeType = Node<SlackNodeData>;


/**
 * SlackNode
 *
 * A workflow node component that represents an discord action
 * within the visual automation builder. It allows configuration of
 * endpoint, method, and body parameters via a dialog.
 *
 * @component
 *
 * @param {NodeProps<SlackNodeType>} props - The props provided by React Flow for this node.
 * @param {string} props.id - Unique identifier for the node.
 * @param {SlackNodeData} props.data - Data associated with this Discord node, including endpoint, method, and body.
 *
 * @returns {JSX.Element} A memoized React component rendering an Discord node with configuration dialog.
 *
 * @example
 * ```tsx
 * <SlackNode
 *   id="http-1"
 *   data={{
 *     endpoint: "https://api.example.com/users",
 *     method: "GET",
 *   }}
 *   position={{ x: 100, y: 200 }}
 * />
 * ```
 */

export const SlackNode = memo((props: NodeProps<SlackNodeType>) => {
    const [dialogOpen, setDialogOpen] = useState(false);
    const { setNodes } = useReactFlow()
    const nodeStatus = useNodeStatus({
        nodeId : props.id,
        channel : SLACK_CHANNEL_NAME,
        topic : "status",
        refreshToken : fetchSlackRealtimeToken
    });
    const nodeData = props.data;
    const description = nodeData?.content ? `Send: ${nodeData?.content.slice(0, 50)}...` : "Not configured";

    const handleSubmit = (values: SlackFromValues) => {
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
            <SlackDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                onSubmit={handleSubmit}
                defaultValues={nodeData}
            />
            <BaseExecutionNode
                {...props}
                id={props.id}
                icon={"/slack.svg"}
                name="Slack"
                description={description}
                onSetting={handleOpenSetting}
                onDoubleClick={handleOpenSetting}
                status={nodeStatus}
            />
        </>
    )
});

SlackNode.displayName = "SlackNode";
