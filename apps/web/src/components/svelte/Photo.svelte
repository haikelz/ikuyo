<script lang="ts">
import { XIcon } from "lucide-svelte";
import { onMount, tick } from "svelte";
import { fade, scale } from "svelte/transition";

let { src, alt, title } = $props<{
  src: string;
  alt?: string;
  title?: string;
}>();

let selectedImage = $state<string | null>(null);
let imageLoaded = $state(false);

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

async function openLightbox() {
  selectedImage = src;
  await tick();
}

function closeLightbox() {
  selectedImage = null;
}

function handleKeydown(event: KeyboardEvent) {
  if (event.key === "Escape") closeLightbox();
}

function teleport(node: HTMLElement) {
  document.body.appendChild(node);
  return {
    destroy() {
      if (node.parentNode) node.parentNode.removeChild(node);
    },
  };
}

onMount(() => {
  if (!document.documentElement.style.getPropertyValue("--scrollbar-width")) {
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.documentElement.style.setProperty("--scrollbar-width", `${scrollbarWidth}px`);
  }
});
</script>

<svelte:window onkeydown={handleKeydown} />

<div class="photo-container my-8 w-full group">
  <button
    class="overflow-hidden rounded-xl bg-neutral-900 cursor-zoom-in relative block w-full p-0 shadow-lg hover:-translate-y-1 transition-all duration-300 outline-none"
    onclick={openLightbox}
    aria-label="View large image"
  >
    <div
      class="photo-stack relative w-full overflow-hidden rounded-xl bg-neutral-900 transition-transform duration-500 group-hover:scale-105"
    >
      <img
        src={getPlaceholderUrl(src, 200)}
        alt=""
        class="photo-stack-img block w-full h-auto blur-xl m-0! p-0! border-0!"
      />
      <img
        src={optimizeUrl(src, 800)}
        alt={alt ?? ""}
        {title}
        class="photo-stack-img block w-full h-auto transition-opacity duration-300 m-0! p-0! border-0! grayscale group-hover:grayscale-0 group-hover:opacity-90 {imageLoaded
          ? 'opacity-100'
          : 'opacity-0'}"
        loading="lazy"
        onload={() => (imageLoaded = true)}
      />
      <div
        class="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
      ></div>
    </div>
  </button>
  {#if title}
    <p class="mt-2 text-center text-sm text-neutral-400 font-medium italic">
      {title}
    </p>
  {/if}
</div>

{#if selectedImage}
  <div
    use:teleport
    class="fixed inset-0 z-9999 flex items-center justify-center p-4 sm:p-8 bg-black/85 backdrop-blur-xl lightbox-active"
    transition:fade={{ duration: 200 }}
    onclick={closeLightbox}
    onkeydown={handleKeydown}
    role="button"
    tabindex="0"
  >
    <button
      class="fixed top-6 right-6 z-10000 p-3 rounded-full bg-neutral-900/80 text-white hover:bg-neutral-800 transition-all border border-white/20 cursor-pointer shadow-2xl backdrop-blur-md outline-none"
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
      <button
        type="button"
        class="border-0 bg-transparent p-0 cursor-default outline-none max-w-full max-h-full flex items-center justify-center"
        onclick={(e) => e.stopPropagation()}
      >
        <img
          src={optimizeUrl(selectedImage, 1600)}
          alt="Large view"
          class="max-w-full max-h-full object-contain rounded-lg shadow-[0_0_80px_rgba(0,0,0,0.8)] block border-0 m-0 p-0"
          style="user-select: none;"
        />
      </button>
    </div>
  </div>
{/if}

<style>
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
