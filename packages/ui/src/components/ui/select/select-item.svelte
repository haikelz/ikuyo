<script lang="ts">
  import { cn } from "../../../lib/utils";
  import { Select as SelectPrimitive } from "bits-ui";
  import { Check } from "lucide-svelte";

  let {
    ref = $bindable(null),
    class: className,
    children: childrenProp,
    ...restProps
  }: SelectPrimitive.ItemProps = $props();
</script>

<SelectPrimitive.Item
  bind:ref
  data-slot="select-item"
  class={cn(
    "focus:bg-accent focus:text-accent-foreground data-[highlighted]:bg-accent data-[highlighted]:text-accent-foreground relative flex w-full cursor-default items-center rounded-sm py-1.5 pr-8 pl-2 text-sm outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
    className
  )}
  {...restProps}
>
  {#snippet children({ selected })}
    <span
      class="absolute right-2 inline-flex size-3.5 items-center justify-center text-current"
    >
      {#if selected}
        <Check class="size-3.5" />
      {/if}
    </span>
    <span class="truncate">
      {@render childrenProp?.()}
    </span>
  {/snippet}
</SelectPrimitive.Item>
