<script lang="ts">
import { buildHierarchy } from "@/helpers/hierarchy";
import { Button } from "@ikuyo/ui";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@ikuyo/ui";
import { Menu, X } from "lucide-svelte";
import TOCHeading from "./TOCHeading.svelte";

let { headings } = $props();
let isOpen = $state(false);

const toc = $derived(buildHierarchy(headings));

function toggleTOC() {
  isOpen = !isOpen;
}
</script>

<Sheet bind:open={isOpen}>
  <Button
    variant="secondary"
    size="icon-sm"
    class="bottom-4 right-4 fixed z-50 rounded-full md:hidden {isOpen
      ? 'hidden'
      : ''}"
    onclick={toggleTOC}
    aria-label="Open table of contents"
  >
    <Menu size={21} />
  </Button>
  <SheetContent
    side="bottom"
    class="right-4 rounded-md backdrop-blur-md p-4 bottom-4 toc z-50 bg-neutral-900/90 slide-enter-content md:max-w-md border-neutral-800"
    showCloseButton={false}
  >
    <SheetHeader class="space-y-0">
      <div class="font-black space-x-4 text-xl flex justify-between items-center">
        <SheetTitle>Table of Contents</SheetTitle>
        <Button
          variant="ghost"
          size="icon-sm"
          class="rounded-full shrink-0"
          onclick={() => toggleTOC()}
          aria-label="Close table of contents"
        >
          <X size={21} />
        </Button>
      </div>
    </SheetHeader>
    {#each toc as heading}
      <TOCHeading {heading} />
    {/each}
  </SheetContent>
</Sheet>
