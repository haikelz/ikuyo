<script lang="ts">
  import type { HTMLAttributes } from "svelte/elements";
  import { cn, type WithElementRef } from "../../../lib/utils";
  let { ref = $bindable(null), class: className, children, ...restProps }: WithElementRef<HTMLAttributes<HTMLDivElement>> = $props();
</script>

<div bind:this={ref} {...restProps} data-slot="frame-panel"
  class={cn("relative min-w-0 grow rounded-[var(--frame-panel-radius)] border border-border bg-card bg-clip-padding px-[var(--frame-panel-px)] py-[var(--frame-panel-py)]", className)}>
  {@render children?.()}
</div>
