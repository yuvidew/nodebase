"use server";

import { getSubscriptionToken, type Realtime } from "@inngest/realtime";
import { inngest } from "@/inngest/client";
import { openAIChannel } from "@/inngest/channels/openai";

export type OpenaiToken = Realtime.Token<
    typeof openAIChannel,
    ["status"]
>;

export const fetchOpenaiRealtimeToken = async (): Promise<OpenaiToken> => {
    const token = await getSubscriptionToken(inngest, {
        channel: openAIChannel(),
        topics: ["status"]
    });

    return token;
};