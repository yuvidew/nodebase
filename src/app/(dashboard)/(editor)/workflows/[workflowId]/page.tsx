import { Editor, EditorError, EditorLoading } from "@/features/editor/_components/editor";
import { EditorHeader } from "@/features/editor/_components/editor-header";
import { prefetchWorkflow } from "@/features/workflows/server/prefetch";
import { requireAuth } from "@/lib/auth-utils";
import { HydrateClient } from "@/trpc/server";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";


interface Props {
    /**
     * @params Promise resolving to the workflow route params.
     */
    params: Promise<{
        workflowId: string
    }>
}

const Page = async ({ params }: Props) => {
    await requireAuth();

    const { workflowId } = await params;

    prefetchWorkflow(workflowId);

    return (
        <HydrateClient>
            <ErrorBoundary fallback={<EditorError/>}>
                <Suspense fallback={<EditorLoading/>}>
                    <EditorHeader workflowId={workflowId}/>
                    <main className=" flex-1">
                        <Editor workflowId={workflowId} />
                    </main>
                </Suspense>
            </ErrorBoundary>
        </HydrateClient>
    )
}

export default Page
