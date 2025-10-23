import Link from 'next/link';
import React, { ReactNode } from 'react';
import { cn } from '../../lib/utils';

import {
    Card,
    CardContent,
    CardDescription,
    CardTitle,
} from "@/components/ui/card";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from '../ui/button';
import { MoreVerticalIcon, Trash2Icon } from 'lucide-react';

interface EntityItemsProps {
    href: string;
    title: string;
    subtitle?: ReactNode;
    image?: ReactNode;
    actions?: ReactNode;
    onRemove?: () => void | Promise<void>;
    isRemoving?: boolean;
    className?: string;
}

/**
 * Displays an entity card with optional media, metadata, and action dropdown.
 * @param {EntityItemsProps} props Component properties.
 * @param {string} props.href Link target for the entity.
 * @param {string} props.title Primary text shown for the entity.
 * @param {ReactNode} [props.subtitle] Secondary description content.
 * @param {ReactNode} [props.image] Optional leading media element.
 * @param {ReactNode} [props.actions] Additional inline action elements.
 * @param {() => void | Promise<void>} [props.onRemove] Optional remove callback used by the dropdown action.
 * @param {boolean} [props.isRemoving] Flag indicating the remove action is in progress.
 * @param {string} [props.className] Optional extra class names applied to the card.
 */
export const EntityItem = ({
    href,
    title,
    subtitle,
    image,
    actions,
    onRemove,
    isRemoving,
    className
}: EntityItemsProps) => {
    const handleRemove = async (e: React.MouseEvent) =>{
        e.preventDefault();
        e.stopPropagation();

        if (isRemoving) {
            return;
        }

        if (onRemove) {
            await onRemove();
        }
    }
    return (
        <Link href={href} prefetch>
            <Card
                className={cn(
                    "p-4 shadow-none hover:shadow cursor-pointer",
                    isRemoving && "opacity-50 cursor-not-allowed",
                    className
                )}
            >
                <CardContent className='flex flex-row items-center justify-between p-0'>
                    <div className=' flex items-center gap-3'>
                        {image}
                        <div className=''>
                            <CardTitle className='text-base font-medium'>{title}</CardTitle>
                            {!!subtitle && (
                                <CardDescription className=' text-xs'>{subtitle}</CardDescription>
                            )}
                        </div>
                    </div>
                    {(actions || onRemove) && (
                        <div className='flex gap-x-4 items-center'>
                            {actions}

                            {onRemove && (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button 
                                            size={"icon"}
                                            variant={"ghost"}
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <MoreVerticalIcon className=' size-4'/>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent
                                        align="end"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <DropdownMenuItem onClick={handleRemove}>
                                            <Trash2Icon className=' size-4 text-destructive'/>
                                            Delete
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>
        </Link>
    )
}
