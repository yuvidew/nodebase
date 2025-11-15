import Handlebars from "handlebars";
import type { NodeExecutor } from "@/features/executions/types";
import { NonRetriableError } from "inngest";
import { decode } from "html-entities";
import ky from "ky";
import { slackChannel } from "@/inngest/channels/slack";

Handlebars.registerHelper("json", (context) => {
    const jsonStringified = JSON.stringify(context, null, 2);
    return new Handlebars.SafeString(jsonStringified);
});

export type SlackData = {
    variableName?: string;
    webhookUrl?: string;
    content?: string;
};

export const slackExecutor: NodeExecutor<SlackData> = async ({
    data,
    nodeId,
    context,
    step,
    publish
}) => {
    await publish(
        slackChannel().status({
            nodeId,
            status: "loading",
        }),
    );




    const rawContent = Handlebars.compile(data.content)(context);
    const content = decode(rawContent);



    try {

        const result = await step.run("Slack-webhook", async () => {
            if (!data.variableName) {
                await publish(
                    slackChannel().status({
                        nodeId,
                        status: "error",
                    }),
                );

                throw new NonRetriableError("Slack node: Variable name is missing");
            };

            if (!data.webhookUrl) {
                await publish(
                    slackChannel().status({
                        nodeId,
                        status: "error",
                    }),
                );

                throw new NonRetriableError("Slack node: Webhook URL is missing");
            };

            await ky.post(data.webhookUrl, {
                json: {
                    content: content, // The key depends on workflow config
                }
            });

            return {
                ...context,
                [data.variableName]: {
                    SlackMessageSent: true,
                    messageContent: content
                },
            }
        })

        await publish(
            slackChannel().status({
                nodeId,
                status: "success",
            }),
        );

        return result;
    } catch (error) {
        await publish(
            slackChannel().status({
                nodeId,
                status: "error",
            }),
        );

        throw error;
    }
}
