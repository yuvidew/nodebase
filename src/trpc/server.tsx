import 'server-only'; // <-- ensure this file cannot be imported from the client
import {
    createTRPCOptionsProxy,
    TRPCInfiniteQueryOptions,
    TRPCQueryOptions,
    type ResolverDef,
} from '@trpc/tanstack-react-query';
import { cache } from 'react';
import { createTRPCContext } from './init';
import { makeQueryClient } from './query-client';
import { appRouter } from './routers/_app';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
// IMPORTANT: Create a stable getter for the query client that
//            will return the same client during the same request.
export const getQueryClient = cache(makeQueryClient);
export const trpc = createTRPCOptionsProxy({
    ctx: createTRPCContext,
    router: appRouter,
    queryClient: getQueryClient,
});

// ...
export const caller = appRouter.createCaller(createTRPCContext);


type TRPCQueryOptionsResult = ReturnType<TRPCQueryOptions<ResolverDef>>;
type TRPCInfiniteQueryOptionsResult = ReturnType<
    TRPCInfiniteQueryOptions<ResolverDef>
>;
type TRPCPrefetchOptions =
    | TRPCQueryOptionsResult
    | TRPCInfiniteQueryOptionsResult;

const isInfiniteQueryOptions = (
    options: TRPCPrefetchOptions,
): options is TRPCInfiniteQueryOptionsResult => {
    return options.queryKey[1]?.type === 'infinite';
};

export function prefetch(queryOptions: TRPCPrefetchOptions) {
    const queryClient = getQueryClient();
    if (isInfiniteQueryOptions(queryOptions)) {
        void queryClient.prefetchInfiniteQuery(queryOptions);
    } else {
        void queryClient.prefetchQuery(queryOptions);
    }
}

export function HydrateClient(props: { children: React.ReactNode }) {
    const queryClient = getQueryClient();
    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            {props.children}
        </HydrationBoundary>
    );
}
