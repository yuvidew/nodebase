"use client";

import React, { ReactNode } from 'react'
import { useSuspenseExecutions } from '../hooks/use-executions'
import { EntityHeader } from '@/components/entity-components/entity-header';
import { EntityContainer } from '@/components/entity-components/entity-container';
import { useExecutionsParams } from '../hooks/use-executions-params';
import { EntityPagination } from '@/components/entity-components/entity-pagination';
import { LoadingView } from '@/components/entity-components/loading-view';
import { ErrorView } from '@/components/entity-components/error-view';
import { EntityEmptyView } from '@/components/entity-components/entity-empty-view';
import { EntityList } from '@/components/entity-components/entity-list';
import { Execution, ExecutionStatus } from '@/generated/prisma';
import { EntityItem } from '@/components/entity-components/entity-item';
import { formatDistanceToNow } from "date-fns"
import { CheckCircle2Icon, ClockIcon, Loader2Icon, XCircleIcon } from 'lucide-react';

export const ExecutionsView = () => {


    return (
        <EntityEmptyView
            message="You haven't created any executions yet. Get started by running your first workflow"
            empty_label='No executions'
        />
    )
}





export const ExecutionsList = () => {
    const { data } = useSuspenseExecutions();

    return (
        <EntityList
            items={data.items}
            getKey={(execution) => execution.id}
            renderItem={(execution) => <ExecutionItem data={execution} />}
            emptyView={<ExecutionsView />}
        />
    )
};

export const ExecutionHeader = () => {


    return (
        <EntityHeader
            title='Executions'
            description='View your workflow executions history'
        />
    );
};

export const ExecutionsPagination = () => {
    const { isFetching, data } = useSuspenseExecutions();
    const [params, setParams] = useExecutionsParams();

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

export const ExecutionsContainer = ({ children }: { children: ReactNode }) => {
    return (
        <EntityContainer
            header={<ExecutionHeader />}
            pagination={<ExecutionsPagination />}
        >
            {children}
        </EntityContainer>
    )
}

export const ExecutionsLoading = () => {
    return <LoadingView message='Loading executions...' />
};

export const ExecutionsError = () => {
    return <ErrorView message='Error loading executions' />
};

const getStatusIcon = (status: ExecutionStatus) => {
    switch (status) {
        case ExecutionStatus.SUCCESS:
            return <CheckCircle2Icon className='size-5 text-green-600' />;
        case ExecutionStatus.FAILED:
            return <XCircleIcon className='size-5 text-red-600' />;
        case ExecutionStatus.RUNNING:
            return <Loader2Icon className='size-5 text-blue-600 animate-spin' />;
        default:
            return <ClockIcon className='size-5 text-muted-foreground' />;

    }
}

const formatStatus = (status: ExecutionStatus) =>{
    return status.charAt(0) + status.slice(1).toLowerCase();
}

export const ExecutionItem = ({
    data
}: {
    data: Execution & {
        workflow: {
            id: string;
            name: string;
        };
    }
}) => {

    const duration = data.completedAt
        ? Math.round(
            (new Date(data.completedAt).getTime() - new Date(data.startedAt).getTime()) / 1000,
        )
        : null;

    const subtitle = (
        <>
            {data.workflow.name} &bull; Started{" "}
            {formatDistanceToNow(data.startedAt, { addSuffix: true })}
            {duration !== null && <> &bull; Took {duration}s </>}
        </>
    );

    return (
        <EntityItem
            href={`/executions/${data.id}`}
            title={formatStatus(data.status)}
            subtitle={subtitle}
            image={
                <div className=' size-8 flex items-center justify-center'>
                    {getStatusIcon(data.status)}
                </div>
            }
        />
    )
}

