import { InitialNode } from "@/components/initial-node";
import { HttpRequestNode } from "@/features/executions/_components/http-request/node";
import { ManualTriggerBode } from "@/features/triggers/_components/manual-trigger/node";
import { NodeType } from "@/generated/prisma";
import type { NodeTypes } from "@xyflow/react";

export const nodeComponents = {
    [NodeType.INITIAL] : InitialNode,
    [NodeType.HTTP_REQUEST] : HttpRequestNode,
    [NodeType.MANUAL_TRIGGER] : ManualTriggerBode,


} as const satisfies NodeTypes;

export type RegisterNodeType = keyof typeof nodeComponents