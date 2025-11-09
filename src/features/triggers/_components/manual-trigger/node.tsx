import { NodeProps } from '@xyflow/react'
import React, { memo, useState } from 'react'
import { BaseTriggerNode } from '../base-trigger-node';
import { MousePointerIcon } from 'lucide-react';
import { ManualTriggerDialog } from './dialog';
import { useNodeStatus } from '@/features/executions/hooks/use-node-status';
import { MANUAL_TRIGGER_CHANNEL_NAME } from '@/inngest/channels/manual-trigger';
import { fetchManualTriggerRealtimeToken } from './actions';

export const ManualTriggerBode = memo((props: NodeProps) => {
    const [dialogOpen, setDialogOpen] = useState(false);

    const nodeStatus = useNodeStatus({
        nodeId: props.id,
        channel: MANUAL_TRIGGER_CHANNEL_NAME,
        topic: "status",
        refreshToken: fetchManualTriggerRealtimeToken
    });

    const handleOpenSetting = () => setDialogOpen(true);


    return (
        <>
            <ManualTriggerDialog open={dialogOpen} onOpenChange={setDialogOpen} />
            <BaseTriggerNode
                {...props}
                icon={MousePointerIcon}
                name="When clicking 'Execute workflow"
                status={nodeStatus}
                onSetting={handleOpenSetting}
                onDoubleClick={handleOpenSetting}
            />
        </>
    )
});

ManualTriggerBode.displayName = "ManualTriggerBode"
