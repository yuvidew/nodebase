"use client";

import { useTRPC } from "@/trpc/client";
import { Logout } from "./logout";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";


const Page =   () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient()
  const {data} = useQuery(trpc.getWorkflows.queryOptions());

  const {mutate , isPending} = useMutation(trpc.createWorkflow.mutationOptions({
    onSuccess : () => {
      queryClient.invalidateQueries(trpc.getWorkflows.queryOptions())
    }
  }));

  return (

    <div className=" min-h-screen min-w-screen flex flex-col items-center justify-center gap-y-5">
      Protected server component
    <div>

      {JSON.stringify(data, null ,2)}

    </div>
      <Button disabled = {isPending} onClick={() => mutate()}>
        Create Workflow
      </Button>

    <Logout/>
    </div>
  )
}

export default Page;