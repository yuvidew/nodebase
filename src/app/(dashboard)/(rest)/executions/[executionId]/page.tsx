import { requireAuth } from "@/lib/auth-utils";


interface Props {
    params : Promise<{
        executionId : string
    }>
}

const Page = async ({params} : Props) => {
    await requireAuth();
    const {executionId} = await params;

    return (
        <div>Execution Id Page : {executionId}</div>
    )
}

export default Page