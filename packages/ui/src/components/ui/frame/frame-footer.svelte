<script lang="ts">
  import type { HTMLAttributes } from "svelte/elements";
  import { cn, type WithElementRef } from "../../../lib/utils";
  let { ref = $bindable(null), class: className, children, ...restProps }: WithElementRef<HTMLAttributes<HTMLElement>> = $props();
</script>

<footer bind:this={ref} {...restProps} data-slot="frame-panel-footer"
  class={cn("flex flex-col gap-1 px-[var(--frame-panel-px)] py-[var(--frame-bar-py)]", className)}>
  {@render children?.()}
</footer>
