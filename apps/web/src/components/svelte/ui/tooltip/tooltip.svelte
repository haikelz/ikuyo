<script lang="ts">
  import { Tooltip as TooltipPrimitive } from "bits-ui";
  import TooltipProvider from "./tooltip-provider.svelte";

  let {
    open = $bindable(false),
    children,
    ...restProps
  }: TooltipPrimitive.RootProps = $props();
</script>

<TooltipProvider>
  <TooltipPrimitive.Root bind:open {...restProps}>
    {#snippet children(_)}
      {@render children?.(_)}
    {/snippet}
  </TooltipPrimitive.Root>
</TooltipProvider>
