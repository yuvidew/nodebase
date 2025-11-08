"use client";

import { ErrorView } from "@/components/entity-components/error-view";
import { LoadingView } from "@/components/entity-components/loading-view";
import { useSuspenseWorkflow } from "@/features/workflows/hooks/use-workflows";
import { useCallback, useMemo, useState } from "react";
import {
    ReactFlow,
    applyNodeChanges,
    applyEdgeChanges,
    addEdge,
    type Node,
    type Edge,
    type NodeChange,
    type EdgeChange,
    type Connection,
    Background,
    Controls,
    MiniMap,
    Panel
} from "@xyflow/react";
// @ts-expect-error - CSS imports don't have type declarations
import "@xyflow/react/dist/style.css";
import { nodeComponents } from "@/config/node-component";
import { AddNodeButton } from "./add-node-button";
import { useSetAtom } from "jotai";
import { editorAtom } from "../store/atoms";
import { NodeType } from "@/generated/prisma";
import { ExecuteWorkflowButton } from "./execute-workflow-button";

export const EditorLoading = () => <LoadingView message="Loading editor..." />;

export const EditorError = () => (
    <ErrorView message="Error loading editor..." />
);


export const Editor = ({ workflowId }: { workflowId: string }) => {
    const { data: workflow } = useSuspenseWorkflow(workflowId);
    const [nodes, setNodes] = useState<Node[]>(workflow.nodes);
    const [edges, setEdges] = useState<Edge[]>(workflow.edges);

    const setEditor = useSetAtom(editorAtom)

    const onNodesChange = useCallback(
        (changes: NodeChange[]) =>
            setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
        []
    );
    const onEdgesChange = useCallback(
        (changes: EdgeChange[]) =>
            setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
        []
    );
    const onConnect = useCallback(
        (params: Connection) => setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
        []
    );

    const hasManualTrigger = useMemo(() => {
        return nodes.some((node) => node.type === NodeType.MANUAL_TRIGGER);
    }, [nodes])

    return (
        <div className="size-full">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                fitView
                proOptions={{
                    hideAttribution: true
                }}
                nodeTypes={nodeComponents}
                onInit={setEditor}
                snapGrid={[10, 10]}
                snapToGrid
                panOnScroll
                panOnDrag={false}
                selectionOnDrag
            >
                <Background />
                <Controls />
                <MiniMap />
                <Panel position="top-right">
                    <AddNodeButton />
                </Panel>

                {hasManualTrigger && (
                    <Panel position="bottom-center">
                        <ExecuteWorkflowButton workflowId={workflowId}/>
                    </Panel>
                )}
            </ReactFlow>
        </div>
    );
};
