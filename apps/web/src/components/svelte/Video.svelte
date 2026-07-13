<script lang="ts">
import { PlayIcon, XIcon } from "lucide-svelte";
import { tick } from "svelte";
import { fade, scale } from "svelte/transition";

let { src, title } = $props<{
  src: string;
  title?: string;
}>();

let selectedVideo = $state<string | null>(null);

async function openLightbox() {
  selectedVideo = src;
  await tick();
}

function closeLightbox() {
  selectedVideo = null;
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === "Escape") {
    closeLightbox();
  }
}

function teleport(node: HTMLElement) {
  document.body.appendChild(node);
  return {
    destroy() {
      if (node.parentNode) {
        node.parentNode.removeChild(node);
      }
    },
  };
}
</script>

<svelte:window onkeydown={handleKeydown} />

<div class="video-container my-8 w-full group">
  <button
    class="overflow-hidden rounded-none bg-muted cursor-pointer relative block w-full p-0 border border-border/70 outline-none hover:border-border/60 transition-colors"
    onclick={openLightbox}
    aria-label="View large video"
  >
    <div class="relative w-full overflow-hidden">
      <video
        {src}
        class="block w-full h-auto m-0! p-0! border-none!"
        playsinline
      >
        <track kind="captions" />
      </video>
      <div
        class="absolute inset-0 flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity duration-300"
      >
        <div
          class="p-4 rounded-md bg-background/80 border border-border/70 text-foreground"
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

{#if selectedVideo}
  <div
    use:teleport
    class="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-8 bg-black/70 lightbox-active cursor-zoom-out"
    transition:fade={{ duration: 200 }}
    onclick={closeLightbox}
    onkeydown={handleKeydown}
    role="button"
    tabindex="0"
  >
    <button
      class="fixed top-6 right-6 z-[10000] p-3 rounded-md bg-muted text-foreground hover:bg-muted/80 transition-colors cursor-pointer outline-none"
      onclick={(e) => {
        e.stopPropagation();
        closeLightbox();
      }}
      aria-label="Close lightbox"
    >
      <XIcon size={24} />
    </button>

    <div
      class="relative w-full h-full max-w-7xl flex items-center justify-center p-0"
      transition:scale={{ duration: 300, start: 0.95, opacity: 0 }}
      role="presentation"
    >
      <video
        src={selectedVideo}
        class="max-w-full max-h-full object-contain border-none! block m-0 p-0"
        controls
        autoplay
        onclick={(e) => e.stopPropagation()}
      >
        <track kind="captions" />
      </video>
    </div>
  </div>
{/if}
