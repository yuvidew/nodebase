import React from 'react'
import { Button } from './ui/button'
import { WorkflowIcon } from 'lucide-react'

export const Logo = () => {
    return (
        <div className=' flex items-center gap-x-3'>
            <Button size={"icon-sm"}>
                <WorkflowIcon />
            </Button>
            <p className=' lg:block md:block hidden text-lg font-semibold'>
                Nodebase
            </p>
        </div>
    )
}
