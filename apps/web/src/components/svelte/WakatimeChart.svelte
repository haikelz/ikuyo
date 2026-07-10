<script lang="ts">
  import type { WakatimeStatsProps } from "@/types";    
  import { Card, CardContent, CardHeader } from "@ikuyo/ui";
  import { Calendar, Clock } from "lucide-svelte";

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

  const wakatimeStats = $derived.by(() => {
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

  const chartData = $derived(
    wakatimeStats.map((lang) => ({
      name: lang.name,
      percent: Number(lang.percent ?? 0),
    })),
  );

  const chartBars = $derived.by(() => {
    const width = 1000;
    const height = 260;
    const maxY = 100;
    const left = 48;
    const right = 16;
    const bottom = 38;
    const top = 12;
    const innerWidth = width - left - right;
    const innerHeight = height - top - bottom;
    const count = Math.max(chartData.length, 1);
    const slotWidth = innerWidth / count;
    const barWidth = Math.max(14, Math.min(64, slotWidth * 0.64));

    const bars = chartData.map((item, index) => {
      const x = left + index * slotWidth + (slotWidth - barWidth) / 2;
      const clamped = Math.max(0, Math.min(maxY, item.percent));
      const h = (clamped / maxY) * innerHeight;
      const y = top + innerHeight - h;
      return {
        x,
        y,
        h,
        w: barWidth,
        labelX: left + index * slotWidth + slotWidth / 2,
        color: colors[index % colors.length],
        label: item.name,
        value: clamped,
      };
    });

    const yTicks = [0, 20, 40, 60, 80, 100].map((value) => ({
      value,
      y: top + innerHeight - (value / maxY) * innerHeight,
    }));

    return {
      width,
      height,
      left,
      right,
      top,
      bottom,
      innerWidth,
      innerHeight,
      bars,
      yTicks,
    };
  });
</script>

<div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
  <Card class="border border-border/70 rounded-none bg-transparent ring-0 gap-0 py-0">
    <CardHeader class="p-4">
      <div class="flex items-center">
        <Clock class="w-8 h-8 mr-3 text-muted-foreground" />
        <div>
          <p class="text-muted-foreground">Total Coding Time</p>
          <p class="text-2xl font-medium text-foreground">
            {data.human_readable_total}
          </p>
        </div>
      </div>
    </CardHeader>
  </Card>

  <Card class="border border-border/70 bg-transparent rounded-none ring-0 gap-0 py-0">
    <CardHeader class="p-4">
      <div class="flex items-center">
        <Calendar class="w-8 h-8 mr-3 text-muted-foreground" />
        <div>
          <p class="text-muted-foreground">Daily Average</p>
          <p class="text-2xl font-medium text-foreground">
            {formatDuration(data.daily_average)}
          </p>
        </div>
      </div>
    </CardHeader>
  </Card>
</div>

<Card class="border border-border/70 bg-transparent rounded-none ring-0 gap-0 py-0">
  <CardContent class="p-4">
    <div class="w-full">
      <div class="h-56">
        <svg
          viewBox={`0 0 ${chartBars.width} ${chartBars.height}`}
          preserveAspectRatio="none"
          class="h-full w-full text-muted-foreground"
        >
          {#each chartBars.yTicks as tick}
            <line
              x1={chartBars.left}
              y1={tick.y}
              x2={chartBars.width - chartBars.right}
              y2={tick.y}
              stroke="currentColor"
              stroke-opacity="0.08"
              stroke-width="1"
            />
            <text
              x={chartBars.left - 8}
              y={tick.y + 4}
              text-anchor="end"
              fill="currentColor"
              opacity="0.4"
              font-size="11"
            >
              {tick.value}%
            </text>
          {/each}

          <line
            x1={chartBars.left}
            y1={chartBars.top}
            x2={chartBars.left}
            y2={chartBars.height - chartBars.bottom}
            stroke="currentColor"
            stroke-opacity="0.14"
            stroke-width="1"
          />
          <line
            x1={chartBars.left}
            y1={chartBars.height - chartBars.bottom}
            x2={chartBars.width - chartBars.right}
            y2={chartBars.height - chartBars.bottom}
            stroke="currentColor"
            stroke-opacity="0.14"
            stroke-width="1"
          />

          {#each chartBars.bars as bar}
            <rect
              x={bar.x}
              y={bar.y}
              width={bar.w}
              height={bar.h}
              rx="0"
              fill={bar.color}
            />
            <text
              x={bar.labelX}
              y={chartBars.height - 16}
              text-anchor="middle"
              fill="currentColor"
              opacity="0.6"
              font-size="11"
            >
              {bar.label}
            </text>
          {/each}
        </svg>
      </div>
      <div class="space-y-5 mb-4">
        {#each wakatimeStats as lang, index}
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
