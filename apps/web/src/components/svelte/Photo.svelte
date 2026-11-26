<script lang="ts">
import { getPlaceholderUrl, optimizeUrl } from "@/utils/image";
import Lightbox from "./Lightbox.svelte";

let { src, alt, title } = $props<{
  src: string;
  alt?: string;
  title?: string;
}>();

let imageLoaded = $state(false);
let selected = $state<number | null>(null);
let trigger = $state<HTMLButtonElement | null>(null);
</script>

<div class="photo-container my-8 w-full group">
  <button
    type="button"
    class="overflow-hidden cursor-zoom-in relative block w-full p-0 bg-muted"
    bind:this={trigger}
    onclick={() => (selected = 0)}
    aria-label={`View ${alt ?? title ?? "image"} in a dialog`}
  >
    <div
      class="photo-stack relative w-full overflow-hidden bg-muted transition-transform duration-500 group-hover:scale-[1.02] grid"
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

<Lightbox items={[{ src, alt: alt ?? title ?? "Image" }]} bind:index={selected} onclose={() => trigger?.focus()} />
