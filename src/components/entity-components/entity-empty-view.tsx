import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "@/components/ui/empty";

import React from 'react';
import { Button } from "../ui/button";
import { PackageOpenIcon, PlusIcon } from "lucide-react";
import { Spinner } from "../ui/spinner";


interface Props {
    onNew?: () => void;
    message: string;
    isLoading?: boolean
}

/**
 * Renders an empty state with optional call-to-action for creating a new item.
 * @param {Props} props Component properties.
 * @param {string} props.message Message explaining the empty state.
 * @param {() => void} [props.onNew] Optional handler to trigger creating a new item.
 */
export const EntityEmptyView = ({
    message,
    onNew,
    isLoading = false
}: Props) => {
    return (
        <Empty className=" border border-dashed bg-white h-full">
            <EmptyHeader>
                <EmptyMedia variant="icon">
                    <PackageOpenIcon />
                </EmptyMedia>
                <EmptyTitle>No items</EmptyTitle>
                {!!message && <EmptyDescription>{message}</EmptyDescription>}
            </EmptyHeader>
            {!!onNew && (
                <EmptyContent>
                    <Button onClick={onNew} disabled={isLoading}>
                        {isLoading ?
                            (
                                <>
                                    <Spinner className=" size-4" />
                                    Adding...
                                </>
                            )
                            :
                            (
                                <>
                                    <PlusIcon className="size-4" />
                                    Add item
                                </>
                            )
                        }
                    </Button>
                </EmptyContent>
            )}
        </Empty>
    )
}
