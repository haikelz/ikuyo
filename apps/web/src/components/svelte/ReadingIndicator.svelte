<script lang="ts">
  import { onMount } from "svelte";

  let width = 0;
  let mounted = false;

  onMount(() => {
    mounted = true;

    if (typeof window === "undefined") return;

    function calculateScrollProgress() {
      const el = document.documentElement;
      const scrollTop = el.scrollTop || document.body.scrollTop;
      const scrollHeight = el.scrollHeight || document.body.scrollHeight;
      const percent = (scrollTop / (scrollHeight - el.clientHeight)) * 100;
      width = percent;
    }

    window.addEventListener("scroll", calculateScrollProgress);
    calculateScrollProgress();

    return () => {
      window.removeEventListener("scroll", calculateScrollProgress);
    };
  });
</script>

{#if mounted}
  <div
    style="width: {width}%"
    class="fixed h-1 top-0 bg-monochrome-4 dark:bg-neutral-50 z-10 reading-progress"
  ></div>
{/if}
