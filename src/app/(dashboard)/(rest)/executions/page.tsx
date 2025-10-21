import { requireAuth } from '@/lib/auth-utils';
import React from 'react'

const ExecutionsPage = async () => {
    await requireAuth();
    return (
        <div>ExecutionsPage</div>
    )
}

export default ExecutionsPage