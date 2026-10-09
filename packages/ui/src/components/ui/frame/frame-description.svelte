<script lang="ts">
  import type { HTMLAttributes } from "svelte/elements";
  import { cn, type WithElementRef } from "../../../lib/utils";
  let { ref = $bindable(null), class: className, children, ...restProps }: WithElementRef<HTMLAttributes<HTMLDivElement>> = $props();
</script>

<div bind:this={ref} {...restProps} data-slot="frame-panel-description" class={cn("text-sm text-muted-foreground", className)}>
  {@render children?.()}
</div>
