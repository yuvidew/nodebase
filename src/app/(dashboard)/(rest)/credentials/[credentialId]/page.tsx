import { CredentialView } from "@/features/credentials/_components/credential";
import { prefetchCredential } from "@/features/credentials/server/prefetch";
import { requireAuth } from "@/lib/auth-utils";


interface Props {
    params: Promise<{
        credentialId: string
    }>
}

const Page = async ({ params }: Props) => {
    await requireAuth();
    const { credentialId } = await params;

    prefetchCredential(credentialId);

    return (
        <main className='p-4 md:px-10 md:py-6 h-full' >
            <div className=' mx-auto max-w-screen-md w-full flex flex-col gap-y-8 h-full'>
                <CredentialView credentialId={credentialId} />
            </div>
        </main>
    )
}

export default Page