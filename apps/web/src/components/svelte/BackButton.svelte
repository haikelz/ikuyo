<script lang="ts">
import { Button } from "@ikuyo/ui";
import { ArrowLeftIcon } from "lucide-svelte";

let { label } = $props<{ label: string }>();

function dismiss() {
  history.back();
}
</script>

<Button
  type="button"
  variant="secondary"
  size="icon-sm"
  aria-label={label}
  class="rounded-full"
  onclick={dismiss}
>
  <ArrowLeftIcon class="text-center" />
</Button>
