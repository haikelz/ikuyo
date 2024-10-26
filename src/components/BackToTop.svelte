<script lang="ts">
  import { ArrowUpIcon } from "lucide-svelte";
  import { twMerge } from "tailwind-merge";

  function handleClick() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
</script>

<button
  class={twMerge(
    "fixed flex justify-center items-center p-2 space-x-5",
    "w-fit border-[0.5px] right-4 bottom-4 rounded-full transition-all hover:bg-base-1/70",
    "bg-base-0/70 transition-all backdrop-blur-md border-base-2 z-50"
  )}
  type="button"
  aria-label="back to top"
  on:click={handleClick}
>
  <ArrowUpIcon class="text-base-5" />
</button>
