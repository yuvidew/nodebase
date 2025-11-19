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
    isLoading?: boolean;
    label? : string;
    empty_label? : string;
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
    isLoading = false,
    label = "Add item",
    empty_label = "No items"
}: Props) => {
    return (
        <Empty className=" border border-dashed dark:bg-background h-full">
            <EmptyHeader>
                <EmptyMedia variant="icon">
                    <PackageOpenIcon />
                </EmptyMedia>
                <EmptyTitle>{empty_label}</EmptyTitle>
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
                                    {label ? label : "Add item"}
                                </>
                            )
                        }
                    </Button>
                </EmptyContent>
            )}
        </Empty>
    )
}
