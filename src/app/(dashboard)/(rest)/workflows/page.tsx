import React, { Suspense } from 'react';
import { WorkflowsContainer, WorkflowsError, WorkflowsList, WorkflowsLoading } from '@/features/workflows/_components/workflows';
import { prefetchWorkflows } from '@/features/workflows/server/prefetch';
import { requireAuth } from '@/lib/auth-utils';
import { HydrateClient } from '@/trpc/server';
import { ErrorBoundary } from "react-error-boundary";
import { SearchParams } from 'nuqs/server';
import { workflowsParamsLoader } from '@/features/workflows/server/params-loader';

type Props = {
    searchParams : Promise<SearchParams>
}

/**
 * Server-side workflows page that preloads data and renders with suspense boundaries.
 * @param {Props} props Component properties.
 * @param {Promise<SearchParams>} props.searchParams Incoming search params promise from the route.
 */
const WorkflowPage = async ({searchParams} : Props) => {
    await requireAuth();

    const params = await workflowsParamsLoader(searchParams)
    prefetchWorkflows(params);
    
    return (
        <WorkflowsContainer>
            <HydrateClient>
                <ErrorBoundary fallback={<WorkflowsError/>}>
                    <Suspense fallback={<WorkflowsLoading/>}>
                        <WorkflowsList />
                    </Suspense>
                </ErrorBoundary>
            </HydrateClient>
        </WorkflowsContainer>
    )
}

export default WorkflowPage
