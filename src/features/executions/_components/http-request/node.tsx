"use client";

import React, { memo, useState } from 'react'
import { useReactFlow, type Node, type NodeProps } from "@xyflow/react";
import { Globe2Icon } from "lucide-react";
import { BaseExecutionNode } from "../base-execution-node";
import { HttpRequestFromValues, HttpRequestDialog } from './dialog';
import { useNodeStatus } from '../../hooks/use-node-status';
import { fetchHttpRequestRealtimeToken } from './actions';
import { HTTP_REQUEST_CHANNEL_NAME } from '@/inngest/channels/http-request';

type HttpRequestNodeData = {
    variableName?:string;
    endpoint?: string;
    method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    body?: string;
};

type HttpRequestNodeType = Node<HttpRequestNodeData>;


/**
 * HttpRequestNode
 *
 * A workflow node component that represents an HTTP Request action
 * within the visual automation builder. It allows configuration of
 * endpoint, method, and body parameters via a dialog.
 *
 * @component
 *
 * @param {NodeProps<HttpRequestNodeType>} props - The props provided by React Flow for this node.
 * @param {string} props.id - Unique identifier for the node.
 * @param {HttpRequestNodeData} props.data - Data associated with this HTTP request node, including endpoint, method, and body.
 *
 * @returns {JSX.Element} A memoized React component rendering an HTTP Request node with configuration dialog.
 *
 * @example
 * ```tsx
 * <HttpRequestNode
 *   id="http-1"
 *   data={{
 *     endpoint: "https://api.example.com/users",
 *     method: "GET",
 *   }}
 *   position={{ x: 100, y: 200 }}
 * />
 * ```
 */

export const HttpRequestNode = memo((props: NodeProps<HttpRequestNodeType>) => {
    const [dialogOpen, setDialogOpen] = useState(false);
    const { setNodes } = useReactFlow()
    const nodeStatus = useNodeStatus({
        nodeId : props.id,
        channel : HTTP_REQUEST_CHANNEL_NAME,
        topic : "status",
        refreshToken : fetchHttpRequestRealtimeToken
    });
    const nodeData = props.data;
    const description = nodeData?.endpoint ? `${nodeData.method || "GET"} : ${nodeData.endpoint}` : "Not configured";

    const handleSubmit = (values: HttpRequestFromValues) => {
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
            <HttpRequestDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                onSubmit={handleSubmit}
                defaultValues={nodeData}
            />
            <BaseExecutionNode
                {...props}
                id={props.id}
                icon={Globe2Icon}
                name="HTTP Request"
                description={description}
                onSetting={handleOpenSetting}
                onDoubleClick={handleOpenSetting}
                status={nodeStatus}
            />
        </>
    )
});

HttpRequestNode.displayName = "HttpRequestNode";
