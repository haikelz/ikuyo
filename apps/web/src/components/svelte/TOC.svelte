<script lang="ts">
  import { buildHierarchy } from "@/helpers/hierarchy";
  import { Menu, X } from "lucide-svelte";
  import TOCHeading from "./TOCHeading.svelte";

  let { headings } = $props();
  let isOpen = $state(false);

  const toc = buildHierarchy(headings);

  function toggleTOC() {
    isOpen = !isOpen;
  }
</script>

<button
  class="bottom-4 right-4 p-2 rounded-full bg-neutral-200/70 dark:bg-neutral-900/70 cursor-pointer backdrop-blur-md"
  class:fixed={!isOpen}
  class:hidden={isOpen}
  onclick={toggleTOC}
  ><Menu size={21} />
</button>
<div
  class="right-4 rounded-md backdrop-blur-md p-4 bottom-4 toc z-50 bg-neutral-200/70 dark:bg-neutral-900/70 slide-enter-content"
  class:fixed={isOpen}
  class:hidden={!isOpen}
>
  <div class="font-black space-x-4 text-xl flex justify-between items-center">
    <span>Table of Contents</span><button
      class="rounded-full cursor-pointer"
      onclick={() => toggleTOC()}
      ><X size={21} />
    </button>
  </div>
  {#each toc as heading}
    <TOCHeading {heading} />
  {/each}
</div>
