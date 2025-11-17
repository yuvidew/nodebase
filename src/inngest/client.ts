import { Inngest } from "inngest";
import { realtimeMiddleware } from "@inngest/realtime/middleware";

const requiredInngestEnv = [
    "INNGEST_EVENT_KEY",
    "INNGEST_SIGNING_KEY"
];

const missingKeys = requiredInngestEnv.filter(
    (key) => !process.env[key]?.trim(),
);

if (missingKeys.length > 0) {
    throw new Error(
        `Missing environment variable${missingKeys.length > 1 ? "s" : ""}: ${missingKeys.join(
            ", ",
        )}. These are required for Inngest realtime tokens (see README).`,
    );
}

// Create a client to send and receive events
export const inngest = new Inngest({
    id: "nodebase",
    eventKey: process.env.INNGEST_EVENT_KEY,
    middleware: [realtimeMiddleware()],
});
