<script lang="ts">
  import { fade, scale } from "svelte/transition";
  import { XIcon, PlayIcon } from "lucide-svelte";
  import { tick } from "svelte";

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
    class="video-wrapper overflow-hidden rounded-xl bg-neutral-900 cursor-zoom-in relative block w-full p-0 border-0 outline-none"
    onclick={openLightbox}
    aria-label="View large video"
  >
    <div class="video-aspect-box">
      <video
        {src}
        class="video-el block transition-all duration-500 grayscale group-hover:grayscale-0 group-hover:scale-105 group-hover:opacity-90"
        playsinline
      >
        <track kind="captions" />
      </video>
      <div
        class="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
      ></div>
      <div
        class="absolute inset-0 flex items-center justify-center opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300 pointer-events-none"
      >
        <div
          class="p-4 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white"
        >
          <PlayIcon size={32} fill="currentColor" />
        </div>
      </div>
    </div>
  </button>
  {#if title}
    <p class="mt-2 text-center text-sm text-neutral-400 font-medium italic">
      {title}
    </p>
  {/if}
</div>

{#if selectedVideo}
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
      <video
        src={selectedVideo}
        class="max-w-full max-h-full object-contain rounded-lg shadow-[0_0_80px_rgba(0,0,0,0.8)] block border-0 m-0 p-0"
        controls
        autoplay
        onclick={(e) => e.stopPropagation()}
      >
        <track kind="captions" />
      </video>
    </div>
  </div>
{/if}

<style>
  .video-container {
    width: 100%;
    margin-left: auto;
    margin-right: auto;
  }

  .video-wrapper {
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

  .video-wrapper:hover {
    transform: translateY(-4px);
    border-color: rgba(255, 255, 255, 0.2);
  }

  .video-aspect-box {
    position: relative;
    width: 100%;
    overflow: hidden;
  }

  .video-el {
    width: 100% !important;
    height: auto !important;
    display: block !important;
    margin: 0 !important;
    padding: 0 !important;
    border: none !important;
  }
</style>
