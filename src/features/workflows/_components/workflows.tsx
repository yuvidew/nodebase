"use client";

import React, { ReactNode } from 'react'
import { useCreateWorkflow, useRemoveWorkflow, useSuspenseWorkflows } from '../hooks/use-workflows'
import { EntityHeader } from '@/components/entity-components/entity-header';
import { EntityContainer } from '@/components/entity-components/entity-container';
import { useUpgradeModal } from '@/hooks/use-upgrade-modal';
import { useRouter } from 'next/navigation';
import { EntitySearch } from '@/components/entity-components/entity-search';
import { useWorkflowsParams } from '../hooks/use-workflows-params';
import { useEntitySearch } from '@/hooks/use-entity-search';
import { EntityPagination } from '@/components/entity-components/entity-pagination';
import { LoadingView } from '@/components/entity-components/loading-view';
import { ErrorView } from '@/components/entity-components/error-view';
import { EntityEmptyView } from '@/components/entity-components/entity-empty-view';
import { EntityList } from '@/components/entity-components/entity-list';
import type { workflow } from '@/generated/prisma';
import { EntityItem } from '@/components/entity-components/entity-item';
import {SplinePointerIcon} from "lucide-react";
import {formatDistanceToNow} from "date-fns" 

export const WorkflowsView = () => {
    const {mutate : onCreateWorkflow, isPending} = useCreateWorkflow();
    const {handleError, modal} = useUpgradeModal();
    const router = useRouter()

    const handleCreate = () => {
        onCreateWorkflow(undefined, {
            onSuccess : (data) => {
                router.push(`/workflows/${data.id}`)
            },
            onError: (error) => {
                handleError(error);
            },
        });
    };

    return (
        <>
            {modal}
            <EntityEmptyView
                message="You haven't created any workflows yet. Get started by creating your first workflows"
                isLoading = {isPending}
                onNew={handleCreate}
            />
        </>
    )
}

export const WorkflowsSearch = () => {
    const [params, setParams] = useWorkflowsParams();
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
    const {data} = useSuspenseWorkflows();

    return (
        <EntityList
            items={data.items}
            getKey={(workflow) => workflow.id}
            renderItem={(workflow) => <WorkflowItem data = {workflow} />}
            emptyView={<WorkflowsView/>}
        />
    )
};

export const WorkflowsHeader = ({ disabled }: { disabled?: boolean }) => {
    const router = useRouter();
    const { mutate, isPending } = useCreateWorkflow();
    const { handleError, modal } = useUpgradeModal()

    const onCreate = () => {
        mutate(undefined, {
            onSuccess: (data) => {
                router.push(`/workflows/${data.id}`)
            },
            onError: (error) => {
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
                onNew={onCreate}
                disabled={disabled}
                isCreating={isPending}
                newButtonLabel={isPending ? "Creating..." :'New workflow '}
            />
        </>
    );
};

export const WorkflowsPagination = () => {
    const { isFetching, data } = useSuspenseWorkflows();
    const [params, setParams] = useWorkflowsParams();

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

export const WorkflowsContainer = ({ children }: { children: ReactNode }) => {
    return (
        <EntityContainer
            header={<WorkflowsHeader />}
            search={<WorkflowsSearch />}
            pagination={<WorkflowsPagination />}
        >
            {children}
        </EntityContainer>
    )
}

export const WorkflowsLoading = () => {
    return <LoadingView message='Loading workflows...' />
}

export const WorkflowsError = () => {
    return <ErrorView message='Error loading workflows' />
}

export const WorkflowItem = ({
    data
} : {data: workflow}) => {
    const {mutate: onRemoveWorkflow, isPending} = useRemoveWorkflow();

    const handleRemoveWorkflow = () => {
        onRemoveWorkflow({id : data.id});
    }
    return (
        <EntityItem
            href={`/workflows/${data.id}`}
            title={data.name}
            subtitle={
                <>
                    Update {formatDistanceToNow(data.updatedAt, {addSuffix : true})}{" "}
                    &bull; Created{" "}
                    {formatDistanceToNow(data.createdAt, {addSuffix : true})}
                </>
            }
            image = {
                <div className=' size-8 flex items-center justify-center'>
                    <SplinePointerIcon className = "size-5 text-muted-foreground" />
                </div>
            }

            onRemove = {handleRemoveWorkflow}
            isRemoving = {isPending}
        />
    )
}

