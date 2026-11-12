<script lang="ts">
import { cn, type WithoutChildrenOrChild } from "../../../lib/utils";
import { DropdownMenu as DropdownMenuPrimitive } from "bits-ui";
import type { ComponentProps } from "svelte";

let {
  ref = $bindable(null),
  class: className,
  sideOffset = 6,
  portalProps,
  ...restProps
}: DropdownMenuPrimitive.ContentProps & {
  portalProps?: WithoutChildrenOrChild<ComponentProps<typeof DropdownMenuPrimitive.Portal>>;
} = $props();
</script>

<DropdownMenuPrimitive.Portal {...portalProps}>
  <DropdownMenuPrimitive.Content
    bind:ref
    data-slot="dropdown-menu-content"
    {sideOffset}
    class={cn(
      "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-1 data-[side=left]:slide-in-from-right-1 data-[side=right]:slide-in-from-left-1 data-[side=top]:slide-in-from-bottom-1 z-50 max-h-(--bits-dropdown-menu-content-available-height) min-w-[10rem] origin-(--bits-dropdown-menu-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md! border border-border p-1 shadow-lg outline-none!",
      className
    )}
    {...restProps}
  />
</DropdownMenuPrimitive.Portal>
