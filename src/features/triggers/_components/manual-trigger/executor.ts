import type { NodeExecutor } from "@/features/executions/types";

type ManualTriggerData = Record<string, unknown>;

export const manualTriggerExecutor:NodeExecutor<ManualTriggerData> = async({
    data,
    nodeId,
    context,
    step
}) => {
    // TODO: published "loading" state fro manual trigger

    const result = await step.run("manual-trigger", async() => context);

    // TODO: publish "success" state for manual trigger

    return result;
}