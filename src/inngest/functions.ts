
// import { NonRetriableError } from "inngest";
// import { inngest } from "./client";
// import prisma from "@/lib/db";
// import { topologicalSort } from "./utils";
// import { NodeType } from "@/generated/prisma";
// import { getExecutor } from "@/features/executions/lib/executor-registry";
// import { httpRequestChannel } from "./channels/http-request";
// import { manualTriggerChannel } from "./channels/manual-trigger";
// import { googleFormTriggerChannel } from "./channels/google-form-trigger";
// import { stripeTriggerChannel } from "./channels/stripe-trigger";
// import {geminiChannel} from "./channels/gemini"
// import { openAIChannel } from "./channels/openai";
// import { anthropicChannel } from "./channels/anthropic";



// export const executeWorkflow = inngest.createFunction(
//   { 
//     id: "execute-workflow",
//     retries : 0 //TODO: change for production
//   },
//   { 
//     event: "workflows/execute.workflow",
//     channels : [
//       httpRequestChannel(),
//       manualTriggerChannel(),
//       googleFormTriggerChannel(),
//       stripeTriggerChannel(),
//       geminiChannel(),
//       openAIChannel(),
//       anthropicChannel()
//     ], 
//   },
//   async ({ event, step ,publish}) => {
//     const workflowId = event.data.workflowId;

//     if (!workflowId) {
//       throw new NonRetriableError("Workflow ID is missing");
//     }

//     const sortedNodes = await step.run("prepare-workflow", async () => {
//       const workflow = await prisma.workflow.findUniqueOrThrow({
//         where : {id : workflowId},
//         include : {
//           nodes : true,
//           connections : true,
//         },
//       });

//       return topologicalSort(workflow.nodes, workflow.connections);
//     });

//     // Initialize context with any initial data from the trigger
//     let context = event.data.initialData || {};

//     // Execute each node
//     for(const node of sortedNodes){
//       const executor = getExecutor(node.type as NodeType);

//       context = await executor({
//         data : node.data as Record<string, unknown>,
//         nodeId : node.id,
//         context,
//         step,
//         publish
//       })
//     }

//     return {
//       workflowId,
//       result: context,
//     };
//   },
// );

// New file content below to solve this issue: 

/**
 * Type 'Record<string, unknown>' is missing the following properties from type 'HttpRequestData': variableName, endpoint, methodts(2739)
types.ts(9, 5): The expected type comes from property 'data' which is declared here on type 'NodeExecutorParams<HttpRequestData>'
(property) NodeExecutorParams<HttpRequestData>.data: HttpRequestData
 */

import { NonRetriableError } from "inngest";
import { inngest } from "./client";
import prisma from "@/lib/db";
import { topologicalSort } from "./utils";
import { ExecutionStatus, NodeType } from "@/generated/prisma";
import { getExecutor } from "@/features/executions/lib/executor-registry";
import type { NodeExecutor } from "@/features/executions/types";
import { httpRequestChannel } from "./channels/http-request";
import { manualTriggerChannel } from "./channels/manual-trigger";
import { googleFormTriggerChannel } from "./channels/google-form-trigger";
import { stripeTriggerChannel } from "./channels/stripe-trigger";
import {geminiChannel} from "./channels/gemini"
import { openAIChannel } from "./channels/openai";
import { anthropicChannel } from "./channels/anthropic";
import { discordChannel } from "./channels/discord";
import { slackChannel } from "./channels/slack";

const DEFAULT_RETRY_COUNT = process.env.NODE_ENV === "production" ? 3 : 0;

// const workflowRetries = (() => {
//   const override = process.env.INNGEST_WORKFLOW_RETRIES;

//   if (override !== undefined) {
//     const parsed = Number.parseInt(override, 10);

//     if (!Number.isNaN(parsed) && parsed >= 0) {
//       return parsed;
//     }
//   }

//   return DEFAULT_RETRY_COUNT;
// })();


export const executeWorkflow = inngest.createFunction(
  { 
    id: "execute-workflow",
    retries : DEFAULT_RETRY_COUNT,
    onFailure : async ({ event}) => {
      return prisma.execution.update({
        where : {
          inngestEventId: event.data.event.id,
        },
        data : {
          status : ExecutionStatus.FAILED,
          error : event.data.error.message,
          errorStack: event.data.error.stack,
        },
      });
    },
  },
  { 
    event: "workflows/execute.workflow",
    channels : [
      httpRequestChannel(),
      manualTriggerChannel(),
      googleFormTriggerChannel(),
      stripeTriggerChannel(),
      geminiChannel(),
      openAIChannel(),
      anthropicChannel(),
      discordChannel(),
      slackChannel()
    ], 
  },
  async ({ event, step ,publish}) => {
    const inngestEventId = event.id;
    const workflowId = event.data.workflowId;

    if (!workflowId || !inngestEventId) {
      throw new NonRetriableError("Event ID or Workflow ID is missing");
    };

    await step.run("create-execution", async () => {
      return prisma.execution.create({
        data : {
          workflowId,
          inngestEventId,
        },
      });
    });

    const sortedNodes = await step.run("prepare-workflow", async () => {
      const workflow = await prisma.workflow.findUniqueOrThrow({
        where : {id : workflowId},
        include : {
          nodes : true,
          connections : true,
        },
      });

      return topologicalSort(workflow.nodes, workflow.connections);
    });

    const userId = await step.run("find-user-id" , async () => {
      const workflow = await prisma.workflow.findUniqueOrThrow({
        where : {id : workflowId},
        select : {
          userId : true
        },
      });

      return workflow.userId
    })

    // Initialize context with any initial data from the trigger
    let context = event.data.initialData || {};

    // Execute each node
    for(const node of sortedNodes){
      const executor = getExecutor(node.type as NodeType) as NodeExecutor;

      context = await executor({
        data : node.data as Record<string, unknown>,
        nodeId : node.id,
        userId,
        context,
        step,
        publish
      })
    }

    await step.run("update-executions" , async () => {
      return prisma.execution.update({
        where : {inngestEventId, workflowId},
        data : {
          status : ExecutionStatus.SUCCESS,
          completedAt : new Date(),
          output : context,
        }
      })
    })

    return {
      workflowId,
      result: context,
    };
  },
);

