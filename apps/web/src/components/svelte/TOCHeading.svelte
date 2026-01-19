<script lang="ts">
  import TOCHeading from "./TOCHeading.svelte";

  const { heading } = $props();
</script>

<li class="list-none!">
  <a
    href={`#${heading.slug}`}
    class="no-underline! hover:underline! hover:text-neutral-400! text-base font-medium! line-clamp-1!"
  >
    {heading.text}
  </a>
  {#if heading.subheadings && heading.subheadings.length > 0}
    <ul class="list-none!">
      {#each heading.subheadings as sub}
        <TOCHeading heading={sub} />
      {/each}
    </ul>
  {/if}
</li>
