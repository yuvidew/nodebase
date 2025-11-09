import { NodeProps } from '@xyflow/react'
import React, { memo, useState } from 'react'
import { BaseTriggerNode } from '../base-trigger-node';
import { GoogleFromTriggerDialog } from './dialog';
import { useNodeStatus } from '@/features/executions/hooks/use-node-status';
import { fetchGoogleFormTriggerRealtimeToken, } from './actions';
import { GOOGLE_FORM_TRIGGER_CHANNEL_NAME } from '@/inngest/channels/google-form-trigger';

export const GoogleFormTrigger = memo((props: NodeProps) => {
    const [dialogOpen, setDialogOpen] = useState(false);

    const nodeStatus = useNodeStatus({
            nodeId: props.id,
            channel: GOOGLE_FORM_TRIGGER_CHANNEL_NAME,
            topic: "status",
            refreshToken: fetchGoogleFormTriggerRealtimeToken
        });

    const handleOpenSetting = () => setDialogOpen(true);


    return (
        <>
            <GoogleFromTriggerDialog open={dialogOpen} onOpenChange={setDialogOpen} />
            <BaseTriggerNode
                {...props}
                icon={"/googleform.svg"}
                name="Google Form"
                description="When from is submitted"
                status={nodeStatus}
                onSetting={handleOpenSetting}
                onDoubleClick={handleOpenSetting}
            />
        </>
    )
});

GoogleFormTrigger.displayName = "GoogleFormTrigger"
