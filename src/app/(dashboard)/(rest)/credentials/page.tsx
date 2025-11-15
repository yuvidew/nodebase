import { CredentialsContainer, CredentialsError, CredentialsList, CredentialsLoading } from '@/features/credentials/_components/credentials';
import { credentialsParamsLoader } from '@/features/credentials/server/params-loader';
import { prefetchCredentials } from '@/features/credentials/server/prefetch';
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

    const params = await credentialsParamsLoader(searchParams)
    prefetchCredentials(params);

    return (
        <CredentialsContainer>
            <HydrateClient>
                <ErrorBoundary fallback = {<CredentialsError/>}>
                    <Suspense fallback = {<CredentialsLoading/>}>
                        <CredentialsList/>
                    </Suspense>
                </ErrorBoundary>
            </HydrateClient>
        </CredentialsContainer>
    )
}

export default CredentialsPage