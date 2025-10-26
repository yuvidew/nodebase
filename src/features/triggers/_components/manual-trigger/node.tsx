import { NodeProps } from '@xyflow/react'
import React, { memo, useState } from 'react'
import { BaseTriggerNode } from '../base-trigger-node';
import { MousePointerIcon } from 'lucide-react';
import { ManualTriggerDialog } from './dialog';

export const ManualTriggerBode = memo((props: NodeProps) => {
    const [dialogOpen , setDialogOpen] = useState(false);
    
    const nodeStatus = "initial";

    const handleOpenSetting = () => setDialogOpen(true);

    
    return (
        <>
            <ManualTriggerDialog open = {dialogOpen} onOpenChange={setDialogOpen} />
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
