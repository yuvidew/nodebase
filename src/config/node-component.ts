import { InitialNode } from "@/components/initial-node";
import { AnthropicNode } from "@/features/executions/_components/anthropic/node";
import { DiscordNode } from "@/features/executions/_components/discord/node";
import { GeminiNode } from "@/features/executions/_components/gemini/node";
import { HttpRequestNode } from "@/features/executions/_components/http-request/node";
import { OpenAINode } from "@/features/executions/_components/openai/node";
import { SlackNode } from "@/features/executions/_components/slack/node";
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
    [NodeType.GEMINI] : GeminiNode,
    [NodeType.OPENAI] : OpenAINode,
    [NodeType.ANTHROPIC] : AnthropicNode,
    [NodeType.DISCORD] : DiscordNode,
    [NodeType.SLACK] : SlackNode,
} as const satisfies NodeTypes;

export type RegisterNodeType = keyof typeof nodeComponents