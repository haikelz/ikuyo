<script lang="ts">
import { Select, SelectContent, SelectItem, SelectTrigger } from "@ikuyo/ui";
import { onMount } from "svelte";

type ContributionDay = {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
};

type ContributionData = {
  totals: Record<string, number>;
  contributions: ContributionDay[];
};

let { username }: { username: string } = $props();

let data = $state<ContributionData | null>(null);
let isLoading = $state(true);
let errorMessage = $state<string | null>(null);
let selectedYear = $state(String(new Date().getUTCFullYear()));
let hoveredDay = $state<ContributionDay | null>(null);
let tooltipX = $state(0);
let tooltipY = $state(0);
let tooltipBelow = $state(false);

const monthFormatter = new Intl.DateTimeFormat("en", {
  month: "short",
  timeZone: "UTC",
});
const dateFormatter = new Intl.DateTimeFormat("en", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

const levelClasses = [
  "border-border/70 bg-muted",
  "border-foreground/10 bg-foreground/20",
  "border-foreground/15 bg-foreground/40",
  "border-foreground/20 bg-foreground/65",
  "border-foreground bg-foreground",
] as const;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function parseContributionData(value: unknown): ContributionData {
  if (!isRecord(value) || !isRecord(value.total) || !Array.isArray(value.contributions)) {
    throw new Error("Invalid contribution response");
  }

  const totals = Object.fromEntries(
    Object.entries(value.total).filter(
      ([year, total]) =>
        /^\d{4}$/.test(year) && typeof total === "number" && Number.isInteger(total) && total >= 0,
    ),
  ) as Record<string, number>;
  if (Object.keys(totals).length === 0) {
    throw new Error("Invalid contribution total");
  }

  const contributions = value.contributions.map((entry) => {
    if (!isRecord(entry)) {
      throw new Error("Invalid contribution day");
    }

    const { date, count, level } = entry;
    if (
      typeof date !== "string" ||
      !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
      Number.isNaN(Date.parse(`${date}T00:00:00Z`)) ||
      typeof count !== "number" ||
      !Number.isInteger(count) ||
      count < 0 ||
      typeof level !== "number" ||
      !Number.isInteger(level) ||
      level < 0 ||
      level > 4
    ) {
      throw new Error("Invalid contribution day");
    }

    return { date, count, level: level as ContributionDay["level"] };
  });

  if (contributions.length === 0) {
    throw new Error("Empty contribution response");
  }

  const usableTotals = Object.fromEntries(
    Object.entries(totals).filter(([year]) =>
      contributions.some((day) => day.date.startsWith(`${year}-`)),
    ),
  );
  if (Object.keys(usableTotals).length === 0) {
    throw new Error("Contribution years have no matching days");
  }

  return { totals: usableTotals, contributions };
}

function formatContributionLabel(day: ContributionDay) {
  const contributionLabel = day.count === 1 ? "contribution" : "contributions";
  return `${day.count} ${contributionLabel} on ${dateFormatter.format(
    new Date(`${day.date}T00:00:00Z`),
  )}`;
}

function showDayTooltip(event: MouseEvent, day: ContributionDay) {
  const cell = event.currentTarget as HTMLElement;
  const graph = cell.closest<HTMLElement>('[data-cy="contribution-graph"]');
  if (!graph) return;

  const cellRect = cell.getBoundingClientRect();
  const graphRect = graph.getBoundingClientRect();
  tooltipBelow = new Date(`${day.date}T00:00:00Z`).getUTCDay() <= 2;
  tooltipX = Math.max(
    88,
    Math.min(cellRect.left - graphRect.left + cellRect.width / 2, graphRect.width - 88),
  );
  tooltipY = cellRect.top - graphRect.top + (tooltipBelow ? cellRect.height + 8 : -8);
  hoveredDay = day;
}

function hideDayTooltip() {
  hoveredDay = null;
}

const availableYears = $derived(
  data ? Object.keys(data.totals).sort((a, b) => Number(b) - Number(a)) : [],
);
const visibleContributions = $derived(
  data ? data.contributions.filter((day) => day.date.startsWith(`${selectedYear}-`)) : [],
);

const weeks = $derived.by(() => {
  if (!data) return [] as Array<Array<ContributionDay | null>>;

  const firstDay = new Date(`${visibleContributions[0].date}T00:00:00Z`).getUTCDay();
  const padded: Array<ContributionDay | null> = [
    ...Array.from({ length: firstDay }, () => null),
    ...visibleContributions,
  ];

  const result: Array<Array<ContributionDay | null>> = [];
  for (let index = 0; index < padded.length; index += 7) {
    result.push(padded.slice(index, index + 7));
  }
  return result;
});

const monthLabels = $derived.by(() => {
  let previousMonth = -1;

  return weeks.map((week, index) => {
    const firstRealDay = week.find((day) => day !== null);
    const firstWeekOfMonth = week.find(
      (day) => day !== null && new Date(`${day.date}T00:00:00Z`).getUTCDate() <= 7,
    );
    const labelDay = index === 0 ? firstRealDay : firstWeekOfMonth;
    if (!labelDay) return "";

    const date = new Date(`${labelDay.date}T00:00:00Z`);
    const month = date.getUTCMonth();
    if (month === previousMonth) return "";

    previousMonth = month;
    return monthFormatter.format(date);
  });
});

const graphLabel = $derived.by(() => {
  if (!data) return "Activity calendar";
  const first = visibleContributions[0];
  const last = visibleContributions[visibleContributions.length - 1];
  return `${data.totals[selectedYear].toLocaleString("en-US")} public activities from ${dateFormatter.format(
    new Date(`${first.date}T00:00:00Z`),
  )} to ${dateFormatter.format(new Date(`${last.date}T00:00:00Z`))}`;
});

onMount(() => {
  const controller = new AbortController();

  async function fetchContributions() {
    try {
      const response = await fetch(
        `https://github-contributions-api.jogruber.de/v4/${encodeURIComponent(username)}?y=all`,
        {
          credentials: "omit",
          signal: controller.signal,
        },
      );
      if (!response.ok) {
        throw new Error("Contribution request failed");
      }

      const parsedData = parseContributionData(await response.json());
      if (!(selectedYear in parsedData.totals)) {
        selectedYear = Object.keys(parsedData.totals).sort((a, b) => Number(b) - Number(a))[0];
      }
      data = parsedData;
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      errorMessage = "Activity is temporarily unavailable.";
    } finally {
      if (!controller.signal.aborted) {
        isLoading = false;
      }
    }
  }

  void fetchContributions();
  return () => controller.abort();
});
</script>

<div data-cy="github-contributions" class="w-full">
  <div class="mb-4 flex min-h-10 items-center justify-between gap-4">
    <p
      class="m-0 font-mono text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground"
    >
      Haikel Ilham Hakim
    </p>
    {#if data}
      <Select type="single" bind:value={selectedYear}>
        <SelectTrigger
          data-cy="activity-year-select"
          class="h-9 w-24 rounded-none border-border bg-transparent font-mono text-xs text-foreground"
          aria-label="Select activity year"
        >
          {selectedYear}
        </SelectTrigger>
        <SelectContent class="rounded-none border-border bg-background text-foreground">
          {#each availableYears as year}
            <SelectItem
              value={year}
              label={year}
              class="font-mono focus:bg-muted/50 data-[highlighted]:bg-muted/50"
            >
              {year}
            </SelectItem>
          {/each}
        </SelectContent>
      </Select>
    {/if}
  </div>

  <div class="border-y border-border/70 py-6 sm:py-7">
  {#if isLoading}
    <div
      role="status"
      class="flex min-h-32 items-center border border-border/70 px-4 py-6 font-mono text-xs text-muted-foreground"
    >
      Loading activity…
    </div>
  {:else if errorMessage || !data}
    <div
      role="status"
      class="flex min-h-32 items-center border border-border/70 px-4 py-6 text-sm text-muted-foreground"
    >
      {errorMessage ?? "Activity is temporarily unavailable."}
    </div>
  {:else}
    <div
      data-cy="contribution-scroll"
      class="min-w-0 w-full overflow-x-auto overscroll-x-contain border border-border/70 p-4 focus-visible:outline-2"
      tabindex="0"
      aria-label="Activity calendar. Scroll horizontally to see the complete graph."
    >
      <div
        data-cy="contribution-graph"
        class="relative min-w-[45rem]"
        role="img"
        aria-label={graphLabel}
      >
          <div class="grid grid-cols-[1.75rem_1fr] gap-x-2">
            <div aria-hidden="true"></div>
            <div
              class="month-grid mb-2 grid h-4 gap-x-[3px] font-mono text-[10px] leading-none text-muted-foreground"
              style={`--week-count: ${weeks.length};`}
              aria-hidden="true"
            >
              {#each monthLabels as label}
                <span class="whitespace-nowrap">{label}</span>
              {/each}
            </div>

            <div
              class="grid grid-rows-7 gap-y-[3px] font-mono text-[9px] leading-[10px] text-muted-foreground"
              aria-hidden="true"
            >
              <span></span>
              <span>Mon</span>
              <span></span>
              <span>Wed</span>
              <span></span>
              <span>Fri</span>
              <span></span>
            </div>
            <div class="flex gap-[3px]" aria-hidden="true">
              {#each weeks as week}
                <div class="grid w-2.5 shrink-0 grid-rows-7 gap-[3px] lg:min-w-0 lg:flex-1">
                  {#each Array.from({ length: 7 }) as _, dayIndex}
                    {@const day = week[dayIndex]}
                    {#if day}
                      <span
                        data-cy="contribution-day"
                        class={`aspect-square w-full border ${levelClasses[day.level]}`}
                        onmouseenter={(event) => showDayTooltip(event, day)}
                        onmouseleave={hideDayTooltip}
                      ></span>
                    {:else}
                      <span class="aspect-square w-full" aria-hidden="true"></span>
                    {/if}
                  {/each}
                </div>
              {/each}
            </div>
          </div>

          {#if hoveredDay}
            <div
              data-cy="contribution-tooltip"
              class={`pointer-events-none absolute z-20 min-w-44 -translate-x-1/2 border border-foreground bg-foreground px-2.5 py-2 text-center font-mono text-[10px] leading-4 text-background ${
                tooltipBelow ? "" : "-translate-y-full"
              }`}
              style={`left: ${tooltipX}px; top: ${tooltipY}px;`}
              role="tooltip"
            >
              {formatContributionLabel(hoveredDay)}
            </div>
          {/if}
      </div>
    </div>

    <div class="mt-3 flex items-center justify-end gap-4">
      <div class="flex items-center gap-1.5 font-mono text-[10px] text-muted-foreground" aria-label="Activity intensity from less to more">
        <span>Less</span>
        {#each levelClasses as levelClass}
          <span class={`size-2.5 border ${levelClass}`} aria-hidden="true"></span>
        {/each}
        <span>More</span>
      </div>
    </div>
  {/if}
  </div>
</div>

<style>
  .month-grid {
    grid-template-columns: repeat(var(--week-count), 0.625rem);
  }

  @media (min-width: 64rem) {
    .month-grid {
      grid-template-columns: repeat(var(--week-count), minmax(0, 1fr));
    }
  }
</style>
