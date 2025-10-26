"use client";

import React, { memo, useEffect, useState } from 'react'
import { useReactFlow, type Node, type NodeProps } from "@xyflow/react";
import { Globe2Icon } from "lucide-react";
import { BaseExecutionNode } from "../base-execution-node";
import { FormType, HttpRequestDialog } from './dialog';

type HttpRequestNodeData = {
    endpoint?: string;
    method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    body?: string;
    [key: string]: unknown;
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
    const nodeStatus = "initial";
    const nodeData = props.data;
    const description = nodeData?.endpoint ? `${nodeData.method || "GET"} : ${nodeData.endpoint}` : "Not configured";

    const handleSubmit = (values: FormType) => {
        setNodes((nodes) => nodes.map((node) => {
            if (node.id === props.id) {
                return {
                    ...node,
                    data : {
                        ...node.data,
                        endpoint : values.endpoint,
                        method: values.method,
                        body: values.body,
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
                defaultEndpoint={nodeData.endpoint}
                defaultMethod={nodeData.method}
                defaultBody={nodeData.body}
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
