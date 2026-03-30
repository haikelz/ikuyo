<script lang="ts">
  import { Select as SelectPrimitive } from "bits-ui";

  let {
    value = $bindable(),
    open = $bindable(false),
    ...restProps
  }: SelectPrimitive.RootProps = $props();
</script>

<SelectPrimitive.Root bind:value bind:open data-slot="select" {...restProps} />
