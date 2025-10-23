import { AppSidebar } from '@/components/app-sidebar'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import React, { ReactNode } from 'react'

const DashboardLayout = ({children} : {children : ReactNode}) => {
    return (
        <SidebarProvider>
            <AppSidebar/>
            <SidebarInset className=' bg-accent/20'>
                {children} 
            </SidebarInset>
        </SidebarProvider>
    )
}

export default DashboardLayout