<script lang="ts">
  import type { HTMLAttributes } from "svelte/elements";
  import { cn, type WithElementRef } from "../../../lib/utils";

  let { ref = $bindable(null), class: className, children, ...restProps }: WithElementRef<HTMLAttributes<HTMLSpanElement>> = $props();
</script>

<span bind:this={ref} data-slot="icon-tile" data-variant="outline" class={cn("inline-flex size-10 shrink-0 items-center justify-center rounded-md border border-border bg-card text-muted-foreground [&_svg]:size-[18px]", className)} {...restProps}>
  {@render children?.()}
</span>
