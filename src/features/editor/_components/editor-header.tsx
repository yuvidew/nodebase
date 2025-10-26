"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";

import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Loader2Icon, SaveIcon } from "lucide-react";
import Link from "next/link";
import {
    useSuspenseWorkflow,
    useUpdateWorkflow,
    useUpdateWorkflowName,
} from "@/features/workflows/hooks/use-workflows";
import { Input } from "@/components/ui/input";
import { useAtomValue } from "jotai";
import { editorAtom } from "../store/atoms";
import { Spinner } from "@/components/ui/spinner";
import Spinner2 from "@/components/spinner-2";

export const EditorNameInput = ({ workflowId }: { workflowId: string }) => {
    const { data: workflow } = useSuspenseWorkflow(workflowId);
    const { mutateAsync: updateWorkflowName, isPending } =
        useUpdateWorkflowName();

    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(workflow.name);

    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (workflow.name) {
            setName(workflow.name);
        }
    }, [workflow.name]);

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
        }
    }, [isEditing]);

    const handleSave = async () => {
        if (name === workflow.name) {
            setIsEditing(false);

            return;
        }

        try {
            await updateWorkflowName({
                id: workflowId,
                name,
            });
        } catch {
            setName(workflow.name);
        } finally {
            setIsEditing(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleSave();
        } else if (e.key === "Escape") {
            setName(workflow.name);
            setIsEditing(false);
        }
    };

    if (isEditing) {
        return (
            <Input
                disabled={isPending}
                ref={inputRef}
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={handleSave}
                onKeyDown={handleKeyDown}
                className="h-7 w-auto min-w-[100px] px-2"
            />
        );
    }

    return (
        <BreadcrumbItem
            className=" cursor-pointer hover:text-foreground transition-colors"
            onClick={() => setIsEditing(true)}
        >
            {workflow.name}
        </BreadcrumbItem>
    );
};

export const EditorBreadcrumbs = ({ workflowId }: { workflowId: string }) => {
    return (
        <Breadcrumb>
            <BreadcrumbList>
                <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                        <Link prefetch href={"/workflows"}>
                            Workflows
                        </Link>
                    </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <EditorNameInput workflowId={workflowId} />
            </BreadcrumbList>
        </Breadcrumb>
    );
};

export const EditorSaveButton = ({ workflowId }: { workflowId: string }) => {
    const editor = useAtomValue(editorAtom);
    const { mutate: saveWorkflow, isPending } = useUpdateWorkflow();

    const handleSave = () => {
        if (!editor) {
            return;
        }

        const nodes = editor.getNodes();
        const edges = editor.getEdges();

        saveWorkflow({
            id: workflowId,
            nodes,
            edges,
        });
    };
    return (
        <div className=" ml-auto">
            <Button size={"sm"} onClick={handleSave} disabled={isPending} className="gap-2">
                {isPending ? (
                    <>
                        <Spinner className="size-4"/>
                        Saving...
                    </>

                ) : (
                    <>
                        <SaveIcon className=" size-4" />
                        
                        Save
                    </>
                )}
            </Button>
        </div>
    );
};

export const EditorHeader = ({ workflowId }: { workflowId: string }) => {
    return (
        <header className=" flex h-14 shrink-0 items-center gap-2 border-b px-4 bg-background">
            <SidebarTrigger />
            <div className="flex flex-row items-center justify-between gap-x-4 w-full">
                <EditorBreadcrumbs workflowId={workflowId} />
                <EditorSaveButton workflowId={workflowId} />
            </div>
        </header>
    );
};
