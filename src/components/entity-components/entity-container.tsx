import { ReactNode } from "react";

type Props = {
    children: ReactNode,
    header?: ReactNode,
    search?: ReactNode,
    pagination?: ReactNode
}

/**
 * Layout shell that arranges optional header, search tools, body content, and pagination.
 * @param children Main body content (table, list, empty state, etc.).
 * @param header Slot for a header element such as `EntityHeader`.
 * @param search Slot for filters or search controls displayed above content.
 * @param pagination Footer slot for page controls or summary info.
 * @example
 * ```tsx
 * <EntityContainer
 *   header={<EntityHeader title="Workflows" newButtonHref="/workflows/new" />}
 *   search={<WorkflowSearch />}
 *   pagination={<Pagination currentPage={1} totalPages={5} />}
 * >
 *   <WorkflowTable data={workflows} />
 * </EntityContainer>
 * ```
 */
export const EntityContainer = ({
    children,
    header,
    search,
    pagination
}: Props) => {
    return (
        <div className="p-4 md:px-10 md:py-6 h-full">
            <div className=" mx-auto max-w-screen-xl w-full flex flex-col gap-y-8 h-full">
                {header}
                <div className=" flex flex-col gap-y-4 h-full">
                    {search}
                    {children}
                </div>
                {pagination}
            </div>
        </div>
    )
}
