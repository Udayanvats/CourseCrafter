"use client"

import * as React from "react"
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu"
import { Check, ChevronRight, Circle } from "lucide-react"

import { cn } from "@/lib/utils"

const DropdownMenu = DropdownMenuPrimitive.Root

const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger

const DropdownMenuGroup = DropdownMenuPrimitive.Group

const DropdownMenuPortal = DropdownMenuPrimitive.Portal

const DropdownMenuSub = DropdownMenuPrimitive.Sub

const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup

const DropdownMenuSubTrigger = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubTrigger> & {
    inset?: boolean
  }
>(({ className, inset, children, ...props }, ref) => (
  <DropdownMenuPrimitive.SubTrigger
    ref={ref}
    className={cn(
      "shadflex shadcursor-default shadselect-none shaditems-center shadrounded-sm shadpx-2 shadpy-1.5 shadtext-sm shadoutline-none focus:shadbg-slate-100 data-[state=open]:shadbg-slate-100 dark:focus:shadbg-slate-800 dark:data-[state=open]:shadbg-slate-800",
      inset && "shadpl-8",
      className
    )}
    {...props}
  >
    {children}
    <ChevronRight className="shadml-auto shadh-4 shadw-4" />
  </DropdownMenuPrimitive.SubTrigger>
))
DropdownMenuSubTrigger.displayName =
  DropdownMenuPrimitive.SubTrigger.displayName

const DropdownMenuSubContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubContent>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.SubContent
    ref={ref}
    className={cn(
      "shadz-50 shadmin-w-[8rem] shadoverflow-hidden shadrounded-md shadborder shadborder-slate-200 shadbg-white shadp-1 shadtext-slate-950 shadshadow-lg data-[state=open]:shadanimate-in data-[state=closed]:shadanimate-out data-[state=closed]:shadfade-out-0 data-[state=open]:shadfade-in-0 data-[state=closed]:shadzoom-out-95 data-[state=open]:shadzoom-in-95 data-[side=bottom]:shadslide-in-from-top-2 data-[side=left]:shadslide-in-from-right-2 data-[side=right]:shadslide-in-from-left-2 data-[side=top]:shadslide-in-from-bottom-2 dark:shadborder-slate-800 dark:shadbg-slate-950 dark:shadtext-slate-50",
      className
    )}
    {...props}
  />
))
DropdownMenuSubContent.displayName =
  DropdownMenuPrimitive.SubContent.displayName

const DropdownMenuContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        "shadz-50 shadmin-w-[8rem] shadoverflow-hidden shadrounded-md shadborder shadborder-slate-200 shadbg-white shadp-1 shadtext-slate-950 shadshadow-md data-[state=open]:shadanimate-in data-[state=closed]:shadanimate-out data-[state=closed]:shadfade-out-0 data-[state=open]:shadfade-in-0 data-[state=closed]:shadzoom-out-95 data-[state=open]:shadzoom-in-95 data-[side=bottom]:shadslide-in-from-top-2 data-[side=left]:shadslide-in-from-right-2 data-[side=right]:shadslide-in-from-left-2 data-[side=top]:shadslide-in-from-bottom-2 dark:shadborder-slate-800 dark:shadbg-slate-950 dark:shadtext-slate-50",
        className
      )}
      {...props}
    />
  </DropdownMenuPrimitive.Portal>
))
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName

const DropdownMenuItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Item
    ref={ref}
    className={cn(
      "shadrelative shadflex shadcursor-default shadselect-none shaditems-center shadrounded-sm shadpx-2 shadpy-1.5 shadtext-sm shadoutline-none shadtransition-colors focus:shadbg-slate-100 focus:shadtext-slate-900 data-[disabled]:shadpointer-events-none data-[disabled]:shadopacity-50 dark:focus:shadbg-slate-800 dark:focus:shadtext-slate-50",
      inset && "shadpl-8",
      className
    )}
    {...props}
  />
))
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName

const DropdownMenuCheckboxItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
  <DropdownMenuPrimitive.CheckboxItem
    ref={ref}
    className={cn(
      "shadrelative shadflex shadcursor-default shadselect-none shaditems-center shadrounded-sm shadpy-1.5 shadpl-8 shadpr-2 shadtext-sm shadoutline-none shadtransition-colors focus:shadbg-slate-100 focus:shadtext-slate-900 data-[disabled]:shadpointer-events-none data-[disabled]:shadopacity-50 dark:focus:shadbg-slate-800 dark:focus:shadtext-slate-50",
      className
    )}
    checked={checked}
    {...props}
  >
    <span className="shadabsolute shadleft-2 shadflex shadh-3.5 shadw-3.5 shaditems-center shadjustify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <Check className="shadh-4 shadw-4" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.CheckboxItem>
))
DropdownMenuCheckboxItem.displayName =
  DropdownMenuPrimitive.CheckboxItem.displayName

const DropdownMenuRadioItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
  <DropdownMenuPrimitive.RadioItem
    ref={ref}
    className={cn(
      "shadrelative shadflex shadcursor-default shadselect-none shaditems-center shadrounded-sm shadpy-1.5 shadpl-8 shadpr-2 shadtext-sm shadoutline-none shadtransition-colors focus:shadbg-slate-100 focus:shadtext-slate-900 data-[disabled]:shadpointer-events-none data-[disabled]:shadopacity-50 dark:focus:shadbg-slate-800 dark:focus:shadtext-slate-50",
      className
    )}
    {...props}
  >
    <span className="shadabsolute shadleft-2 shadflex shadh-3.5 shadw-3.5 shaditems-center shadjustify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <Circle className="shadh-2 shadw-2 shadfill-current" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.RadioItem>
))
DropdownMenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName

const DropdownMenuLabel = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Label
    ref={ref}
    className={cn(
      "shadpx-2 shadpy-1.5 shadtext-sm shadfont-semibold",
      inset && "shadpl-8",
      className
    )}
    {...props}
  />
))
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName

const DropdownMenuSeparator = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Separator
    ref={ref}
    className={cn("shad-mx-1 shadmy-1 shadh-px shadbg-slate-100 dark:shadbg-slate-800", className)}
    {...props}
  />
))
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName

const DropdownMenuShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn("shadml-auto shadtext-xs shadtracking-widest shadopacity-60", className)}
      {...props}
    />
  )
}
DropdownMenuShortcut.displayName = "DropdownMenuShortcut"

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
}
