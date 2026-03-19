<script lang="ts">
  import { ArrowLeftIcon } from "lucide-svelte";

  let { label } = $props<{ label: string }>();

  function dismiss() {
    history.back();
  }
</script>

<button
  type="button"
  aria-label={label}
  class="flex h-8 w-8 items-center justify-center cursor-pointer rounded-full bg-neutral-900"
  onclick={dismiss}
>
  <ArrowLeftIcon className="text-center" />
</button>
