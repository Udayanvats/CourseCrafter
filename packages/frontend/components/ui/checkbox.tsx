"use client"

import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { Check } from "lucide-react"

import { cn } from "@/lib/utils"

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      "shadpeer shadh-4 shadw-4 shadshrink-0 shadrounded-sm shadborder shadborder-slate-200 shadborder-slate-900 shadring-offset-white focus-visible:shadoutline-none focus-visible:shadring-2 focus-visible:shadring-slate-950 focus-visible:shadring-offset-2 disabled:shadcursor-not-allowed disabled:shadopacity-50 data-[state=checked]:shadbg-slate-900 data-[state=checked]:shadtext-slate-50 dark:shadborder-slate-800 dark:shadborder-slate-50 dark:shadring-offset-slate-950 dark:focus-visible:shadring-slate-300 dark:data-[state=checked]:shadbg-slate-50 dark:data-[state=checked]:shadtext-slate-900",
      className
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      className={cn("shadflex shaditems-center shadjustify-center shadtext-current")}
    >
      <Check className="shadh-4 shadw-4" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
))
Checkbox.displayName = CheckboxPrimitive.Root.displayName

export { Checkbox }
