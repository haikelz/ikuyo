<script lang="ts">
  let { children, content } = $props();

  let isVisible = $state(false);
  let tooltipRef = $state<HTMLDivElement | null>(null);
  let triggerRef = $state<HTMLDivElement | null>(null);

  function showTooltip() {
    isVisible = true;
  }

  function hideTooltip() {
    isVisible = false;
  }
</script>

<div
  role="tooltip"
  bind:this={triggerRef}
  class="relative inline-block"
  onmouseenter={showTooltip}
  onmouseleave={hideTooltip}
  onfocus={showTooltip}
  onblur={hideTooltip}
>
  {@render children()}

  {#if isVisible}
    <div
      bind:this={tooltipRef}
      class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 text-sm text-neutral-50 bg-neutral-900 rounded-md border border-neutral-800 whitespace-nowrap z-50 animate-in fade-in-0 zoom-in-95 duration-200"
      role="tooltip"
    >
      {content}
      <div
        class="absolute top-full left-1/2 -translate-x-1/2 -mt-px border-4 border-transparent border-t-neutral-900"
      ></div>
    </div>
  {/if}
</div>
