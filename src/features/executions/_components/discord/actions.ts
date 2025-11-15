"use server";

import { getSubscriptionToken, type Realtime } from "@inngest/realtime";
import { inngest } from "@/inngest/client";
import { discordChannel } from "@/inngest/channels/discord";

export type DiscordToken = Realtime.Token<
    typeof discordChannel,
    ["status"]
>;

export const fetchDiscordRealtimeToken = async (): Promise<DiscordToken> => {
    const token = await getSubscriptionToken(inngest, {
        channel: discordChannel(),
        topics: ["status"]
    });

    return token;
};