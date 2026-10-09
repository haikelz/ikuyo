<script lang="ts">
  import type { HTMLAttributes } from "svelte/elements";
  import { cn, type WithElementRef } from "../../../lib/utils";
  let { ref = $bindable(null), class: className, children, ...restProps }: WithElementRef<HTMLAttributes<HTMLElement>> = $props();
</script>

<header bind:this={ref} {...restProps} data-slot="frame-panel-header"
  class={cn("flex flex-col px-[var(--frame-panel-px)] py-[var(--frame-bar-py)]", className)}>
  {@render children?.()}
</header>
