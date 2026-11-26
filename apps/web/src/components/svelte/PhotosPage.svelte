<script lang="ts">
import { buttonVariants } from "@ikuyo/ui";
import { LayoutDashboard, LayoutGrid } from "lucide-svelte";
import { fade } from "svelte/transition";
import PhotoGrid from "./PhotoGrid.svelte";

type Photo = {
  url: string;
  thumbnail: string;
};
type GalleryLayout = "square" | "masonry";

let { photos = [] } = $props<{ photos: Photo[] }>();

const storageKey = "photos-layout";
const layouts = [
  { value: "square", label: "Square grid", icon: LayoutGrid },
  { value: "masonry", label: "Bento grid", icon: LayoutDashboard },
] as const;

// The choice is a per-browser convenience; storage can throw in private windows, so square is the fallback.
function readLayout(): GalleryLayout {
  try {
    return localStorage.getItem(storageKey) === "masonry" ? "masonry" : "square";
  } catch {
    return "square";
  }
}

let layout = $state<GalleryLayout>(readLayout());

function choose(value: GalleryLayout) {
  layout = value;
  try {
    localStorage.setItem(storageKey, value);
  } catch {}
}
</script>

<div transition:fade={{ duration: 300 }}>
  <div role="group" aria-label="Photo layout" class="flex justify-end gap-0.5">
    {#each layouts as option}
      <button
        type="button"
        data-cy="photos-layout-{option.value}"
        aria-label={option.label}
        title={option.label}
        aria-pressed={layout === option.value}
        onclick={() => choose(option.value)}
        class={buttonVariants({
          variant: "ghost",
          size: "icon-sm",
          class: "aria-pressed:bg-secondary aria-pressed:text-foreground",
        })}
      >
        <option.icon class="size-4" aria-hidden="true" />
      </button>
    {/each}
  </div>
  <PhotoGrid images={photos.map((photo: Photo) => photo.url)} {layout} />
</div>
