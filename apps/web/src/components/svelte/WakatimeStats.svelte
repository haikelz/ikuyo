<script lang="ts">
  import type { WakatimeStatsProps } from "@/types";
  import { Card, CardContent, CardHeader } from "@ikuyo/ui";
  import { BarChart4, Clock, Timer, Zap } from "lucide-svelte";

  let { allTime, weekly }: { allTime: WakatimeStatsProps; weekly: WakatimeStatsProps } = $props();

  const colors = ["#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899", "#14b8a6", "#f97316"];
  const allLanguages = $derived(allTime.languages.slice(0, 8));
  const todayDisplay = $derived(allTime.human_readable_daily_average || allTime.daily_average?.toString() || "0");
</script>

<div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
  <Card class="border border-border/70 bg-transparent rounded-none">
    <CardHeader class="p-4">
      <div class="flex items-center">
        <Clock class="w-8 h-8 mr-3 text-muted-foreground" />
        <div>
          <p class="text-muted-foreground text-sm">All Time</p>
          <p class="text-2xl font-medium text-foreground">{allTime.human_readable_total}</p>
        </div>
      </div>
    </CardHeader>
  </Card>

  <Card class="border border-border/70 bg-transparent rounded-none">
    <CardHeader class="p-4">
      <div class="flex items-center">
        <Zap class="w-8 h-8 mr-3 text-muted-foreground" />
        <div>
          <p class="text-muted-foreground text-sm">This Week</p>
          <p class="text-2xl font-medium text-foreground">{weekly.human_readable_total}</p>
        </div>
      </div>
    </CardHeader>
  </Card>

  <Card class="border border-border/70 bg-transparent rounded-none">
    <CardHeader class="p-4">
      <div class="flex items-center">
        <Timer class="w-8 h-8 mr-3 text-muted-foreground" />
        <div>
          <p class="text-muted-foreground text-sm">Daily Average</p>
          <p class="text-2xl font-medium text-foreground">{todayDisplay}</p>
        </div>
      </div>
    </CardHeader>
  </Card>
</div>

<Card class="border border-border/70 bg-transparent rounded-none">
  <CardHeader class="p-4 pb-2">
    <div class="flex items-center">
      <BarChart4 class="w-5 h-5 mr-2 text-muted-foreground" />
      <p class="font-medium text-foreground">All-Time Language Usage</p>
    </div>
  </CardHeader>
  <CardContent class="p-4 pt-0">
    <div class="space-y-4">
      {#each allLanguages as lang, i}
        <div>
          <div class="flex items-center justify-between mb-1">
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 rounded-none" style="background-color: {colors[i % colors.length]}"></div>
              <span class="text-sm text-foreground">{lang.name}</span>
            </div>
            <span class="text-sm tabular-nums text-muted-foreground">{lang.text}</span>
          </div>
          <div class="w-full bg-muted h-2.5 rounded-none">
            <div class="h-2.5 rounded-none" style="width: {lang.percent}%; background-color: {colors[i % colors.length]}"></div>
          </div>
        </div>
      {/each}
    </div>
  </CardContent>
</Card>
