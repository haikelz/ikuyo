<script lang="ts">
import type { WakatimeStatsProps } from "@/types";

let { allTime, weekly }: { allTime: WakatimeStatsProps; weekly: WakatimeStatsProps } = $props();

const allLanguages = $derived(allTime.languages.slice(0, 8));
const todayDisplay = $derived(
  allTime.human_readable_daily_average || allTime.daily_average?.toString() || "0",
);
</script>

<div class="mb-8 grid grid-cols-1 border-y border-border md:grid-cols-3">
  <div class="border-b border-border py-5 md:border-r md:border-b-0 md:px-5 md:first:pl-0">
    <p class="font-mono text-xs uppercase tracking-widest text-muted-foreground">All time</p>
    <p class="mt-2 text-2xl font-medium tracking-tight text-foreground">{allTime.human_readable_total}</p>
  </div>
  <div class="border-b border-border py-5 md:border-r md:border-b-0 md:px-5">
    <p class="font-mono text-xs uppercase tracking-widest text-muted-foreground">This week</p>
    <p class="mt-2 text-2xl font-medium tracking-tight text-foreground">{weekly.human_readable_total}</p>
  </div>
  <div class="py-5 md:pl-5">
    <p class="font-mono text-xs uppercase tracking-widest text-muted-foreground">Daily average</p>
    <p class="mt-2 text-2xl font-medium tracking-tight text-foreground">{todayDisplay}</p>
  </div>
</div>

<section class="border-y border-border">
  <header class="border-b border-border py-4">
    <p class="font-mono text-xs uppercase tracking-widest text-muted-foreground">Language usage</p>
    <h2 class="mt-1 text-lg font-medium tracking-tight text-foreground">All-time activity</h2>
  </header>
  <div>
    {#each allLanguages as lang}
      <div class="grid grid-cols-[minmax(7rem,1fr)_2fr_auto] items-center gap-4 border-b border-border py-3 last:border-b-0">
        <span class="text-sm text-foreground">{lang.name}</span>
        <div class="h-1.5 w-full bg-muted" aria-hidden="true">
          <div class="h-full bg-foreground/75" style={`width: ${lang.percent}%`}></div>
        </div>
        <span class="font-mono text-xs tabular-nums text-muted-foreground">{lang.text}</span>
      </div>
    {/each}
  </div>
</section>
