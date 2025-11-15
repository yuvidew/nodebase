import Handlebars from "handlebars";
import type { NodeExecutor } from "@/features/executions/types";
import { NonRetriableError } from "inngest";
import { discordChannel } from "@/inngest/channels/discord";
import { decode } from "html-entities";
import ky from "ky";

Handlebars.registerHelper("json", (context) => {
    const jsonStringified = JSON.stringify(context, null, 2);
    return new Handlebars.SafeString(jsonStringified);
});

export type DiscordData = {
    variableName?: string;
    webhookUrl?: string;
    content?: string;
    username?: string
};

export const discordExecutor: NodeExecutor<DiscordData> = async ({
    data,
    nodeId,
    context,
    step,
    publish
}) => {
    await publish(
        discordChannel().status({
            nodeId,
            status: "loading",
        }),
    );


    if (!data.username) {
        await publish(
            discordChannel().status({
                nodeId,
                status: "error",
            }),
        );

        throw new NonRetriableError("Discord node: User name is missing");
    };


    const rawContent = Handlebars.compile(data.content)(context);
    const content = decode(rawContent);
    const username = data.username
        ? decode(Handlebars.compile(data.username)(context))
        : undefined;



    try {

        const result = await step.run("discord-webhook", async () => {
            if (!data.variableName) {
                await publish(
                    discordChannel().status({
                        nodeId,
                        status: "error",
                    }),
                );

                throw new NonRetriableError("Discord node: Variable name is missing");
            };

            if (!data.webhookUrl) {
                await publish(
                    discordChannel().status({
                        nodeId,
                        status: "error",
                    }),
                );

                throw new NonRetriableError("Discord node: Webhook URL is missing");
            };

            await ky.post(data.webhookUrl, {
                json: {
                    content: content.slice(0, 2000), // Discord's max message length
                    username,
                }
            });

            return {
                ...context,
                [data.variableName]: {
                    discordMessageSent: true,
                    messageContent: content.slice(0, 2000)
                },
            }
        })

        await publish(
            discordChannel().status({
                nodeId,
                status: "success",
            }),
        );

        return result;
    } catch (error) {
        await publish(
            discordChannel().status({
                nodeId,
                status: "error",
            }),
        );

        throw error;
    }
}
