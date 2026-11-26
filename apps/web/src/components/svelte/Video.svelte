<script lang="ts">
import { PlayIcon } from "lucide-svelte";
import Lightbox from "./Lightbox.svelte";

let { src, title } = $props<{
  src: string;
  title?: string;
}>();

let selected = $state<number | null>(null);
let trigger = $state<HTMLButtonElement | null>(null);
</script>

<div class="video-container my-8 w-full group">
  <button
    type="button"
    class="overflow-hidden bg-muted cursor-pointer relative block w-full p-0 border border-border hover:border-primary/40 transition-colors"
    bind:this={trigger}
    onclick={() => (selected = 0)}
    aria-label={`Play ${title ?? "video"} in a dialog`}
  >
    <div class="relative w-full overflow-hidden">
      <video
        {src}
        class="block w-full h-auto m-0! p-0! border-none!"
        playsinline
        muted
        aria-hidden="true"
        tabindex="-1"
      >
        <track kind="captions" />
      </video>
      <div
        class="absolute inset-0 flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity duration-300"
      >
        <div
          class="p-4 rounded-md bg-background/80 border border-border text-foreground"
        >
          <PlayIcon size={28} fill="currentColor" />
        </div>
      </div>
    </div>
  </button>
  {#if title}
    <p class="mt-2 text-center text-sm text-muted-foreground">
      {title}
    </p>
  {/if}
</div>

<Lightbox items={[{ src, alt: title ?? "Video", video: true }]} bind:index={selected} onclose={() => trigger?.focus()} />
