<script lang="ts">
import type { HeadingNodeTocProps } from "@/types";
import TOCHeading from "./TOCHeading.svelte";

const { heading }: { heading: HeadingNodeTocProps } = $props();
</script>

<li class="list-none!">
  <a
    href={`#${heading.slug}`}
    class="block truncate rounded-md px-2 py-1 text-sm leading-6 font-medium text-neutral-200 no-underline! transition-colors duration-150 hover:bg-neutral-800/70 hover:text-white"
  >
    {heading.text}
  </a>
  {#if heading.subheadings && heading.subheadings.length > 0}
    <ul class="mt-1 ml-2 space-y-1 border-l border-neutral-700/80 pl-2 list-none!">
      {#each heading.subheadings as sub}
        <TOCHeading heading={sub} />
      {/each}
    </ul>
  {/if}
</li>
