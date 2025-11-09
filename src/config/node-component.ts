import { InitialNode } from "@/components/initial-node";
import { HttpRequestNode } from "@/features/executions/_components/http-request/node";
import { GoogleFormTrigger } from "@/features/triggers/_components/google-form-trigger/node";
import { ManualTriggerBode } from "@/features/triggers/_components/manual-trigger/node";
import { StripTriggerNode } from "@/features/triggers/_components/stripe-trigger/node";


import { NodeType } from "@/generated/prisma";
import type { NodeTypes } from "@xyflow/react";

export const nodeComponents = {
    [NodeType.INITIAL] : InitialNode,
    [NodeType.HTTP_REQUEST] : HttpRequestNode,
    [NodeType.MANUAL_TRIGGER] : ManualTriggerBode,
    [NodeType.GOOGLE_FORM_TRIGGER] : GoogleFormTrigger,
    [NodeType.STRIPE_TRIGGER] : StripTriggerNode,
} as const satisfies NodeTypes;

export type RegisterNodeType = keyof typeof nodeComponents