
import { ExecutionsContainer, ExecutionsError, ExecutionsList, ExecutionsLoading } from '@/features/executions/_components/executions';
import { executionsParamsLoader } from '@/features/executions/server/params-loader';
import { prefetchExecutions } from '@/features/executions/server/prefetch';
import { requireAuth } from '@/lib/auth-utils';
import { HydrateClient } from '@/trpc/server';
import { SearchParams } from 'nuqs';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

type Props = {
    searchParams: Promise<SearchParams>
}

/**
 * Server-side credentials page that preloads data and renders with suspense boundaries.
 * @param {Props} props Component properties.
 * @param {Promise<SearchParams>} props.searchParams Incoming search params promise from the route.
 */

const CredentialsPage = async ({
    searchParams
}: Props) => {
    await requireAuth();

    const params = await executionsParamsLoader(searchParams)
    prefetchExecutions(params);

    return (
        <ExecutionsContainer>
            <HydrateClient>
                <ErrorBoundary fallback = {<ExecutionsError/>}>
                    <Suspense fallback = {<ExecutionsLoading/>}>
                        <ExecutionsList/>
                    </Suspense>
                </ErrorBoundary>
            </HydrateClient>
        </ExecutionsContainer>
    )
}

export default CredentialsPage