<script lang="ts">
  import { cn, type WithoutChildrenOrChild } from "@/lib/utils";
  import { Progress as ProgressPrimitive } from "bits-ui";

  let {
    ref = $bindable(null),
    class: className,
    max = 100,
    value,
    ...restProps
  }: WithoutChildrenOrChild<ProgressPrimitive.RootProps> = $props();
</script>

<ProgressPrimitive.Root
  bind:ref
  data-slot="progress"
  class={cn(
    "bg-muted h-3 rounded-4xl relative flex w-full items-center overflow-x-hidden",
    className
  )}
  {value}
  {max}
  {...restProps}
>
  <div
    data-slot="progress-indicator"
    class="bg-primary size-full flex-1 transition-all"
    style="transform: translateX(-{100 - (100 * (value ?? 0)) / (max ?? 1)}%)"
  ></div>
</ProgressPrimitive.Root>
