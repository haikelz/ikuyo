<script lang="ts">
import { Button, Dialog, DialogContent, DialogTitle } from "@ikuyo/ui";
import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-svelte";
import { optimizeUrl } from "@/utils/image";

// One viewer for every photo and video. With more than one item it becomes a slideshow:
// previous and next buttons, the arrow keys, and an opt-in auto-advance.
let {
  items,
  index = $bindable(null),
  onclose,
} = $props<{
  items: { src: string; alt: string; video?: boolean }[];
  index: number | null;
  onclose?: (index: number) => void;
}>();

let playing = $state(false);
let lastIndex = 0;
const item = $derived(index === null ? null : items[index]);
const position = $derived((index ?? 0) + 1);
const slideshow = $derived(items.length > 1);

function step(by: number) {
  if (index !== null) index = (index + by + items.length) % items.length;
}

function close() {
  lastIndex = index ?? lastIndex;
  playing = false;
  index = null;
}

function handleKeydown(event: KeyboardEvent) {
  if (!slideshow) return;
  if (event.key === "ArrowLeft") step(-1);
  if (event.key === "ArrowRight") step(1);
}

// Reading index restarts the timer after every change, so a manual step gets a full interval.
$effect(() => {
  if (!playing || index === null) return;
  const timer = setInterval(() => step(1), 4000);
  return () => clearInterval(timer);
});
</script>

<Dialog bind:open={() => index !== null, (open) => !open && close()}>
  <!-- The content spans the viewport but lets clicks through to the overlay, so clicking beside
       the media closes the viewer; the media and controls take clicks back. -->
  <DialogContent
    class="pointer-events-none top-0 left-0 grid h-full w-full max-w-none translate-x-0 translate-y-0 grid-rows-[minmax(0,1fr)_auto] place-items-center gap-4 rounded-none border-0 bg-transparent p-4 shadow-none *:pointer-events-auto sm:max-w-none sm:p-8"
    onkeydown={handleKeydown}
    onCloseAutoFocus={(event) => {
      event.preventDefault();
      onclose?.(lastIndex);
    }}
  >
    {#if item}
      <DialogTitle class="sr-only">{item.alt}</DialogTitle>
      {#if item.video}
        <video
          src={item.src}
          class="m-0 block max-h-full max-w-full object-contain"
          controls
          autoplay
          aria-label={item.alt}
        >
          <track kind="captions" />
        </video>
      {:else}
        <img
          src={optimizeUrl(item.src, 1600)}
          alt={item.alt}
          class="m-0 block max-h-full max-w-full select-none object-contain"
        />
      {/if}
      {#if slideshow}
        <div class="flex items-center gap-2">
          <Button variant="outline" size="icon-sm" aria-label="Previous photo" onclick={() => step(-1)}>
            <ChevronLeft class="size-4" aria-hidden="true" />
          </Button>
          <Button
            variant="outline"
            size="icon-sm"
            aria-label={playing ? "Pause slideshow" : "Play slideshow"}
            aria-pressed={playing}
            onclick={() => (playing = !playing)}
          >
            {#if playing}
              <Pause class="size-4" aria-hidden="true" />
            {:else}
              <Play class="size-4" aria-hidden="true" />
            {/if}
          </Button>
          <span
            class="min-w-16 rounded-md bg-background px-2 py-1 text-center text-xs font-medium tabular-nums text-foreground"
            aria-live="polite"
          >
            {position} / {items.length}
          </span>
          <Button variant="outline" size="icon-sm" aria-label="Next photo" onclick={() => step(1)}>
            <ChevronRight class="size-4" aria-hidden="true" />
          </Button>
        </div>
      {/if}
    {/if}
  </DialogContent>
</Dialog>
