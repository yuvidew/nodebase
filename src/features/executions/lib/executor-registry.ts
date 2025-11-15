import { NodeType } from "@/generated/prisma";
import { NodeExecutor } from "../types";
import { manualTriggerExecutor } from "@/features/triggers/_components/manual-trigger/executor";
import { httpRequestExecutor, type HttpRequestData } from "../_components/http-request/executor";
import { googleFromTriggerExecutor } from "@/features/triggers/_components/google-form-trigger/executor";
import { stripeTriggerExecutor } from "@/features/triggers/_components/stripe-trigger/executor";
import { geminiExecutor } from "../_components/gemini/executor";
import { openAIExecutor } from "../_components/openai/executor";
import { anthropicExecutor } from "../_components/anthropic/executor";
import { discordExecutor } from "../_components/discord/executor";
import { slackExecutor } from "../_components/slack/executor";

type DefaultNodeData = Record<string, unknown>;

type NodeDataByType = {
    [NodeType.INITIAL]: DefaultNodeData;
    [NodeType.MANUAL_TRIGGER]: DefaultNodeData;
    [NodeType.HTTP_REQUEST]: HttpRequestData;
    [NodeType.GOOGLE_FORM_TRIGGER]: DefaultNodeData;
    [NodeType.STRIPE_TRIGGER]: DefaultNodeData;
    [NodeType.GEMINI] : DefaultNodeData;
    [NodeType.OPENAI] : DefaultNodeData;
    [NodeType.ANTHROPIC] : DefaultNodeData;
    [NodeType.DISCORD] : DefaultNodeData;
    [NodeType.SLACK] : DefaultNodeData;
};

type ExecutorRegistry = {
    [TType in keyof NodeDataByType]: NodeExecutor<NodeDataByType[TType]>;
};

export const executorRegistry: ExecutorRegistry = {
    [NodeType.INITIAL]: manualTriggerExecutor,
    [NodeType.MANUAL_TRIGGER]: manualTriggerExecutor,
    [NodeType.HTTP_REQUEST]: httpRequestExecutor,
    [NodeType.GOOGLE_FORM_TRIGGER]: googleFromTriggerExecutor,
    [NodeType.STRIPE_TRIGGER]: stripeTriggerExecutor,
    [NodeType.GEMINI] : geminiExecutor,
    [NodeType.ANTHROPIC] : anthropicExecutor,
    [NodeType.OPENAI] : openAIExecutor,
    [NodeType.DISCORD] : discordExecutor,
    [NodeType.SLACK] : slackExecutor,
};

export const getExecutor = <TType extends keyof ExecutorRegistry>(type: TType): ExecutorRegistry[TType] => {
    const executor = executorRegistry[type];

    if (!executor) {
        throw new Error(`No executor found for node type: ${type}`);
    }

    return executor;
};
