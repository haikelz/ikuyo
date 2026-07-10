<script lang="ts">
import { buildHierarchy } from "@/helpers/hierarchy";
import type { HeadingTocProps } from "@/types";
import { Button, Sheet, SheetContent, SheetHeader, SheetTitle } from "@ikuyo/ui";
import { Menu, X } from "lucide-svelte";
import TOCHeading from "./TOCHeading.svelte";

let { headings }: { headings: HeadingTocProps[] } = $props();
let isOpen = $state(false);

const rootDepth = $derived(
  headings?.length ? Math.min(...headings.map((heading) => heading.depth)) : 2,
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
    class="bottom-4 right-4 fixed z-[60] rounded-md {isOpen ? 'hidden' : ''}"
    onclick={toggleTOC}
    aria-label="Open table of contents"
  >
    <Menu size={21} />
  </Button>
  <SheetContent
    side="right"
    overlayClass="bg-transparent backdrop-blur-none supports-backdrop-filter:backdrop-blur-none"
    class="h-[min(80svh,32rem)] w-full max-w-none rounded-none border-t border-border/40 bg-background p-4 border-l border-border/40"
    showCloseButton={false}
  >
    <SheetHeader class="space-y-0">
      <div class="flex items-center justify-between space-x-4">
        <SheetTitle
          class="text-base font-semibold tracking-[0.12em] uppercase text-muted-foreground"
        >
          Table of Contents
        </SheetTitle>
        <Button
          variant="ghost"
          size="icon-sm"
          class="shrink-0 rounded-md"
          onclick={toggleTOC}
          aria-label="Close table of contents"
        >
          <X size={21} />
        </Button>
      </div>
    </SheetHeader>
    <ul class="mt-3 min-h-0 flex-1 space-y-2 overflow-y-auto pr-1">
      {#each toc as heading}
        <TOCHeading {heading} />
      {/each}
    </ul>
  </SheetContent>
</Sheet>
