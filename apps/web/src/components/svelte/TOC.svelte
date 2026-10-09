<script lang="ts">
  import { buildHierarchy } from "@/helpers/hierarchy";
  import type { HeadingTocProps } from "@/types";
  import {
    Button,
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
  } from "@ikuyo/ui";
  import { List, X } from "lucide-svelte";
  import { onMount } from "svelte";
  import TOCHeading from "./TOCHeading.svelte";

  let { headings }: { headings: HeadingTocProps[] } = $props();
  let isOpen = $state(false);
  let activeSlug = $state("");

  onMount(() => {
    const sections = headings.map((heading) => document.getElementById(heading.slug)).filter((element): element is HTMLElement => element !== null);
    let frame = 0;
    function update() {
      frame = 0;
      let current = sections[0];
      for (const section of sections) {
        if (section.getBoundingClientRect().top <= 128) current = section;
      }
      activeSlug = current?.id ?? "";
    }
    function schedule() {
      if (!frame) frame = requestAnimationFrame(update);
    }
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  });

  const rootDepth = $derived(
    headings?.length
      ? Math.min(...headings.map((heading) => heading.depth))
      : 2,
  );
  const toc = $derived(buildHierarchy(headings, rootDepth));

  function toggleTOC() {
    isOpen = !isOpen;
  }
</script>

<nav
  class="fixed right-[max(1rem,calc(50%-47rem))] top-28 z-10 hidden max-h-[calc(100dvh-8rem)] w-56 overflow-y-auto border-s border-dashed border-border/70 ps-5 2xl:block"
  aria-label="On this page"
>
  <p
    class="mb-4 mt-0 font-mono text-[0.6875rem] font-medium uppercase tracking-[0.14em] text-muted-foreground"
  >
    On this page
  </p>
  <ul class="m-0 space-y-1 p-0" role="list">
    {#each toc as heading}
      <TOCHeading {heading} {activeSlug} />
    {/each}
  </ul>
</nav>

<Sheet bind:open={isOpen} position="right">
  <Button
    variant="outline"
    size="icon-sm"
    class="bottom-4 right-4 fixed z-40 rounded-md 2xl:hidden bg-background {isOpen
      ? 'hidden'
      : ''}"
    onclick={toggleTOC}
    aria-label="Open table of contents"
  >
    <List size={21} />
  </Button>
  <SheetContent
    side="right"
    overlayClass="bg-background/40 backdrop-blur-sm"
    class="w-full overflow-x-hidden border-l border-border bg-card p-0 shadow-lg"
    showCloseButton={false}
  >
    <SheetHeader
      class="mx-auto w-full max-w-2xl space-y-0 border-b border-border/70 px-4 py-4 sm:px-6"
    >
      <div class="flex items-center justify-between space-x-4">
        <SheetTitle
          class="text-sm font-semibold tracking-tight text-foreground"
        >
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
      <ul
        class="mx-auto w-full max-w-2xl space-y-2 px-4 py-4 sm:px-6"
        role="list"
      >
        {#each toc as heading}
          <TOCHeading {heading} {activeSlug} onNavigate={() => (isOpen = false)} />
        {/each}
      </ul>
    </div>
  </SheetContent>
</Sheet>
