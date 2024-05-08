"use client"

import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"

import { cn } from "@/lib/utils"

const Tabs = TabsPrimitive.Root

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "shadinline-flex shadh-10 shaditems-center shadjustify-center shadrounded-md shadbg-slate-100 shadp-1 shadtext-slate-500 dark:shadbg-slate-800 dark:shadtext-slate-400",
      className
    )}
    {...props}
  />
))
TabsList.displayName = TabsPrimitive.List.displayName

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "shadinline-flex shaditems-center shadjustify-center shadwhitespace-nowrap shadrounded-sm shadpx-3 shadpy-1.5 shadtext-sm shadfont-medium shadring-offset-white shadtransition-all focus-visible:shadoutline-none focus-visible:shadring-2 focus-visible:shadring-slate-950 focus-visible:shadring-offset-2 disabled:shadpointer-events-none disabled:shadopacity-50 data-[state=active]:shadbg-white data-[state=active]:shadtext-slate-950 data-[state=active]:shadshadow-sm dark:shadring-offset-slate-950 dark:focus-visible:shadring-slate-300 dark:data-[state=active]:shadbg-slate-950 dark:data-[state=active]:shadtext-slate-50",
      className
    )}
    {...props}
  />
))
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "shadmt-2 shadring-offset-white focus-visible:shadoutline-none focus-visible:shadring-2 focus-visible:shadring-slate-950 focus-visible:shadring-offset-2 dark:shadring-offset-slate-950 dark:focus-visible:shadring-slate-300",
      className
    )}
    {...props}
  />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsList, TabsTrigger, TabsContent }
