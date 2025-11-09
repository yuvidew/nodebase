import { NodeProps } from '@xyflow/react'
import React, { memo, useState } from 'react'
import { BaseTriggerNode } from '../base-trigger-node';
import { useNodeStatus } from '@/features/executions/hooks/use-node-status';

import { StripeTriggerDialog } from './dialog';
import { STRIPE_TRIGGER_CHANNEL_NAME } from '@/inngest/channels/stripe-trigger';
import { stripeTriggerTriggerRealtimeToken } from './actions';

export const StripTriggerNode = memo((props: NodeProps) => {
    const [dialogOpen, setDialogOpen] = useState(false);

    const nodeStatus = useNodeStatus({
            nodeId: props.id,
            channel: STRIPE_TRIGGER_CHANNEL_NAME,
            topic: "status",
            refreshToken: stripeTriggerTriggerRealtimeToken
        });

    const handleOpenSetting = () => setDialogOpen(true);


    return (
        <>
            <StripeTriggerDialog open={dialogOpen} onOpenChange={setDialogOpen} />
            <BaseTriggerNode
                {...props}
                icon={"/stripe.svg"}
                name="Strip"
                description="When strip event is captured"
                status={nodeStatus}
                onSetting={handleOpenSetting}
                onDoubleClick={handleOpenSetting}
            />
        </>
    )
});

StripTriggerNode.displayName = "StripTriggerNode"
