import { AlertTriangleIcon } from "lucide-react";

interface ErrorViewProps{
    message?: string,
}

/**
 * Displays a centered error indicator with an optional message.
 * @param {ErrorViewProps} props Component properties.
 * @param {string} [props.message] Optional error description to surface.
 */
export const ErrorView = ({
    message,
} : ErrorViewProps)=> {
    return (
        <div className=" flex justify-center items-center h-full flex-1 flex-col gap-y-4">
            <AlertTriangleIcon className="text-primary size-8" />

            {!!message && <p className="text-sm text-muted-foreground">{message}</p>}
        </div>
    )
}
