import { CredentialForm } from '@/features/credentials/_components/credential'
import { requireAuth } from '@/lib/auth-utils'
import React from 'react'

const NewPage = async() => {
    await requireAuth();
    return (
        <main className='p-4 md:px-10 md:py-6 h-full' >
            <div className=' mx-auto max-w-screen-md w-full flex flex-col gap-y-8 h-full'>
                <CredentialForm/>
            </div>
        </main>
    )
}

export default NewPage