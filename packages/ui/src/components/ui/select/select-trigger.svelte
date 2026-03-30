<script lang="ts">
  import { cn } from "../../../lib/utils";
  import { Select as SelectPrimitive } from "bits-ui";
  import { ChevronDown } from "lucide-svelte";

  let {
    ref = $bindable(null),
    class: className,
    children,
    ...restProps
  }: SelectPrimitive.TriggerProps = $props();
</script>

<SelectPrimitive.Trigger
  bind:ref
  data-slot="select-trigger"
  class={cn(
    "border-input bg-transparent ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring data-[placeholder]:text-muted-foreground [&_svg]:text-muted-foreground inline-flex h-9 w-full items-center justify-between gap-2 rounded-md border px-3 py-2 text-sm whitespace-nowrap transition-colors outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
    className
  )}
  {...restProps}
>
  {@render children?.()}
  <ChevronDown class="size-4 shrink-0 opacity-60" />
</SelectPrimitive.Trigger>
