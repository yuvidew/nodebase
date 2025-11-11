import Handlebars from "handlebars";
import type { NodeExecutor } from "@/features/executions/types";
import { NonRetriableError } from "inngest";
import { createOpenAI } from "@ai-sdk/openai";
import { generateText } from "ai"
import { openAIChannel } from "@/inngest/channels/openai";

Handlebars.registerHelper("json", (context) => {
    const jsonStringified = JSON.stringify(context, null, 2);
    return new Handlebars.SafeString(jsonStringified);
});

export type OpenAIData = {
    variableName?: string;
    systemPrompt?: string;
    userPrompt?: string
};

export const openAIExecutor: NodeExecutor<OpenAIData> = async ({
    data,
    nodeId,
    context,
    step,
    publish
}) => {
    await publish(
        openAIChannel().status({
            nodeId,
            status: "loading",
        }),
    );

    if (!data.variableName) {
        await publish(
            openAIChannel().status({
                nodeId,
                status: "error",
            }),
        );

        throw new NonRetriableError("OpenAI node: Variable name is missing");
    };

    if (!data.userPrompt) {
        await publish(
            openAIChannel().status({
                nodeId,
                status: "error",
            }),
        );

        throw new NonRetriableError("OpenAI node: User prompt is missing");
    };

    // TODO: Throw is credential is missing

    const systemPrompt = data.systemPrompt
        ? Handlebars.compile(data.systemPrompt)(context)
        : "Your are a helpful assistant.";

    const userPrompt = Handlebars.compile(data.userPrompt)(context);

    // TODO: Fetch credential that user selected

    const credentialValue = process.env.OPENAI_API_KEY!;

    const openAI = createOpenAI({
        apiKey: credentialValue,
    });

    try {
        const { steps } = await step.ai.wrap(
            "openai-generate-text",
            generateText,
            {
                model: openAI("gpt-4"),
                system: systemPrompt,
                prompt: userPrompt,
                experimental_telemetry: {
                    isEnabled: true,
                    recordInputs: true,
                    recordOutputs: true
                },
            },
        );


        const text = steps[0].content[0].type === "text"
            ? steps[0].content[0].text : "";

        await publish(
            openAIChannel().status({
                nodeId,
                status: "success",
            }),
        );

        return {
            ...context,
            [data.variableName]: {
                text
            }
        }
    } catch (error) {
        await publish(
            openAIChannel().status({
                nodeId,
                status: "error",
            }),
        );

        throw error;
    }
}
