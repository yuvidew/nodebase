import { NodeType } from "@/generated/prisma";
import { NodeExecutor } from "../types";
import { manualTriggerExecutor } from "@/features/triggers/_components/manual-trigger/executor";
import { httpRequestExecutor } from "../_components/http-request/executor";
import { googleFromTriggerExecutor } from '@/features/triggers/_components/google-form-trigger/executor';

export const executorRegistry: Record<NodeType, NodeExecutor> = {
    [NodeType.INITIAL] : manualTriggerExecutor,
    [NodeType.MANUAL_TRIGGER] : manualTriggerExecutor,
    [NodeType.HTTP_REQUEST] : httpRequestExecutor, //TODO: fix that issue
    [NodeType.GOOGLE_FORM_TRIGGER] : googleFromTriggerExecutor, 

};

export const getExecutor = (type: NodeType): NodeExecutor => {
    const executor = executorRegistry[type];

    if (!executor) {
        throw new Error(`No executor found for node type: ${type}`)
    };

    return executor;
}