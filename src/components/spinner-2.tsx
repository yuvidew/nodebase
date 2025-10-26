import React from 'react';
import { Loader2Icon } from 'lucide-react';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';

interface SpinnerSizeProps {
    size?: 'default' | 'sm' | 'lg' | 'icon';
    color? : "default"| 'primary';
}


/**
 * spinnerVariants is a utility function created using class-variance-authority (cva) to generate
 * Tailwind CSS class names for the Spinner component based on provided size and color variants.
 *
 * @param {Object} options - The options object for spinnerVariants.
 * @param {'default' | 'sm' | 'lg' | 'icon'} [options.size='default'] - The size variant for the spinner.
 * @param {'default' | 'primary' | 'white'} [options.color='default'] - The color variant for the spinner.
 * @returns {string} The computed class names for the spinner based on the selected variants.
 */

const spinnerVariants = cva(
    'text-muted-foreground animate-spin mt-4 ml-2 -mr-2',
    {
        variants: {
            size: {
                default: 'h-4 w-4',
                sm: 'h-2 w-2',
                lg: 'h-6 w-6',
                icon: 'h-10 w-10'
            },
            color : {
                default : "text-[#fff]",
                primary : "text-primary"
            }
        },
        defaultVariants: {
            size: 'default',
            color : "default"
        },
        
    }
);


/**
 * Spinner component renders a spinning loader icon with customizable size and color.
 *
 * @param {Object} props - The props for the Spinner component.
 * @param {'default' | 'sm' | 'lg' | 'icon'} [props.size='default'] - The size of the spinner.
 * @param {'default' | 'primary'} [props.color='default'] - The color variant of the spinner.
 * @returns {JSX.Element} The rendered spinning loader icon.
 */


const Spinner2: React.FC<SpinnerSizeProps> = ({ size = 'default' , color = "default"}) => {
    return (
        <Loader2Icon className={cn(spinnerVariants({ size , color}))} />
    );
};

export default Spinner2;
