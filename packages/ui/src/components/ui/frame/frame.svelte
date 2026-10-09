<script lang="ts">
  import type { HTMLAttributes } from "svelte/elements";
  import { cn, type WithElementRef } from "../../../lib/utils";

  let {
    ref = $bindable(null), class: className, children,
    variant = "default", spacing = "default", stacked = false, dense = false,
    ...restProps
  }: WithElementRef<HTMLAttributes<HTMLDivElement>> & {
    variant?: "default" | "ghost";
    spacing?: "sm" | "default" | "lg";
    stacked?: boolean;
    dense?: boolean;
  } = $props();
</script>

<div bind:this={ref} {...restProps} data-slot="frame" data-spacing={spacing}
  data-stacked={stacked} data-dense={dense} data-variant={variant}
  class={cn("frame relative flex min-w-0 flex-col bg-muted/50 text-card-foreground", className)}>
  {@render children?.()}
</div>

<style>
  .frame {
    --frame-radius: var(--radius-xl);
    --frame-px: 0.1875rem;
    --frame-panel-radius: max(0px, calc(var(--frame-radius) - var(--frame-px) - 1px));
    --frame-panel-px: 1rem;
    --frame-panel-py: 1rem;
    --frame-bar-py: 0.5rem;
    border-radius: var(--frame-radius);
    padding: var(--frame-px);
    gap: 0.1875rem;
  }
  .frame[data-variant="default"] { border: 1px solid var(--border); }
  .frame[data-variant="ghost"] {
    --frame-panel-radius: max(0px, calc(var(--frame-radius) - var(--frame-px)));
  }
  .frame[data-spacing="sm"] {
    --frame-panel-px: 0.75rem;
    --frame-panel-py: 0.875rem;
    --frame-bar-py: 0.375rem;
  }
  .frame[data-spacing="lg"] {
    --frame-panel-px: 1.25rem;
    --frame-panel-py: 1.25rem;
    --frame-bar-py: 0.625rem;
  }
  .frame:not([data-stacked="true"]) > :global([data-slot="frame-panel"] + [data-slot="frame-panel"]) { margin-top: 0.25rem; }
  .frame[data-spacing="sm"]:not([data-stacked="true"]) > :global([data-slot="frame-panel"] + [data-slot="frame-panel"]) { margin-top: 0.125rem; }
  .frame[data-spacing="lg"]:not([data-stacked="true"]) > :global([data-slot="frame-panel"] + [data-slot="frame-panel"]) { margin-top: 0.5rem; }
  .frame[data-stacked="true"] { gap: 0; }
  .frame[data-stacked="true"] > :global([data-slot="frame-panel"]:has(+ [data-slot="frame-panel"])) { border-bottom-left-radius: 0; border-bottom-right-radius: 0; }
  .frame[data-stacked="true"] > :global([data-slot="frame-panel"] + [data-slot="frame-panel"]) { border-top-left-radius: 0; border-top-right-radius: 0; border-top-width: 0; }
  .frame[data-dense="true"] { padding: 0; gap: 0; --frame-panel-radius: var(--frame-radius); }
</style>
