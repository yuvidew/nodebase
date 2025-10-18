

import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { UserList } from "./user-list";
import { Suspense } from "react";

// import { useTRPC } from "@/trpc/client";
// import { useQuery } from "@tanstack/react-query";

const Page =  async () => {
  const queryClient = getQueryClient();

  void queryClient.prefetchQuery(trpc.getUsers.queryOptions());

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>

    <div className=" min-h-screen min-w-screen flex items-center justify-center">
      <Suspense fallback = {<h2>Loading...</h2>}>

      <UserList/>
      </Suspense>
    </div>
    </HydrationBoundary>
  )
}

export default Page;