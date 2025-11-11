
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
import { NodeType } from "@/generated/prisma";
import { getExecutor } from "@/features/executions/lib/executor-registry";
import type { NodeExecutor } from "@/features/executions/types";
import { httpRequestChannel } from "./channels/http-request";
import { manualTriggerChannel } from "./channels/manual-trigger";
import { googleFormTriggerChannel } from "./channels/google-form-trigger";
import { stripeTriggerChannel } from "./channels/stripe-trigger";
import {geminiChannel} from "./channels/gemini"
import { openAIChannel } from "./channels/openai";
import { anthropicChannel } from "./channels/anthropic";



export const executeWorkflow = inngest.createFunction(
  { 
    id: "execute-workflow",
    retries : 0 //TODO: change for production
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
      anthropicChannel()
    ], 
  },
  async ({ event, step ,publish}) => {
    const workflowId = event.data.workflowId;

    if (!workflowId) {
      throw new NonRetriableError("Workflow ID is missing");
    }

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

    // Initialize context with any initial data from the trigger
    let context = event.data.initialData || {};

    // Execute each node
    for(const node of sortedNodes){
      const executor = getExecutor(node.type as NodeType) as NodeExecutor;

      context = await executor({
        data : node.data as Record<string, unknown>,
        nodeId : node.id,
        context,
        step,
        publish
      })
    }

    return {
      workflowId,
      result: context,
    };
  },
);

