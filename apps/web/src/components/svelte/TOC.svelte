<script lang="ts">
import { buildHierarchy } from "@/helpers/hierarchy";
import type { HeadingTocProps } from "@/types";
import { Button } from "@ikuyo/ui";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@ikuyo/ui";
import { Menu, X } from "lucide-svelte";
import TOCHeading from "./TOCHeading.svelte";

let { headings }: { headings: HeadingTocProps[] } = $props();
let isOpen = $state(false);

const rootDepth = $derived(
  headings?.length ? Math.min(...headings.map((heading) => heading.depth)) : 2
);
const toc = $derived(buildHierarchy(headings, rootDepth));

function toggleTOC() {
  isOpen = !isOpen;
}
</script>

<Sheet bind:open={isOpen}>
  <Button
    variant="secondary"
    size="icon-sm"
    class="bottom-4 right-4 fixed z-[60] rounded-full {isOpen ? 'hidden' : ''}"
    onclick={toggleTOC}
    aria-label="Open table of contents"
  >
    <Menu size={21} />
  </Button>
  <SheetContent
    side="bottom"
    overlayClass="bg-transparent backdrop-blur-none"
    class="mx-auto mb-4 w-[calc(100%-1.5rem)] max-w-xl rounded-2xl border border-neutral-700/70 bg-background/35 p-4 shadow-2xl backdrop-blur-md md:hidden"
    showCloseButton={false}
  >
    <SheetHeader class="space-y-0">
      <div class="flex items-center justify-between space-x-4">
        <SheetTitle class="text-base font-semibold tracking-[0.12em] uppercase text-neutral-200">
          Table of Contents
        </SheetTitle>
        <Button
          variant="ghost"
          size="icon-sm"
          class="shrink-0 rounded-full"
          onclick={toggleTOC}
          aria-label="Close table of contents"
        >
          <X size={21} />
        </Button>
      </div>
    </SheetHeader>
    <ul class="mt-3 space-y-2">
      {#each toc as heading}
        <TOCHeading {heading} />
      {/each}
    </ul>
  </SheetContent>
  <SheetContent
    side="right"
    overlayClass="bg-transparent backdrop-blur-none"
    class="mt-4 mr-4 hidden h-[calc(100%-2rem)] w-[24rem] rounded-2xl border border-neutral-700/70 bg-background/35 p-4 shadow-2xl backdrop-blur-md md:block"
    showCloseButton={false}
  >
    <SheetHeader class="space-y-0">
      <div class="flex items-center justify-between space-x-4">
        <SheetTitle class="text-sm font-semibold tracking-[0.12em] uppercase text-neutral-200">
          Table of Contents
        </SheetTitle>
        <Button
          variant="ghost"
          size="icon-sm"
          class="shrink-0 rounded-full"
          onclick={toggleTOC}
          aria-label="Close table of contents"
        >
          <X size={21} />
        </Button>
      </div>
    </SheetHeader>
    <ul class="mt-3 max-h-[calc(100vh-8rem)] space-y-2 overflow-y-auto pr-1">
      {#each toc as heading}
        <TOCHeading {heading} />
      {/each}
    </ul>
  </SheetContent>
</Sheet>
