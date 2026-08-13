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

<aside
  class="fixed top-28 right-[max(1.5rem,calc((100vw-56rem)/2-15.5rem))] z-10 hidden max-h-[calc(100dvh-8rem)] w-56 overflow-y-auto border-s border-border/70 ps-5 xl:block"
  aria-label="On this page"
>
  <p
    class="mb-4 mt-0 font-mono text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-muted-foreground"
  >
    On this page
  </p>
  <ul class="m-0 space-y-1 p-0" role="list">
    {#each toc as heading}
      <TOCHeading {heading} />
    {/each}
  </ul>
</aside>

<Sheet bind:open={isOpen}>
  <Button
    variant="outline"
    size="icon-sm"
    class="bottom-4 right-4 fixed z-40 rounded-md xl:hidden {isOpen ? 'hidden' : ''}"
    onclick={toggleTOC}
    aria-label="Open table of contents"
  >
    <Menu size={21} />
  </Button>
  <SheetContent
    side="bottom"
    overlayClass="bg-background/40 backdrop-blur-sm"
    class="max-h-[min(72svh,36rem)] w-full overflow-x-hidden rounded-none border-t border-border/70 bg-background p-0 shadow-none"
    showCloseButton={false}
  >
    <SheetHeader class="mx-auto w-full max-w-2xl space-y-0 border-b border-border/70 px-4 py-4 sm:px-6">
      <div class="flex items-center justify-between space-x-4">
        <SheetTitle class="text-sm font-semibold tracking-tight text-foreground">
          On this page
        </SheetTitle>
        <Button
          variant="outline"
          size="icon-sm"
          class="shrink-0 rounded-md"
          onclick={toggleTOC}
          aria-label="Close table of contents"
        >
          <X size={21} />
        </Button>
      </div>
    </SheetHeader>
    <div class="min-h-0 flex-1 overflow-y-auto">
      <ul class="mx-auto w-full max-w-2xl space-y-2 px-4 py-4 sm:px-6" role="list">
        {#each toc as heading}
          <TOCHeading {heading} onNavigate={() => (isOpen = false)} />
        {/each}
      </ul>
    </div>
  </SheetContent>
</Sheet>
