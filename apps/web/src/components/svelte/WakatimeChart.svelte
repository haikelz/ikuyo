<script>
  import { Chart, registerables } from "chart.js";
  import { Calendar, Clock } from "lucide-svelte";
  import { onMount } from "svelte";

  let { data } = $props();

  Chart.register(...registerables);

  let languageChartCanvas;
  let languageChart;

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

  function formatDuration(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  }

  const wakatimeStats = data.languages.filter(
    (stat) =>
      stat.name === "TypeScript" ||
      stat.name === "JavaScript" ||
      stat.name === "Go" ||
      stat.name === "Svelte" ||
      stat.name === "Astro" ||
      stat.name === "Docker"
  );

  function createCharts() {
    if (!data) return;

    if (languageChartCanvas) {
      languageChart = new Chart(languageChartCanvas, {
        type: "bar",
        data: {
          labels: wakatimeStats.map((lang) => lang.name),
          datasets: [
            {
              data: wakatimeStats.map((lang) => lang.percent),
              backgroundColor: colors.slice(0, wakatimeStats.length),
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false,
            },
          },
        },
      });
    }
  }

  onMount(() => {
    createCharts();
  });
</script>

<div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
  <div
    class="w-full max-w-full bg-neutral-50/70 dark:bg-neutral-900/70 p-4 flex-wrap border-[0.5px] rounded-md overflow-hidden border-monochrome-3 border-dashed dark:border-neutral-800"
  >
    <div class="flex items-center">
      <Clock class="w-8 h-8 mr-3" />
      <div>
        <p>Total Coding Time</p>
        <p class="text-2xl font-bold">
          {data.human_readable_total}
        </p>
      </div>
    </div>
  </div>

  <div
    class="w-full max-w-full bg-neutral-50/70 dark:bg-neutral-900/70 p-4 flex-wrap border-[0.5px] rounded-md overflow-hidden border-monochrome-3 border-dashed dark:border-neutral-800"
  >
    <div class="flex items-center">
      <Calendar class="w-8 h-8  mr-3" />
      <div>
        <p>Daily Average</p>
        <p class="text-2xl font-bold">
          {formatDuration(data.daily_average)}
        </p>
      </div>
    </div>
  </div>
</div>
<div
  class="w-full max-w-full bg-neutral-50/70 dark:bg-neutral-900/70 p-4 flex-wrap border-[0.5px] rounded-md overflow-hidden border-monochrome-3 border-dashed dark:border-neutral-800 card"
>
  <div class="w-full">
    <div class="h-48 flex justify-center">
      <canvas bind:this={languageChartCanvas} class="max-h-full"></canvas>
    </div>
    <div class="space-y-5 mb-4">
      {#each wakatimeStats as lang, index}
        <div class="flex items-start justify flex-col w-full">
          <div class="flex items-center justify-between w-full">
            <div class="flex items-center">
              <div
                class="w-4 h-4 rounded-sm mr-2"
                style="background-color: {colors[index % colors.length]}"
              ></div>
              <span>{lang.name}</span>
            </div>
            <div class="text-right">
              <div class="text-base font-semibold">
                {formatDuration(lang.total_seconds)} ({lang.percent ?? 0}%)
              </div>
            </div>
          </div>
          <div class="relative w-full mt-2">
            <div
              class="relative w-full bg-neutral-100 dark:bg-neutral-800 rounded-full h-2"
            ></div>

            <div
              style="width: {lang.percent ?? 0}%; background-color: {colors[
                index % colors.length
              ]}"
              class="h-2 rounded-full absolute inset-0"
            ></div>
          </div>
        </div>
      {/each}
    </div>
  </div>
</div>
