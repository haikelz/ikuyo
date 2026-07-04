<script lang="ts">
import { TooltipContent, Tooltip as TooltipRoot, TooltipTrigger } from "@ikuyo/ui";

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
