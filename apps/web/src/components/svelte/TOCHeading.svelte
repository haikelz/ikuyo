<script lang="ts">
  import type { HeadingNodeTocProps } from "@/types";
  import TOCHeading from "./TOCHeading.svelte";

  const { heading }: { heading: HeadingNodeTocProps } = $props();
</script>

<li class="list-none!">
  <a
    href={`#${heading.slug}`}
    class="block truncate rounded-md px-2 py-1 text-sm leading-6 font-medium text-muted-foreground no-underline! transition-colors duration-150 hover:bg-muted hover:text-foreground"
  >
    {heading.text}
  </a>
  {#if heading.subheadings && heading.subheadings.length > 0}
    <ul
      class="mt-1 ml-2 space-y-1 border-l border-border/70 pl-2 list-none!"
      role="list"
    >
      {#each heading.subheadings as sub}
        <TOCHeading heading={sub} />
      {/each}
    </ul>
  {/if}
</li>
