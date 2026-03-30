<script lang="ts">
  import { cn, type WithoutChildrenOrChild } from "../../../lib/utils";
  import { Select as SelectPrimitive } from "bits-ui";
  import type { ComponentProps } from "svelte";

  let {
    ref = $bindable(null),
    class: className,
    children,
    sideOffset = 6,
    portalProps,
    ...restProps
  }: SelectPrimitive.ContentProps & {
    portalProps?: WithoutChildrenOrChild<ComponentProps<typeof SelectPrimitive.Portal>>;
  } = $props();
</script>

<SelectPrimitive.Portal {...portalProps}>
  <SelectPrimitive.Content
    bind:ref
    data-slot="select-content"
    {sideOffset}
    class={cn(
      "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-1 data-[side=left]:slide-in-from-right-1 data-[side=right]:slide-in-from-left-1 data-[side=top]:slide-in-from-bottom-1 relative z-50 min-w-[10rem] overflow-hidden rounded-md border shadow-md",
      className
    )}
    {...restProps}
  >
    <SelectPrimitive.Viewport class="max-h-72 overflow-auto p-1">
      {@render children?.()}
    </SelectPrimitive.Viewport>
  </SelectPrimitive.Content>
</SelectPrimitive.Portal>
