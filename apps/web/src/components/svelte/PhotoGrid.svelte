<script lang="ts">
import { getPlaceholderUrl, optimizeUrl } from "@/utils/image";
import Lightbox from "./Lightbox.svelte";

// Notes and works use the default 4:3 tiles; /photos switches between square and masonry.
let { images = [], layout = "tiles" } = $props<{
  images: string[];
  layout?: "tiles" | "square" | "masonry";
}>();
const square = $derived(layout === "square");

let loaded = $state<Record<number, boolean>>({});
let selected = $state<number | null>(null);
let tiles = $state<HTMLButtonElement[]>([]);
const slides = $derived(images.map((src: string, i: number) => ({ src, alt: `Photo ${i + 1} of ${images.length}` })));
</script>

{#if layout === "masonry"}
  <div class="masonry-grid my-8 w-full">
    {#each images as image, i}
      <button
        type="button"
        class="masonry-item"
        bind:this={tiles[i]}
        onclick={() => (selected = i)}
        aria-label="View photo {i + 1} of {images.length} in a dialog"
      >
        <div class="photo-stack group relative cursor-zoom-in overflow-hidden">
          <img
            src={getPlaceholderUrl(image, 200)}
            alt=""
            class="photo-stack-img block w-full h-auto m-0! p-0! border-none"
          />
          <img
            src={optimizeUrl(image, 800)}
            alt="Photo {i + 1} of {images.length}"
            class="photo-stack-img block h-auto w-full border-none m-0! p-0! transition-opacity duration-300 {loaded[
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
  <!-- Square tiles share the masonry column counts, so switching layouts keeps the columns. -->
  <div
    class="grid gap-4 my-8 w-full {square
      ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
      : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'}"
  >
    {#each images as image, i}
      <button
        type="button"
        class="photo-item group relative overflow-hidden cursor-zoom-in bg-muted {square ? 'aspect-square' : 'aspect-4/3'}"
        bind:this={tiles[i]}
        onclick={() => (selected = i)}
        aria-label="View photo {i + 1} of {images.length} in a dialog"
      >
        <!-- Both images fill and crop to the tile, so the box keeps its ratio whatever the photo's shape. -->
        <img
          src={getPlaceholderUrl(image)}
          alt=""
          class="absolute inset-0 size-full object-cover m-0! p-0! border-none"
        />
        <img
          src={optimizeUrl(image, 800)}
          alt="Photo {i + 1} of {images.length}"
          class="absolute inset-0 size-full object-cover border-none m-0! p-0! transition-opacity duration-300 {loaded[i] ? 'opacity-100' : 'opacity-0'}"
          loading="lazy"
          onload={() => (loaded = { ...loaded, [i]: true })}
        />
        <div
          class="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        ></div>
      </button>
    {/each}
  </div>
{/if}

<!-- Closing returns focus to the tile of the last photo shown, which the slideshow may have moved. -->
<Lightbox items={slides} bind:index={selected} onclose={(i) => tiles[i]?.focus()} />

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
</style>
