"use client";

import React, { ReactNode } from 'react'
import {  useRemoveCredential, useSuspenseCredentials } from '../hooks/use-credentials'
import { EntityHeader } from '@/components/entity-components/entity-header';
import { EntityContainer } from '@/components/entity-components/entity-container';

import { useRouter } from 'next/navigation';
import { EntitySearch } from '@/components/entity-components/entity-search';
import { useCredentialsParams } from '../hooks/use-credentials-params';
import { useEntitySearch } from '@/hooks/use-entity-search';
import { EntityPagination } from '@/components/entity-components/entity-pagination';
import { LoadingView } from '@/components/entity-components/loading-view';
import { ErrorView } from '@/components/entity-components/error-view';
import { EntityEmptyView } from '@/components/entity-components/entity-empty-view';
import { EntityList } from '@/components/entity-components/entity-list';
import { Credential, CredentialType } from '@/generated/prisma';
import { EntityItem } from '@/components/entity-components/entity-item';
import { formatDistanceToNow } from "date-fns"
import Image from 'next/image';

export const CredentialsView = () => {
    const router = useRouter()

    const handleCreate = () => {
        router.push(`/credentials/new`)
    };

    return (
        <EntityEmptyView
            message="You haven't created any credential yet. Get started by creating your first credentials"
            onNew={handleCreate}
            label='Add credential'
            empty_label='No credential'
        />
    )
}

export const CredentialsSearch = () => {
    const [params, setParams] = useCredentialsParams();
    const { searchValue, onSearchChange } = useEntitySearch({ params, setParams });
    return (
        <EntitySearch
            value={searchValue}
            onChange={onSearchChange}
            placeholder='Search credential'
        />
    )
}



export const CredentialsList = () => {
    const { data } = useSuspenseCredentials();

    return (
        <EntityList
            items={data.items}
            getKey={(credential) => credential.id}
            renderItem={(credential) => <CredentialItem data={credential} />}
            emptyView={<CredentialsView />}
        />
    )
};

export const CredentialHeader = ({ disabled }: { disabled?: boolean }) => {


    return (
        <EntityHeader
            title='Credentials'
            description='Create and manage your credentials'
            newButtonHref={`/credentials/new`}
            disabled={disabled}
            newButtonLabel={'New credential'}
        />
    );
};

export const CredentialsPagination = () => {
    const { isFetching, data } = useSuspenseCredentials();
    const [params, setParams] = useCredentialsParams();

    return (
        <EntityPagination
            disabled={isFetching}
            page={data.page}
            totalPages={data.totalPages}
            onPageChange={(page) => setParams({
                ...params,
                page
            })}
        />
    )
}

export const CredentialsContainer = ({ children }: { children: ReactNode }) => {
    return (
        <EntityContainer
            header={<CredentialHeader />}
            search={<CredentialsSearch />}
            pagination={<CredentialsPagination />}
        >
            {children}
        </EntityContainer>
    )
}

export const CredentialsLoading = () => {
    return <LoadingView message='Loading credentials...' />
};

export const CredentialsError = () => {
    return <ErrorView message='Error loading credentials' />
};

const credentialLogos: Record<CredentialType, string> = {
    [CredentialType.OPENAI] : "/openai.svg",
    [CredentialType.GEMINI] : "/gemini.svg",
    [CredentialType.ANTHROPIC] : "/anthropic.svg",
}

export const CredentialItem = ({
    data
}: { data: Credential }) => {
    const { mutate: onRemoveCredential, isPending } = useRemoveCredential();

    const handleRemoveCredential = () => {
        onRemoveCredential({ id: data.id });
    }
    return (
        <EntityItem
            href={`/credentials/${data.id}`}
            title={data.name}
            subtitle={
                <>
                    Update {formatDistanceToNow(data.updatedAt, { addSuffix: true })}{" "}
                    &bull; Created{" "}
                    {formatDistanceToNow(data.createdAt, { addSuffix: true })}
                </>
            }
            image={
                <div className=' size-8 flex items-center justify-center'>
                    {/* <SplinePointerIcon className="size-5 text-muted-foreground" /> */}
                    <Image 
                        src={credentialLogos[data.type]}
                        alt = {data.name}
                        width={18}
                        height={18}
                    />
                </div>
            }

            onRemove={handleRemoveCredential}
            isRemoving={isPending}
        />
    )
}

