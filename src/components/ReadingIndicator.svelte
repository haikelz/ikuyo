<script lang="ts">
  import { onMount } from "svelte";

  let width = 0;

  onMount(() => {
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

<div
  style="width: {width}%"
  class="fixed h-1 bg-base-5 z-50 reading-progress"
></div>
