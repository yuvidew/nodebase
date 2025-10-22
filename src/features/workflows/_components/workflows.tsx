"use client";

import React, { ReactNode } from 'react'
import { useCreateWorkflow, useSuspenseWorkflows } from '../hooks/use-workflows'
import { EntityHeader } from '@/components/entity-components/entity-header';
import { EntityContainer } from '@/components/entity-components/entity-container';
import { useUpgradeModal } from '@/hooks/use-upgrade-modal';
import { useRouter } from 'next/navigation';

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

export const WorkflowsContainer = ({children} : {children: ReactNode}) => {
    return (
        <EntityContainer
            header = {<WorkflowsHeader/>}
            search = {<></>}
            pagination = {<></>}
        >
            {children}
        </EntityContainer>
    )
}
