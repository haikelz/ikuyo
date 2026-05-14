<script lang="ts">
  import { fade } from "svelte/transition";
  import PhotoGrid from "./PhotoGrid.svelte";

  type Photo = {
    url: string;
    thumbnail: string;
  };

  let { photos = [] } = $props<{ photos: Photo[] }>();
</script>

<div transition:fade={{ duration: 300 }}>
  <PhotoGrid images={photos.map((photo: Photo) => photo.url)} masonry={true} />
</div>
