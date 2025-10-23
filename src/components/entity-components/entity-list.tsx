import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface EntityListProps<T>{
    items: T[],
    renderItem : (item: T, index: number) => ReactNode;
    getKey?: (item:T, index:number) => string | number;
    emptyView?: ReactNode;
    className? : string;
}

export function EntityList<T>({
    items,
    renderItem,
    getKey,
    emptyView,
    className
}:EntityListProps<T>) {
    if (items.length ===0 && emptyView) {
        return(
            <div className="flex-1 flex justify-center items-center">
                <div className=" max-w-sm mx-auto">{emptyView}</div>
            </div>
        )
    }
    return (
        <div className={cn(
            "flex flex-col gap-y-4",
            className
        )}>
            {items.map((item, index) => (
                <div key={getKey ? getKey(item, index) : index}>
                    {renderItem(item, index)}
                </div>
            ))}
        </div>
    )
}
