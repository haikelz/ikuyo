<script lang="ts">
import { type PronouncedTitle, pronunciations } from "@/utils/pronunciation";

let { title } = $props<{ title: PronouncedTitle }>();
</script>

<!-- Screen readers, search, and in-page find get the word; the eye gets the respelling, and
     hovering it shows the word. -->
<span class="sr-only">{title}</span><span aria-hidden="true" title={title}>{pronunciations[title]}</span>
