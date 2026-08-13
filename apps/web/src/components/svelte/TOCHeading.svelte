<script lang="ts">
import type { HeadingNodeTocProps } from "@/types";
import TOCHeading from "./TOCHeading.svelte";

const {
  heading,
  nested = false,
  onNavigate,
}: {
  heading: HeadingNodeTocProps;
  nested?: boolean;
  onNavigate?: () => void;
} = $props();
</script>

<li class="list-none!">
  <a
    href={`#${heading.slug}`}
    onclick={onNavigate}
    class="block py-1.5 text-pretty no-underline! transition-colors duration-150 hover:text-foreground {nested
      ? 'text-xs leading-5 text-muted-foreground'
      : 'text-sm leading-5 font-medium text-foreground/80'}"
  >
    {heading.text}
  </a>
  {#if heading.subheadings && heading.subheadings.length > 0}
    <ul class="mb-1 ms-0 mt-0 space-y-0 border-s border-border/70 ps-3 list-none!" role="list">
      {#each heading.subheadings as sub}
        <TOCHeading heading={sub} nested={true} {onNavigate} />
      {/each}
    </ul>
  {/if}
</li>
