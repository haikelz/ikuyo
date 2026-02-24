<script lang="ts">
  import { fade, scale } from "svelte/transition";
  import { XIcon } from "lucide-svelte";
  import { onMount, tick } from "svelte";

  let { images = [] } = $props<{ images: string[] }>();

  let selectedImage = $state<string | null>(null);

  // Function to optimize ImageKit URLs
  function optimizeUrl(url: string, width = 2000) {
    if (url.includes("imagekit.io")) {
      const baseUrl = url.split("?")[0];
      return `${baseUrl}?tr=f-auto,q-100${width ? `,w-${width}` : ""}`;
    }
    return url;
  }

  async function openLightbox(image: string) {
    selectedImage = image;
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

  // Teleport action to move modal to body
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

  // Scrollbar width measurement for smooth lock
  onMount(() => {
    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;
    document.documentElement.style.setProperty(
      "--scrollbar-width",
      `${scrollbarWidth}px`,
    );
  });
</script>

<svelte:window onkeydown={handleKeydown} />

<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 my-8 w-full">
  {#each images as image, i}
    <div
      class="photo-item aspect-[4/3] relative overflow-hidden rounded-xl bg-neutral-900 group cursor-zoom-in border border-white/10 shadow-lg hover:-translate-y-1 hover:border-white/20 transition-all duration-300"
      onclick={() => openLightbox(image)}
      onkeydown={(e) => e.key === "Enter" && openLightbox(image)}
      role="button"
      tabindex="0"
      aria-label="View large image {i + 1}"
    >
      <img
        src={optimizeUrl(image)}
        alt="Blog post image {i + 1}"
        class="absolute inset-0 w-full h-full object-cover transition-all duration-500 grayscale group-hover:grayscale-0 group-hover:scale-110 group-hover:opacity-90 block m-0! p-0!"
        loading="lazy"
      />
      <div
        class="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
      ></div>
    </div>
  {/each}
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
  /* Keeps the lightbox transition smooth and clean */
  :global(.lightbox-active) {
    cursor: zoom-out;
  }
</style>
