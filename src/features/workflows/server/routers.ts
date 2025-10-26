import { PAGINATION } from "@/config/constants";
import { NodeType } from "@/generated/prisma";
import prisma from "@/lib/db";
import { createTRPCRouter, premiumProcedure, protectedProcedure } from "@/trpc/init";
import { generateSlug } from "random-word-slugs";
import z from "zod";

import type { Node, Edge } from "@xyflow/react"
import { InputOTPSlot } from "@/components/ui/input-otp";

export const workflowsRouter = createTRPCRouter({
    create: premiumProcedure.mutation(({ ctx }) => {
        return prisma.workflow.create({
            data: {
                name: generateSlug(3),
                userId: ctx.auth.user.id,
                nodes: {
                    create: {
                        type: NodeType.INITIAL,
                        position: { x: 0, y: 0 },
                        name: NodeType.INITIAL
                    },
                },
            },
        });
    }),

    // Remove the data by the current user id and delete by the id
    remove: protectedProcedure
        .input(z.object({ id: z.string() }))
        .mutation(({ ctx, input }) => {
            return prisma.workflow.delete({
                where: {
                    id: input.id,
                    userId: ctx.auth.user.id
                },
            })
        }),

    updateName: protectedProcedure
        .input(z.object({ id: z.string(), name: z.string().min(1) }))
        .mutation(({ ctx, input }) => {
            return prisma.workflow.update({
                where: {
                    id: input.id,
                    userId: ctx.auth.user.id,
                },
                data: {
                    name: input.name,
                },
            });
        }),
    update: protectedProcedure
        .input(
            z.object({ 
                id: z.string(), 
                nodes : z.array(
                    z.object({
                        id: z.string(),
                        type : z.string().nullish(),
                        position : z.object({
                            x: z.number(),
                            y: z.number()
                        }),
                        data: z.record(z.string(), z.any()).optional(), 
                    }),
                ), 
                edges: z.array(
                    z.object({
                        source: z.string(),
                        target: z.string(),
                        sourceHandle: z.string().nullish(),
                        targetHandle: z.string().nullish(),
                    })
                )
            }),
        )
        .mutation(async({ ctx, input }) => {
            const { id , nodes, edges} = input
            
            const workflow = await  prisma.workflow.findUniqueOrThrow({
                where: {
                    id: input.id,
                    userId: ctx.auth.user.id,
                },
            });

            // Transaction to ensure consistency

            return await prisma.$transaction(async (tx) => {
                // Delete existing nodes and connection (cascade deletes connection)
                await tx.node.deleteMany({
                    where: {workflowId : id},
                });

                // create nodes
                await tx.node.createMany({
                    data: nodes.map((node) => ({
                        id: node.id,
                        workflowId : id,
                        name: node.type || "unknown",
                        type: node.type as NodeType,
                        position: node.position,
                        data: node.data || {}
                    })),
                });

                // create connection
                await tx.connection.createMany({
                    data: edges.map((edge) => ({
                        workflowId : id,
                        fromNodeId: edge.source,
                        toNodeId: edge.target,
                        fromOutput: edge.sourceHandle || "main",
                        toInput: edge.targetHandle || "main",
                    })),
                });

                //  Update workflow's updateAt timestamp
                await tx.workflow.update({
                    where : {id},
                    data: {updatedAt : new Date()},
                });

                return workflow
            });
        }),
    getOne: protectedProcedure
        .input(z.object({ id: z.string() }))
        .query(async ({ ctx, input }) => {
            const workflow = await prisma.workflow.findUniqueOrThrow({
                where: {
                    id: input.id,
                    userId: ctx.auth.user.id,
                },
                include: { nodes: true, connections: true }
            });

            // Transforming server nodes to react-flow compatible nodes
            const nodes: Node[] = workflow.nodes.map((node) => ({
                id: node.id,
                type: node.type,
                position: node.position as { x: number, y: number },
                data: (node.data as Record<string, unknown>) || {},
            }));

            // Transforming server connections to react-flow compatible edges

            const edges: Edge[] = workflow.connections.map((connection) => ({
                id: connection.id,
                source: connection.fromNodeId,
                target: connection.toNodeId,
                sourceHandle: connection.fromOutput,
                targetHandle: connection.toInput
            }));

            return { 
                id : workflow.id,
                name : workflow.name,
                nodes, 
                edges, 
            };
        }),

    getMany: protectedProcedure
        .input(
            z.object({
                page: z.number().default(PAGINATION.DEFAULT_PAGE),
                pageSize: z
                    .number()
                    .min(PAGINATION.MIN_PAGE_SIZE)
                    .max(PAGINATION.MAX_PAGE_SIZE)
                    .default(PAGINATION.DEFAULT_PAGE_SIZE),
                search: z.string().default("")
            })
        )
        .query(async ({ ctx, input }) => {
            const { page, pageSize, search } = input;

            const [items, totalCount] = await Promise.all([
                prisma.workflow.findMany({
                    skip: (page - 1) * pageSize,
                    take: pageSize,
                    where: {
                        userId: ctx.auth.user.id,
                        name: {
                            contains: search,
                            mode: "insensitive",
                        },
                    },
                    orderBy: {
                        updatedAt: "desc",
                    },
                }),
                prisma.workflow.count({
                    where: {
                        userId: ctx.auth.user.id,
                        name: {
                            contains: search,
                            mode: "insensitive",
                        },
                    },
                }),
            ]);

            const totalPages = Math.ceil(totalCount / pageSize);
            const hasNextPage = page < totalPages;
            const hasPreviousPage = page > 1;

            return {
                items,
                page,
                pageSize,
                totalCount,
                hasNextPage,
                hasPreviousPage,
                totalPages
            };

        }),
});