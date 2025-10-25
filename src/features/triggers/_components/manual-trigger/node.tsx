import { NodeProps } from '@xyflow/react'
import React, { memo } from 'react'
import { BaseTriggerNode } from '../base-trigger-node';
import { MousePointerIcon } from 'lucide-react';

export const ManualTriggerBode = memo((props: NodeProps) => {
    return (
        <>
            <BaseTriggerNode
                {...props}
                icon={MousePointerIcon}
                name="When clicking 'Execute workflow"
                // status={nodeStatus}
                // onSetting={handleOpenSetting}
                // onDoubleClick={handleOpenSettings}
            />
        </>
    )
});

ManualTriggerBode.displayName = "ManualTriggerBode"
