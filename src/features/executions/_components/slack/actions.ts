"use server";

import { getSubscriptionToken, type Realtime } from "@inngest/realtime";
import { inngest } from "@/inngest/client";
import { slackChannel } from "@/inngest/channels/slack";

export type SlackToken = Realtime.Token<
    typeof slackChannel,
    ["status"]
>;

export const fetchSlackRealtimeToken = async (): Promise<SlackToken> => {
    const token = await getSubscriptionToken(inngest, {
        channel: slackChannel(),
        topics: ["status"]
    });

    return token;
};