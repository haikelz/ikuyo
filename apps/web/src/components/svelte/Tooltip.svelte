<script lang="ts">
  import {
    Tooltip as TooltipRoot,
    TooltipContent,
    TooltipTrigger,
  } from "@/components/svelte/ui/tooltip";

  let { children, content } = $props();
</script>

<TooltipRoot>
  <TooltipTrigger>
    {#snippet child({ props })}
      <span {...props} class="inline-flex">
        {@render children?.()}
      </span>
    {/snippet}
  </TooltipTrigger>
  <TooltipContent>
    {content}
  </TooltipContent>
</TooltipRoot>
