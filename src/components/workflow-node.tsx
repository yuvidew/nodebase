"use client";

import { NodeToolbar, Position } from "@xyflow/react";
import type { ReactNode } from "react";
import { Button } from "./ui/button";
import { SettingsIcon, Trash2Icon } from "lucide-react";

interface Props {
    children: ReactNode;
    showToolbar?: boolean;
    onDelete?: () => void;
    onSettings?: () => void;
    name?: string;
    description?: string
}

/**
 * @param props.children Content rendered inside the node wrapper.
 * @param props.showToolbar Whether to display the inline node toolbar controls.
 * @param props.onDelete Handler invoked from the toolbar delete action.
 * @param props.onSettings Handler invoked from the toolbar settings action.
 * @param props.name Node title shown beneath the node.
 * @param props.description Optional description text shown under the title.
 */
export const WorkflowNode = ({
    children,
    showToolbar,
    onDelete,
    onSettings,
    name,
    description
}: Props) => {
    return (
        <>
            {showToolbar && (
                <NodeToolbar>
                    <Button size={"sm"} variant={"ghost"} onClick={onSettings}>
                        <SettingsIcon className="size-4" />
                    </Button>
                    <Button size={"sm"} variant={"ghost"} onClick={onDelete}>
                        <Trash2Icon className="size-4" />
                    </Button>
                </NodeToolbar>
            )}

            {children}

            {name &&  (
                <NodeToolbar
                    position={Position.Bottom}
                    isVisible
                    className="max-w-[200px] text-center"
                >
                    <p className="font-medium">{name}</p>

                    {description && (
                        <p className=" text-muted-foreground truncate text-sm">{description}</p>
                    )}
                </NodeToolbar>
            )}
        </>
    );
};
