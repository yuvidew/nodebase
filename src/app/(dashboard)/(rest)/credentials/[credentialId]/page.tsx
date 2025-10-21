import { requireAuth } from "@/lib/auth-utils";


interface Props {
    params : Promise<{
        credentialId : string
    }>
}

const Page = async ({params} : Props) => {
    await requireAuth();
    const {credentialId} = await params;

    return (
        <div>Page : {credentialId}</div>
    )
}

export default Page