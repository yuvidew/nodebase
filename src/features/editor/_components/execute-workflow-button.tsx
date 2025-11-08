import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { useExecuteWorkflow } from '@/features/workflows/hooks/use-workflows';
import { FlaskConicalIcon } from 'lucide-react';
import React from 'react';

interface Props {
    workflowId: string
}

export const ExecuteWorkflowButton = ({ workflowId }: Props) => {
    const { mutate, isPending } = useExecuteWorkflow();

    const onExecuteWorkflow = () => {
        mutate({ id: workflowId })
    }

    return (
        <Button size={"lg"} onClick={onExecuteWorkflow} disabled={isPending}>
            {isPending ? (
                <>
                    <Spinner className=' size-4' />

                    Executing workflow
                </>
            ) : (

                <>
                    <FlaskConicalIcon className=' size-4' />

                    Execute workflow
                </>
            )}
        </Button>
    )
}
