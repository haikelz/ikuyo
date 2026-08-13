<script lang="ts">
import { XIcon } from "lucide-svelte";
import { onMount } from "svelte";

let { images = [], masonry = false } = $props<{
  images: string[];
  masonry?: boolean;
}>();

let selectedImage = $state<string | null>(null);
let loaded = $state<Record<number, boolean>>({});
let triggerElement: HTMLButtonElement | null = null;
let dialogElement = $state<HTMLDialogElement | null>(null);

function optimizeUrl(url: string, width: number, quality = 85) {
  if (url.includes("imagekit.io")) {
    const baseUrl = url.split("?")[0];
    return `${baseUrl}?tr=f-auto,q-${quality},w-${width}`;
  }
  return url;
}

function getPlaceholderUrl(url: string, size = 40) {
  return optimizeUrl(url, size, 20);
}

function openLightbox(photo: string, trigger: HTMLButtonElement) {
  triggerElement = trigger;
  selectedImage = photo;
}

function closeLightbox() {
  if (dialogElement?.open) dialogElement.close();
  selectedImage = null;
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

onMount(() => {
  const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
  document.documentElement.style.setProperty("--scrollbar-width", `${scrollbarWidth}px`);
});
</script>

{#if masonry}
  <div class="masonry-grid my-8 w-full">
    {#each images as image, i}
      <button
        type="button"
        class="masonry-item"
        onclick={(event) => openLightbox(image, event.currentTarget)}
        aria-label="View photo {i + 1} of {images.length} in a dialog"
      >
        <div
          class="photo-stack group relative cursor-zoom-in overflow-hidden border border-border bg-muted"
        >
          <img
            src={getPlaceholderUrl(image, 200)}
            alt=""
            class="photo-stack-img block w-full h-auto m-0! p-0! border-0!"
          />
          <img
            src={optimizeUrl(image, 800)}
            alt="Photo {i + 1} of {images.length}"
            class="photo-stack-img block h-auto w-full border-0! m-0! p-0! transition-opacity duration-300 {loaded[
              i
            ]
              ? 'opacity-100'
              : 'opacity-0'}"
            loading="lazy"
            onload={() => (loaded = { ...loaded, [i]: true })}
          />
          <div
            class="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          ></div>
        </div>
      </button>
    {/each}
  </div>
{:else}
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 my-8 w-full">
    {#each images as image, i}
      <button
        type="button"
        class="photo-item group relative aspect-4/3 cursor-zoom-in overflow-hidden border border-border bg-muted"
        onclick={(event) => openLightbox(image, event.currentTarget)}
        aria-label="View photo {i + 1} of {images.length} in a dialog"
      >
        <div class="photo-stack absolute inset-0">
          <img
            src={getPlaceholderUrl(image)}
            alt=""
            class="photo-stack-img w-full h-full object-cover m-0! p-0! border-0!"
          />
          <img
            src={optimizeUrl(image, 800)}
            alt="Photo {i + 1} of {images.length}"
            class="photo-stack-img h-full w-full border-0! m-0! p-0! object-cover grayscale transition-[filter,opacity] duration-300 group-hover:grayscale-0 {loaded[
              i
            ]
              ? 'opacity-100'
              : 'opacity-0'}"
            loading="lazy"
            onload={() => (loaded = { ...loaded, [i]: true })}
          />
        </div>
        <div
          class="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        ></div>
      </button>
    {/each}
  </div>
{/if}

{#if selectedImage}
  <dialog
    bind:this={dialogElement}
    use:showModal
    class="fixed inset-0 z-9999 m-0 h-full max-h-none w-full max-w-none items-center justify-center border-0 bg-black/70 p-4 open:flex sm:p-8 backdrop:bg-black/70 lightbox-active"
    aria-label="Photo viewer"
    onclose={closeLightbox}
    oncancel={closeLightbox}
    onkeydown={(event) => event.key === "Escape" && closeLightbox()}
    onclick={(event) => event.target === event.currentTarget && closeLightbox()}
  >
    <button
      type="button"
      class="fixed top-6 right-6 z-10000 cursor-pointer border border-border bg-background p-3 text-foreground outline-none transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring"
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
      <img
        src={optimizeUrl(selectedImage, 1600)}
        alt="Enlarged gallery item"
        class="block max-h-full max-w-full border border-border object-contain m-0 p-0"
        style="user-select: none;"
      />
    </div>
  </dialog>
{/if}

<style>
  .masonry-grid {
    columns: 4;
    column-gap: 1rem;
  }

  @media (max-width: 1023px) {
    .masonry-grid {
      columns: 3;
    }
  }

  @media (max-width: 767px) {
    .masonry-grid {
      columns: 2;
    }
  }

  .masonry-item {
    border: 0;
    padding: 0;
    width: 100%;
    background: transparent;
    break-inside: avoid;
    margin-bottom: 1rem;
    cursor: zoom-in;
  }

  .masonry-item:focus-visible,
  .photo-item:focus-visible {
    outline: 2px solid var(--ring);
    outline-offset: 2px;
  }

  .photo-stack {
    display: grid;
  }

  .photo-stack-img {
    grid-area: 1 / 1;
  }

  :global(.lightbox-active) {
    cursor: zoom-out;
  }
</style>
