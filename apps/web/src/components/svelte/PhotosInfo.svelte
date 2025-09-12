<script lang="ts">
  import { InfoIcon, XIcon } from "lucide-svelte";

  let isOpen = $state(false);

  function togglePhotosInfo() {
    isOpen = !isOpen;
  }
</script>

{#if isOpen}
  <div
    class="flex fixed top-4 left-4 backdrop-blur-md backdrop-sepia-50 min-h-svh justify-center items-center w-full max-w-full h-full"
  >
    <div class="fixed">
      <div class="rounded-md bg-neutral-200 dark:bg-neutral-900 p-4">
        <p
          class="text-justify font-semibold text-base text-neutral-900 dark:text-neutral-50"
        >
          Thank you for visiting my Gallery!
        </p>
        <p class="text-sm text-neutral-900 dark:text-neutral-50 mt-2">
          All of the photos are taken with my Sony camera.
        </p>
      </div>
    </div>
  </div>
{/if}

<button
  class="rounded-md bg-neutral-200 dark:bg-neutral-900 cursor-pointer p-2 fixed bottom-4 left-4"
  type="button"
  aria-label="photos info"
  onclick={togglePhotosInfo}
>
  {#if isOpen}
    <XIcon size={18} class="text-neutral-900 dark:text-neutral-50" />
  {:else}
    <InfoIcon size={18} class="text-neutral-900 dark:text-neutral-50" />
  {/if}
</button>
