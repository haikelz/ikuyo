<script lang="ts">
  import type { HeadingNodeTocProps } from "@/types";
  import TOCHeading from "./TOCHeading.svelte";

  const {
    heading,
    nested = false,
    onNavigate,
    activeSlug,
  }: {
    heading: HeadingNodeTocProps;
    nested?: boolean;
    onNavigate?: () => void;
    activeSlug: string;
  } = $props();
</script>

<li class="list-none!">
  <a
    href={`#${heading.slug}`}
    data-scrollspy-anchor={heading.slug}
    data-active={activeSlug === heading.slug}
    aria-current={activeSlug === heading.slug ? "location" : undefined}
    onclick={onNavigate}
    class="block rounded-md py-1.5 text-pretty no-underline! transition-colors duration-150 hover:text-foreground data-[active=true]:text-primary data-[active=true]:font-semibold focus-visible:outline-2 focus-visible:outline-ring {nested
      ? 'text-xs leading-5 text-muted-foreground'
      : 'text-sm leading-5 font-medium text-foreground/80'}"
  >
    {heading.text}
  </a>
  {#if heading.subheadings && heading.subheadings.length > 0}
    <ul
      class="mb-1 ms-0 mt-0 space-y-0 border-s border-dashed border-border/70 ps-3 list-none!"
      role="list"
    >
      {#each heading.subheadings as sub}
        <TOCHeading heading={sub} nested={true} {onNavigate} {activeSlug} />
      {/each}
    </ul>
  {/if}
</li>
