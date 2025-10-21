"use client";

import React from 'react'
import { Button } from './ui/button'
import { WorkflowIcon } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation';
import { useIsMobile } from '@/hooks/use-mobile';

export const Logo = () => {
    const router = useRouter();
    const isMobile = useIsMobile();


    return (
        <div className=' flex items-center gap-x-3 data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"'>
            <Button size={"icon-sm"} >
                <WorkflowIcon />
            </Button>
            {/* {isMobile ? <></> : ( */}
            <span  className='  text-lg font-semibold'>
                Nodebase
            </span>
            {/* )} */}
        </div>
    )
}
