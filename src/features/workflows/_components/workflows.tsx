"use client";

import React, { ReactNode } from 'react'
import { useCreateWorkflow, useSuspenseWorkflows } from '../hooks/use-workflows'
import { EntityHeader } from '@/components/entity-components/entity-header';
import { EntityContainer } from '@/components/entity-components/entity-container';
import { useUpgradeModal } from '@/hooks/use-upgrade-modal';
import { useRouter } from 'next/navigation';
import { EntitySearch } from '@/components/entity-components/entity-search';
import { useWorkflowsParams } from '../hooks/use-workflows-params';
import { useEntitySearch } from '@/hooks/use-entity-search';
import { EntityPagination } from '@/components/entity-components/entity-pagination';

export const WorkflowsSearch = () => {
    const [params , setParams] = useWorkflowsParams();
    const { searchValue, onSearchChange } = useEntitySearch({ params, setParams });
    return (
        <EntitySearch
            value={searchValue}
            onChange={onSearchChange}
            placeholder='Search workflows'
        />
    )
}

export const WorkflowsList = () => {
    const workflows = useSuspenseWorkflows();
    return (
        <div>
            workflowsList : {JSON.stringify(workflows.data, null, 2)}
        </div>
    );
};

export const WorkflowsHeader = ({ disabled }: { disabled?: boolean }) => {
    const router = useRouter();
    const {mutate , isPending} = useCreateWorkflow();
    const {handleError, modal} = useUpgradeModal()

    const onCreate = () => {
        mutate(undefined, {
            onSuccess : (data) => {
                router.push(`/workflows/${data.id}`)
            },
            onError : (error) => {
                handleError(error);
            }
        });
    };

    return (
        <>
            {modal}
            <EntityHeader
                title='Workflows'
                description='Create and manage your workflows'
                onNew = {onCreate}
                disabled = {disabled}
                isCreating = {isPending}
                newButtonLabel='New workflow'
            />
        </>
    );
};

export const WorkflowsPagination = () => {
    const {isFetching, data} = useSuspenseWorkflows();
    const [params , setParams] = useWorkflowsParams();

    return (
        <EntityPagination
            disabled = {isFetching}
            page = {data.page}
            totalPages={data.totalPages}
            onPageChange={(page) => setParams({
                ...params,
                page
            })}
        />
    )
}

export const WorkflowsContainer = ({children} : {children: ReactNode}) => {
    return (
        <EntityContainer
            header = {<WorkflowsHeader/>}
            search = {<WorkflowsSearch/>}
            pagination = {<WorkflowsPagination/>}
        >
            {children}
        </EntityContainer>
    )
}
