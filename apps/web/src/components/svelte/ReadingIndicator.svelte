<script lang="ts">
import { Progress } from "@ikuyo/ui";
import { onMount } from "svelte";

let width = $state(0);
let mounted = $state(false);

onMount(() => {
  mounted = true;

  if (typeof window === "undefined") return;

  function calculateScrollProgress() {
    const el = document.documentElement;
    const scrollTop = el.scrollTop || document.body.scrollTop;
    const scrollHeight = el.scrollHeight || document.body.scrollHeight;
    const percent = (scrollTop / (scrollHeight - el.clientHeight)) * 100;
    width = Number.isFinite(percent) ? percent : 0;
  }

  window.addEventListener("scroll", calculateScrollProgress);
  calculateScrollProgress();

  return () => {
    window.removeEventListener("scroll", calculateScrollProgress);
  };
});
</script>

{#if mounted}
  <Progress value={width} max={100} class="fixed top-0 left-0 z-50 h-1 w-full rounded-none bg-transparent" />
{/if}
