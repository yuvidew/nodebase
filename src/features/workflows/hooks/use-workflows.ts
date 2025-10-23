
import { useTRPC } from "@/trpc/client"
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { useWorkflowsParams } from "./use-workflows-params";

/**
 * Hook to fetch all workflows using suspense
 */

export const useSuspenseWorkflows = () => {
    const trpc = useTRPC();
    const [params] = useWorkflowsParams();

    return useSuspenseQuery(trpc.workflows.getMany.queryOptions(params));
}

/**
 * hook to create new workflow
 */

export const useCreateWorkflow = () => {
    const queryClient = useQueryClient();
    const trpc = useTRPC();
    

    return useMutation(trpc.workflows.create.mutationOptions({
        onSuccess : (data) => {
            toast.success(`Workflow "${data.name}" created`);

            queryClient.invalidateQueries(
                trpc.workflows.getMany.queryOptions({}),
            );
        },

        onError : (error) => {
            toast.error(`Failed to create workflow: ${error.message}`);
        },
    }));
};

/**
 * Hook to remove workflow
 */

export const useRemoveWorkflow = () => {
    const queryClient = useQueryClient();
    const trpc = useTRPC();

    return useMutation(trpc.workflows.remove.mutationOptions({
        onSuccess : (data) => {
            toast.success(`Workflow "${data.name}" removed`);

            queryClient.invalidateQueries(
                trpc.workflows.getMany.queryOptions({}),
            );

            queryClient.invalidateQueries(
                trpc.workflows.getOne.queryFilter({id : data.id}),
            );
        },

        onError : (error) => {
            toast.error(`Failed to remove workflow: ${error.message}`);
        },
    }))
}

/**
 * Hook to fetch a single workflow by id
 */

export const useSuspenseWorkflow = (id : string) => {
    const trpc = useTRPC();

    return useSuspenseQuery(trpc.workflows.getOne.queryOptions({id}));
}


/**
 * hook to update workflow name
 */

export const useUpdateWorkflowName = () => {
    const queryClient = useQueryClient();
    const trpc = useTRPC();
    

    return useMutation(trpc.workflows.updateName.mutationOptions({
        onSuccess : (data) => {
            toast.success(`Workflow "${data.name}" updated`);

            queryClient.invalidateQueries(
                trpc.workflows.getMany.queryOptions({}),
            );

            queryClient.invalidateQueries(
                trpc.workflows.getOne.queryFilter({id : data.id}),
            );
        },

        onError : (error) => {
            toast.error(`Failed to update workflow: ${error.message}`);
        },
    }));
};
