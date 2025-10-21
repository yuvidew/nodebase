import { requireAuth } from '@/lib/auth-utils'
import React from 'react'

const WorkflowPage = async () => {
    await requireAuth();

    return (
        <div>WorkflowPage</div>
    )
}

export default WorkflowPage