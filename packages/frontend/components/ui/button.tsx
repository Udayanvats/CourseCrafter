import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "shadinline-flex shaditems-center shadjustify-center shadwhitespace-nowrap shadrounded-md shadtext-sm shadfont-medium shadring-offset-white shadtransition-colors focus-visible:shadoutline-none focus-visible:shadring-2 focus-visible:shadring-slate-950 focus-visible:shadring-offset-2 disabled:shadpointer-events-none disabled:shadopacity-50 dark:shadring-offset-slate-950 dark:focus-visible:shadring-slate-300",
  {
    variants: {
      variant: {
        default: "shadbg-slate-900 shadtext-slate-50 hover:shadbg-slate-900/90 dark:shadbg-slate-50 dark:shadtext-slate-900 dark:hover:shadbg-slate-50/90",
        destructive:
          "shadbg-red-500 shadtext-slate-50 hover:shadbg-red-500/90 dark:shadbg-red-900 dark:shadtext-slate-50 dark:hover:shadbg-red-900/90",
        outline:
          "shadborder shadborder-slate-200 shadbg-white hover:shadbg-slate-100 hover:shadtext-slate-900 dark:shadborder-slate-800 dark:shadbg-slate-950 dark:hover:shadbg-slate-800 dark:hover:shadtext-slate-50",
        secondary:
          "shadbg-slate-100 shadtext-slate-900 hover:shadbg-slate-100/80 dark:shadbg-slate-800 dark:shadtext-slate-50 dark:hover:shadbg-slate-800/80",
        ghost: "hover:shadbg-slate-100 hover:shadtext-slate-900 dark:hover:shadbg-slate-800 dark:hover:shadtext-slate-50",
        link: "shadtext-slate-900 shadunderline-offset-4 hover:shadunderline dark:shadtext-slate-50",
      },
      size: {
        default: "shadh-10 shadpx-4 shadpy-2",
        sm: "shadh-9 shadrounded-md shadpx-3",
        lg: "shadh-11 shadrounded-md shadpx-8",
        icon: "shadh-10 shadw-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
