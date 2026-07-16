<script lang="ts">
import { PlayIcon, XIcon } from "lucide-svelte";

let { src, title } = $props<{
  src: string;
  title?: string;
}>();

let selectedVideo = $state<string | null>(null);
let triggerElement: HTMLButtonElement | null = null;
let dialogElement = $state<HTMLDialogElement | null>(null);

function openLightbox(event: MouseEvent & { currentTarget: HTMLButtonElement }) {
  triggerElement = event.currentTarget;
  selectedVideo = src;
}

function closeLightbox() {
  if (dialogElement?.open) dialogElement.close();
  selectedVideo = null;
  requestAnimationFrame(() => triggerElement?.focus());
}

function showModal(node: HTMLDialogElement) {
  node.showModal();
  return {
    destroy() {
      if (node.open) node.close();
    },
  };
}
</script>

<div class="video-container my-8 w-full group">
  <button
    type="button"
    class="overflow-hidden rounded-none bg-muted cursor-pointer relative block w-full p-0 border border-border/70 outline-none hover:border-border/60 transition-colors"
    onclick={openLightbox}
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
  <dialog
    bind:this={dialogElement}
    use:showModal
    class="fixed inset-0 z-[9999] m-0 h-full max-h-none w-full max-w-none items-center justify-center border-0 bg-black/70 p-4 open:flex sm:p-8 backdrop:bg-black/70 lightbox-active cursor-zoom-out"
    aria-label="Video player"
    onclose={closeLightbox}
    oncancel={closeLightbox}
    onkeydown={(event) => event.key === "Escape" && closeLightbox()}
    onclick={(event) => event.target === event.currentTarget && closeLightbox()}
  >
    <button
      type="button"
      class="fixed top-6 right-6 z-[10000] p-3 rounded-md bg-muted text-foreground hover:bg-muted/80 transition-colors cursor-pointer outline-none"
      onclick={(e) => {
        e.stopPropagation();
        closeLightbox();
      }}
      aria-label="Close lightbox"
      autofocus
    >
      <XIcon size={24} />
    </button>

    <div
      class="relative w-full h-full max-w-7xl flex items-center justify-center p-0"
      role="document"
    >
      <video
        src={selectedVideo}
        class="max-w-full max-h-full object-contain border-none! block m-0 p-0"
        controls
        autoplay
        aria-label={title ?? "Video"}
      >
        <track kind="captions" />
      </video>
    </div>
  </dialog>
{/if}
