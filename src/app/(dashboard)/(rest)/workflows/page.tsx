import React, { Suspense } from 'react';
import { WorkflowsContainer, WorkflowsList } from '@/features/workflows/_components/workflows';
import { prefetchWorkflows } from '@/features/workflows/server/prefetch';
import { requireAuth } from '@/lib/auth-utils';
import { HydrateClient } from '@/trpc/server';
import { ErrorBoundary } from "react-error-boundary";

const WorkflowPage = async () => {
    await requireAuth();

    prefetchWorkflows();
    return (
        <WorkflowsContainer>
            <HydrateClient>
                <ErrorBoundary fallback={<>Error</>}>
                    <Suspense fallback={<>Loading...</>}>
                        <WorkflowsList />
                    </Suspense>
                </ErrorBoundary>
            </HydrateClient>
        </WorkflowsContainer>
    )
}

export default WorkflowPage