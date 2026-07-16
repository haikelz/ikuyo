<script lang="ts">
  import type { WakatimeStatsProps } from "@/types";
  import { Card, CardContent, CardHeader } from "@ikuyo/ui";
  import { Clock, Zap } from "lucide-svelte";

  let { data }: { data: WakatimeStatsProps } = $props();

  const colors = [
    "#3b82f6",
    "#ef4444",
    "#10b981",
    "#f59e0b",
    "#8b5cf6",
    "#ec4899",
    "#14b8a6",
    "#f97316",
    "#84cc16",
    "#6366f1",
  ];

  function formatDuration(seconds: number) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  }

  const todayStats = $derived.by(() => {
    const preferred = data.languages.filter(
      (stat) =>
        stat.name === "TypeScript" ||
        stat.name === "JavaScript" ||
        stat.name === "Go" ||
        stat.name === "Svelte" ||
        stat.name === "Astro" ||
        stat.name === "Docker",
    );

    return preferred.length > 0 ? preferred : data.languages.slice(0, 6);
  });
</script>

<div class="mb-8">
  <h2
    class="mb-4 mt-0 text-xl sm:text-2xl font-bold tracking-tighter text-foreground"
  >
    Today
  </h2>
  <p class="mb-4 text-sm text-muted-foreground">
    Coding activity for today.
  </p>

  <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
    <Card
      class="border border-border/70 rounded-none bg-transparent ring-0 gap-0 py-0"
    >
      <CardHeader class="p-4">
        <div class="flex items-center">
          <Zap class="w-8 h-8 mr-3 text-muted-foreground" />
          <div>
            <p class="text-muted-foreground">Today's Coding Time</p>
            <p class="text-2xl font-medium text-foreground">
              {data.human_readable_total}
            </p>
          </div>
        </div>
      </CardHeader>
    </Card>

    <Card
      class="border border-border/70 bg-transparent rounded-none ring-0 gap-0 py-0"
    >
      <CardHeader class="p-4">
        <div class="flex items-center">
          <Clock class="w-8 h-8 mr-3 text-muted-foreground" />
          <div>
            <p class="text-muted-foreground">Languages Used</p>
            <p class="text-2xl font-medium text-foreground">
              {todayStats.length}
            </p>
          </div>
        </div>
      </CardHeader>
    </Card>
  </div>

  <Card
    class="border border-border/70 bg-transparent rounded-none ring-0 gap-0 py-0"
  >
    <CardContent class="p-4">
      <div class="w-full">
        <div class="space-y-5">
          {#each todayStats as lang, index}
            <div class="flex items-start justify flex-col w-full">
              <div class="flex items-center justify-between w-full">
                <div class="flex items-center">
                  <div
                    class="w-4 h-4 rounded-none mr-2"
                    style="background-color: {colors[index % colors.length]}"
                  ></div>
                  <span class="text-foreground">{lang.name}</span>
                </div>
                <div class="text-right">
                  <div class="text-base font-medium text-foreground">
                    {formatDuration(lang.total_seconds)} ({lang.percent ?? 0}%)
                  </div>
                </div>
              </div>
              <div class="relative w-full mt-2">
                <div class="relative w-full bg-muted rounded-none h-2"></div>

                <div
                  style="width: {lang.percent ?? 0}%; background-color: {colors[
                    index % colors.length
                  ]}"
                  class="h-2 rounded-none absolute inset-0"
                ></div>
              </div>
            </div>
          {/each}
        </div>
      </div>
    </CardContent>
  </Card>
</div>
