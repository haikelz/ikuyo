<script lang="ts">
import { ToggleGroup, ToggleGroupItem } from "@ikuyo/ui";
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
  <!-- A single-choice group lets the active item be pressed again to clear it; the setter ignores
       the empty value so one layout stays chosen. -->
  <ToggleGroup
    type="single"
    size="sm"
    spacing={1}
    aria-label="Photo layout"
    class="ml-auto"
    bind:value={() => layout, (value: string) => value && choose(value as GalleryLayout)}
  >
    {#each layouts as option}
      <ToggleGroupItem
        value={option.value}
        data-cy="photos-layout-{option.value}"
        aria-label={option.label}
        title={option.label}
        class="px-0 text-muted-foreground data-[state=on]:bg-secondary data-[state=on]:text-foreground"
      >
        <option.icon class="size-4" aria-hidden="true" />
      </ToggleGroupItem>
    {/each}
  </ToggleGroup>
  <PhotoGrid images={photos.map((photo: Photo) => photo.url)} {layout} />
</div>
