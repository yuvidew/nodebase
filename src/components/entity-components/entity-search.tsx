import { SearchIcon } from 'lucide-react';
import React from 'react'
import { Input } from '../ui/input';

interface Props {
    value : string;
    onChange : (value : string) => void;
    placeholder? : string
}

/**
 * Lightweight search input for filtering entity lists.
 * @param value Current search query.
 * @param onChange Callback fired with the updated query text.
 * @param [placeholder="search"] Optional input placeholder.
 * @example
 * ```tsx
 * <EntitySearch value={query} onChange={setQuery} placeholder="Find workflow" />
 * ```
 */
export const EntitySearch = ({
    value,
    onChange,
    placeholder = "search"
} : Props) => {
    return (
        <div className=' relative ml-auto'>
            <SearchIcon className=' size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground' />
            <Input
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className=' pl-8 max-w-[200px] bg-background shadow-none border-border ' 
            />
        </div>
    )
}
