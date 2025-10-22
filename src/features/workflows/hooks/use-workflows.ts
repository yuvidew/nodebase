
import { useTRPC } from "@/trpc/client"
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { toast } from "sonner";

/**
 * Hook to fetch all workflows using suspense
 */

export const useSuspenseWorkflows = () => {
    const trpc = useTRPC();

    return useSuspenseQuery(trpc.workflows.getMany.queryOptions());
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
                trpc.workflows.getMany.queryOptions(),
            );
        },

        onError : (error) => {
            toast.error(`Failed to create workflow: ${error.message}`);
        },
    }));
};