<script lang="ts">
  import { fade, scale } from "svelte/transition";
  import { XIcon } from "lucide-svelte";
  import { onMount, tick } from "svelte";

  let { src, alt, title } = $props<{
    src: string;
    alt?: string;
    title?: string;
  }>();

  let selectedImage = $state<string | null>(null);

  // Function to optimize ImageKit URLs
  function optimizeUrl(url: string, width = 2000) {
    if (url.includes("imagekit.io")) {
      const baseUrl = url.split("?")[0];
      return `${baseUrl}?tr=f-auto,q-100${width ? `,w-${width}` : ""}`;
    }
    return url;
  }

  async function openLightbox() {
    selectedImage = src;
    await tick();
  }

  function closeLightbox() {
    selectedImage = null;
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

  onMount(() => {
    // Measure scrollbar width to prevent layout shift
    if (!document.documentElement.style.getPropertyValue("--scrollbar-width")) {
      const scrollbarWidth =
        window.innerWidth - document.documentElement.clientWidth;
      document.documentElement.style.setProperty(
        "--scrollbar-width",
        `${scrollbarWidth}px`,
      );
    }
  });
</script>

<svelte:window onkeydown={handleKeydown} />

<div class="photo-container my-8 w-full group">
  <button
    class="photo-wrapper overflow-hidden rounded-xl bg-neutral-900 cursor-zoom-in relative block w-full p-0 border-0 outline-none"
    onclick={openLightbox}
    aria-label="View large image"
  >
    <div class="photo-aspect-box">
      <img
        src={optimizeUrl(src)}
        {alt}
        {title}
        class="photo-img block transition-all duration-500 grayscale group-hover:grayscale-0 group-hover:scale-105 group-hover:opacity-90"
        loading="lazy"
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
    class="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-8 bg-black/85 backdrop-blur-[24px] lightbox-active"
    transition:fade={{ duration: 200 }}
    onclick={closeLightbox}
    onkeydown={handleKeydown}
    role="button"
    tabindex="0"
  >
    <button
      class="fixed top-6 right-6 z-[10000] p-3 rounded-full bg-neutral-900/80 text-white hover:bg-neutral-800 transition-all border border-white/20 cursor-pointer shadow-2xl backdrop-blur-md outline-none"
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
      <img
        src={optimizeUrl(selectedImage, 1600)}
        alt="Large view"
        class="max-w-full max-h-full object-contain rounded-lg shadow-[0_0_80px_rgba(0,0,0,0.8)] block border-0 m-0 p-0"
        style="user-select: none;"
        onclick={(e) => e.stopPropagation()}
      />
    </div>
  </div>
{/if}

<style>
  .photo-container {
    width: 100%;
    margin-left: auto;
    margin-right: auto;
  }

  .photo-wrapper {
    position: relative;
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow:
      0 10px 15px -3px rgba(0, 0, 0, 0.2),
      0 4px 6px -2px rgba(0, 0, 0, 0.1);
    width: 100%;
    margin: 0;
    padding: 0;
    background-color: #0a0a0a;
    display: block;
    outline: none;
    transition:
      transform 0.3s ease,
      border-color 0.3s ease;
  }

  .photo-wrapper:hover {
    transform: translateY(-4px);
    border-color: rgba(255, 255, 255, 0.2);
  }

  .photo-aspect-box {
    position: relative;
    width: 100%;
    overflow: hidden;
  }

  .photo-img {
    width: 100% !important;
    height: auto !important;
    display: block !important;
    margin: 0 !important;
    padding: 0 !important;
    border: none !important;
  }
</style>
