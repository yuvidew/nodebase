import { AppHeader } from '@/components/app-header'
import React, { ReactNode } from 'react'

const Layout = ({ children }: { children: ReactNode }) => {
    return (
        <>
            <AppHeader/>
            <main className=' flex-1'>
                {children}
            </main>
        </>
    )
}

export default Layout