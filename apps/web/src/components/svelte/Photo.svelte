<script lang="ts">
import { XIcon } from "lucide-svelte";
import { onMount } from "svelte";

let { src, alt, title } = $props<{
  src: string;
  alt?: string;
  title?: string;
}>();

let selectedImage = $state<string | null>(null);
let imageLoaded = $state(false);
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

function openLightbox(event: MouseEvent & { currentTarget: HTMLButtonElement }) {
  triggerElement = event.currentTarget;
  selectedImage = src;
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
  if (!document.documentElement.style.getPropertyValue("--scrollbar-width")) {
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.documentElement.style.setProperty("--scrollbar-width", `${scrollbarWidth}px`);
  }
});
</script>

<div class="photo-container my-8 w-full group">
  <button
    type="button"
    class="overflow-hidden rounded-none cursor-zoom-in relative block w-full p-0 outline-none bg-muted"
    onclick={openLightbox}
    aria-label={`View ${alt ?? title ?? "image"} in a dialog`}
  >
    <div
      class="photo-stack relative w-full overflow-hidden rounded-none bg-muted transition-transform duration-500 group-hover:scale-105 grid"
    >
      <img
        src={getPlaceholderUrl(src, 200)}
        alt=""
        class="photo-stack-img rounded-none block w-full h-auto m-0! p-0! border-0! col-start-1 row-start-1"
      />
      <img
        src={optimizeUrl(src, 800)}
        alt={alt ?? ""}
        {title}
        class="photo-stack-img rounded-none block w-full h-auto transition-opacity duration-300 m-0! p-0! border-0! grayscale group-hover:grayscale-0 group-hover:opacity-90 col-start-1 row-start-1 {imageLoaded
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
    <p
      class="mt-2 text-center text-sm text-muted-foreground font-medium italic"
    >
      {title}
    </p>
  {/if}
</div>

{#if selectedImage}
  <dialog
    bind:this={dialogElement}
    use:showModal
    class="fixed inset-0 z-9999 m-0 h-full max-h-none w-full max-w-none items-center justify-center border-0 bg-black/70 p-4 open:flex sm:p-8 backdrop:bg-black/70 lightbox-active cursor-zoom-out"
    aria-label="Image viewer"
    onclose={closeLightbox}
    oncancel={closeLightbox}
    onkeydown={(event) => event.key === "Escape" && closeLightbox()}
    onclick={(event) => event.target === event.currentTarget && closeLightbox()}
  >
    <button
      type="button"
      class="fixed top-6 right-6 z-10000 p-3 rounded-md bg-muted text-foreground hover:bg-muted/80 transition-colors cursor-pointer outline-none"
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
      <div class="max-w-full max-h-full flex items-center justify-center">
        <img
          src={optimizeUrl(selectedImage, 1600)}
          alt={alt ?? title ?? "Enlarged view"}
          class="max-w-full max-h-full object-contain rounded-none block border-0 m-0 p-0"
          style="user-select: none;"
        />
      </div>
    </div>
  </dialog>
{/if}
