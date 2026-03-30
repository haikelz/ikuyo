<script lang="ts">
  import type { MarketCode, MarketDataset } from "@/types";
  import {
    Alert,
    AlertDescription,
    AlertTitle,
    Badge,
    Button,
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    Separator,
    ToggleGroup,
    ToggleGroupItem,
  } from "@ikuyo/ui";
  import { AreaChart, LineChart } from "layerchart";
  import {
    Activity,
    AlertTriangle,
    ChevronLeft,
    ChevronRight,
    TrendingDown,
    TrendingUp,
  } from "lucide-svelte";
  import { onMount } from "svelte";

  type IntervalKey = "1M" | "3M" | "6M" | "1Y" | "ALL";
  type ChartMode = "line" | "area" | "candles";

  let {
    markets,
    defaultMarketCode = "ID",
  }: {
    markets: MarketDataset[];
    defaultMarketCode?: MarketCode;
  } = $props();

  let interval = $state<IntervalKey>("6M");
let mode = $state<ChartMode>("line");
let panOffset = $state(0);
let showVolume = $state(true);
let showSma20 = $state(true);
let hoverIndex = $state<number | null>(null);
  let hoverX = $state(0);
  let hoverY = $state(0);
  let tooltipX = $state(0);
  let tooltipY = $state(0);
  let isDragging = $state(false);
  let dragStartX = $state(0);
  let dragStartPanOffset = $state(0);
  let selectedMarketCode = $state<MarketCode>(defaultMarketCode);
  let dragMoved = $state(false);
  let isChartDialogOpen = $state(false);

  const palette = {
    panel: "#131722",
    line: "#7aa2f7",
    area: "#334155",
    sma: "#f59e0b",
    positive: "#26a69a",
    negative: "#ef5350",
    volume: "#475569",
  };

  const numberFormatter = new Intl.NumberFormat("id-ID", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const compactFormatter = new Intl.NumberFormat("id-ID", {
    notation: "compact",
    maximumFractionDigits: 2,
  });
  const dateFormatter = new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  const axisShortDateFormatter = new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
  });
  const axisLongDateFormatter = new Intl.DateTimeFormat("id-ID", {
    month: "short",
    year: "2-digit",
  });

  function intervalToSize(value: IntervalKey, total: number) {
    if (value === "1M") return Math.min(total, 22);
    if (value === "3M") return Math.min(total, 66);
    if (value === "6M") return Math.min(total, 132);
    if (value === "1Y") return Math.min(total, 252);
    return total;
  }

  function clamp(n: number, min: number, max: number) {
    return Math.max(min, Math.min(n, max));
  }

  function formatSigned(value: number) {
    return `${value >= 0 ? "+" : ""}${numberFormatter.format(value)}`;
  }

  function formatAxisDate(value: Date) {
    return interval === "1M"
      ? axisShortDateFormatter.format(value)
      : axisLongDateFormatter.format(value);
  }

  function panLeft() {
    panOffset = clamp(
      panOffset + Math.max(1, Math.round(windowSize * 0.2)),
      0,
      maxPanOffset
    );
  }

  function panRight() {
    panOffset = clamp(
      panOffset - Math.max(1, Math.round(windowSize * 0.2)),
      0,
      maxPanOffset
    );
  }

function onChartMove(event: MouseEvent) {
  if (visibleData.length === 0) return;
  const target = event.currentTarget as HTMLDivElement | null;
  if (!target) return;

  const rect = target.getBoundingClientRect();
    const localX = clamp(event.clientX - rect.left, 0, rect.width);
    const localY = clamp(event.clientY - rect.top, 0, rect.height);
    const ratio = rect.width > 0 ? localX / rect.width : 0;
    const index = clamp(
      Math.round(ratio * Math.max(0, visibleData.length - 1)),
      0,
      visibleData.length - 1
    );
    const point = visibleData[index];
    const yRange = yDomain[1] - yDomain[0];

    hoverIndex = index;
    hoverX =
      visibleData.length > 1
        ? (index / (visibleData.length - 1)) * rect.width
        : rect.width / 2;
    hoverY =
      yRange > 0
        ? (1 - (point.close - yDomain[0]) / yRange) * rect.height
        : rect.height / 2;
    tooltipX = clamp(localX + 12, 8, rect.width - 184);
    tooltipY = clamp(localY + 12, 8, rect.height - 120);
  }

  function onChartLeave() {
    if (isDragging) return;
    hoverIndex = null;
  }

function onChartPointerDown(event: PointerEvent) {
  const target = event.currentTarget as HTMLDivElement | null;
  if (!target) return;
  isDragging = true;
  dragMoved = false;
  dragStartX = event.clientX;
  dragStartPanOffset = panOffset;
  target.setPointerCapture(event.pointerId);
}

function onChartPointerMove(event: PointerEvent) {
  if (isDragging) {
    const target = event.currentTarget as HTMLDivElement | null;
    if (!target || maxPanOffset <= 0) return;
    const rect = target.getBoundingClientRect();
    const dx = event.clientX - dragStartX;
      if (Math.abs(dx) > 4) {
        dragMoved = true;
      }
      const pointsPerPixel = maxPanOffset / Math.max(1, rect.width);
      const deltaPoints = Math.round(-dx * pointsPerPixel);
      panOffset = clamp(dragStartPanOffset + deltaPoints, 0, maxPanOffset);
    } else {
      onChartMove(event as unknown as MouseEvent);
    }
  }

function onChartPointerUp(event: PointerEvent) {
  const target = event.currentTarget as HTMLDivElement | null;
  if (!target) return;
  isDragging = false;
  target.releasePointerCapture(event.pointerId);
  if (!dragMoved) {
    isChartDialogOpen = true;
  }
}

  function onChartWheel(event: WheelEvent) {
    if (maxPanOffset <= 0) return;
    event.preventDefault();
    const delta =
      Math.abs(event.deltaX) > Math.abs(event.deltaY)
        ? event.deltaX
        : event.deltaY;
    const step = Math.max(1, Math.round(windowSize * 0.06));
    const direction = delta > 0 ? 1 : -1;
    panOffset = clamp(panOffset + direction * step, 0, maxPanOffset);
  }

  const currentMarket = $derived(
    markets.find((market) => market.code === selectedMarketCode) ?? markets[0]
  );

  function isMarketCode(value: string): value is MarketCode {
    return (
      value === "ID" ||
      value === "JP" ||
      value === "US" ||
      value === "CN" ||
      value === "SA"
    );
  }

  const normalized = $derived(
    currentMarket.data
      .map((item) => ({
        ...item,
        date: new Date(`${item.date}T00:00:00`),
      }))
      .sort((a, b) => a.date.getTime() - b.date.getTime())
  );

  const windowSize = $derived(intervalToSize(interval, normalized.length));
  const maxPanOffset = $derived(Math.max(0, normalized.length - windowSize));
  const startIndex = $derived(
    Math.max(0, normalized.length - windowSize - panOffset)
  );
  const visibleData = $derived(
    normalized.slice(startIndex, startIndex + windowSize)
  );

  $effect(() => {
    panOffset = clamp(panOffset, 0, maxPanOffset);
  });

$effect(() => {
  selectedMarketCode;
  panOffset = 0;
  hoverIndex = null;
});

$effect(() => {
  if (!isChartDialogOpen) {
    isDragging = false;
    dragMoved = false;
  }
});

  onMount(() => {
    const params = new URLSearchParams(window.location.search);
    const country = (params.get("country") ?? "").toUpperCase();
    if (isMarketCode(country)) {
      selectedMarketCode = country;
    }
  });

  $effect(() => {
    selectedMarketCode;
    if (typeof window === "undefined") return;
    const url = new URL(window.location.href);
    url.searchParams.set("country", selectedMarketCode);
    window.history.replaceState({}, "", url.toString());
  });

  const latest = $derived(visibleData[visibleData.length - 1] ?? null);
  const first = $derived(visibleData[0] ?? null);
  const previous = $derived(
    visibleData.length > 1 ? visibleData[visibleData.length - 2] : null
  );
  const dayChange = $derived(
    latest && previous ? Number((latest.close - previous.close).toFixed(2)) : 0
  );
  const dayChangePercent = $derived(
    latest && previous && previous.close > 0
      ? Number(
          (((latest.close - previous.close) / previous.close) * 100).toFixed(2)
        )
      : 0
  );
  const rangeChange = $derived(
    latest && first ? Number((latest.close - first.close).toFixed(2)) : 0
  );
  const rangeChangePercent = $derived(
    latest && first && first.close > 0
      ? Number((((latest.close - first.close) / first.close) * 100).toFixed(2))
      : 0
  );
  const minClose = $derived(
    visibleData.length
      ? Math.min(...visibleData.map((point) => point.close))
      : 0
  );
  const maxClose = $derived(
    visibleData.length
      ? Math.max(...visibleData.map((point) => point.close))
      : 0
  );
  const minPrice = $derived(
    visibleData.length ? Math.min(...visibleData.map((point) => point.low)) : 0
  );
  const maxPrice = $derived(
    visibleData.length ? Math.max(...visibleData.map((point) => point.high)) : 0
  );
  const yDomain = $derived.by(() => {
    if (!visibleData.length) return [0, 1] as [number, number];
    const spread = Math.max(maxPrice - minPrice, Math.max(maxPrice * 0.01, 1));
    return [
      Math.max(0, minPrice - spread * 0.08),
      maxPrice + spread * 0.08,
    ] as [number, number];
  });
  const avgVolume = $derived(
    visibleData.length
      ? visibleData.reduce((acc, point) => acc + point.volume, 0) /
          visibleData.length
      : 0
  );
  const hasVolumeData = $derived(visibleData.some((point) => point.volume > 0));
  const maxVolume = $derived(
    hasVolumeData ? Math.max(...visibleData.map((point) => point.volume), 1) : 0
  );

  const sma20Data = $derived.by(() => {
    const period = 20;
    const series: Array<{ date: Date; sma: number }> = [];

    for (let i = 0; i < visibleData.length; i += 1) {
      if (i < period - 1) continue;
      const chunk = visibleData.slice(i - period + 1, i + 1);
      const avg = chunk.reduce((acc, item) => acc + item.close, 0) / period;
      series.push({ date: visibleData[i].date, sma: Number(avg.toFixed(2)) });
    }

    return series;
  });

  const lineSeries = $derived.by(() => {
    const closeSeries = {
      key: "close",
      label: "Close",
      value: "close",
      color: palette.line,
    };

    if (!showSma20 || sma20Data.length === 0) {
      return [closeSeries];
    }

    return [
      closeSeries,
      {
        key: "sma20",
        label: "SMA20",
        data: sma20Data,
        value: "sma",
        color: palette.sma,
      },
    ];
  });

  const hoveredPoint = $derived(
    hoverIndex != null ? (visibleData[hoverIndex] ?? null) : null
  );
  const hoveredPrevious = $derived(
    hoverIndex != null && hoverIndex > 0
      ? (visibleData[hoverIndex - 1] ?? null)
      : null
  );
  const hoveredChange = $derived(
    hoveredPoint && hoveredPrevious
      ? Number((hoveredPoint.close - hoveredPrevious.close).toFixed(2))
      : 0
  );
  const hoveredChangePercent = $derived(
    hoveredPoint && hoveredPrevious && hoveredPrevious.close > 0
      ? Number(
          (
            ((hoveredPoint.close - hoveredPrevious.close) /
              hoveredPrevious.close) *
            100
          ).toFixed(2)
        )
      : 0
  );

  const candlePlot = $derived.by(() => {
    const width = 1000;
    const height = 304;
    const min = yDomain[0];
    const max = yDomain[1];
    const range = max - min || 1;
    const toY = (value: number) => height - ((value - min) / range) * height;
    const step =
      visibleData.length > 1 ? width / (visibleData.length - 1) : width;
    const bodyWidth = Math.max(2, Math.min(10, step * 0.55));

    const candles = visibleData.map((point, index) => {
      const x = visibleData.length > 1 ? index * step : width / 2;
      const openY = toY(point.open);
      const closeY = toY(point.close);
      const highY = toY(point.high);
      const lowY = toY(point.low);
      const isUp = point.close >= point.open;
      return {
        x,
        openY,
        closeY,
        highY,
        lowY,
        bodyY: Math.min(openY, closeY),
        bodyHeight: Math.max(1, Math.abs(closeY - openY)),
        isUp,
        date: point.date,
      };
    });

    const gridStep = Math.max(1, Math.floor(visibleData.length / 6));
    const verticalGridX = visibleData
      .map((_, index) => index)
      .filter((index) => index % gridStep === 0)
      .map((index) => (visibleData.length > 1 ? index * step : width / 2));

    const ticks = Array.from({ length: 5 }, (_, index) => {
      const ratio = index / 4;
      const value = min + (max - min) * ratio;
      return {
        value,
        y: height - ratio * height,
      };
    });

    return {
      width,
      height,
      bodyWidth,
      candles,
      verticalGridX,
      ticks,
    };
  });

  const volumePlot = $derived.by(() => {
    const width = 1000;
    const height = 96;
    const step =
      visibleData.length > 1 ? width / (visibleData.length - 1) : width;
    const barWidth = Math.max(1, Math.min(8, step * 0.62));
    const maxVol = Math.max(maxVolume, 1);

    const bars = visibleData.map((point, index) => {
      const x = visibleData.length > 1 ? index * step : width / 2;
      const value = Math.max(0, point.volume);
      const barHeight = Math.max(1, (value / maxVol) * (height - 8));
      return {
        x,
        y: height - barHeight,
        height: barHeight,
        isUp: point.close >= point.open,
      };
    });

    const gridY = [height * 0.25, height * 0.5, height * 0.75];

    return {
      width,
      height,
      barWidth,
      bars,
      gridY,
    };
  });

  const axisClasses = {
    tickLabel: "fill-slate-500 stroke-transparent text-[10px] font-medium",
    tick: "stroke-white/8",
    rule: "stroke-white/12",
  };
</script>

{#if currentMarket.errorMessage}
  <Alert variant="destructive" class="mb-4">
    <AlertTriangle class="size-4" />
    <AlertTitle>Gagal Memuat Data Market</AlertTitle>
    <AlertDescription>{currentMarket.errorMessage}</AlertDescription>
  </Alert>
{/if}

{#if normalized.length === 0}
  <Alert>
    <Activity class="size-4" />
    <AlertTitle>Belum Ada Data</AlertTitle>
    <AlertDescription
      >Data IHSG belum tersedia untuk ditampilkan saat ini.</AlertDescription
    >
  </Alert>
{:else}
  <Card class="border-neutral-800/80 bg-[#0b0f14]">
    <CardHeader class="pb-3">
      <div
        class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between"
      >
        <div>
          <CardTitle class="text-xl tracking-tight"
            >{currentMarket.title}</CardTitle
          >
          <p class="text-sm text-neutral-500 mt-1">
            Trading-style view (interval, pan, indicator, volume).
          </p>
        </div>
        <div class="flex items-center gap-2">
          <Badge
            variant="outline"
            class="border-white/15 bg-white/[0.02] text-neutral-300"
          >
            {currentMarket.source}
          </Badge>
          <Badge variant="secondary" class="bg-white/[0.04] text-neutral-300">
            {interval}
          </Badge>
        </div>
      </div>
      <div class="mt-3">
        <select
          bind:value={selectedMarketCode}
          class="w-full md:w-auto rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2 text-sm text-neutral-200 outline-none focus:ring-1 focus:ring-white/25"
        >
          {#each markets as market}
            <option value={market.code} class="bg-neutral-900 text-neutral-200">
              {market.label} ({market.symbol})
            </option>
          {/each}
        </select>
      </div>
    </CardHeader>

    <CardContent class="space-y-4">
      <div
        class="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between"
      >
        <div>
          <div class="flex items-center gap-2">
            <p class="text-3xl font-bold">
              {numberFormatter.format(latest?.close ?? 0)}
            </p>
            {#if dayChange >= 0}
              <TrendingUp
                class="size-5"
                style={`color: ${palette.positive};`}
              />
            {:else}
              <TrendingDown
                class="size-5"
                style={`color: ${palette.negative};`}
              />
            {/if}
          </div>
          <p
            class="text-sm"
            style={`color: ${dayChange >= 0 ? palette.positive : palette.negative};`}
          >
            {formatSigned(dayChange)} ({formatSigned(dayChangePercent)}%)
          </p>
        </div>

        <div class="flex flex-wrap items-center gap-2">
          <ToggleGroup
            type="single"
            bind:value={interval}
            variant="outline"
            spacing={0}
            class="rounded-lg border border-white/10 bg-white/[0.02] p-1"
          >
            <ToggleGroupItem value="1M">1M</ToggleGroupItem>
            <ToggleGroupItem value="3M">3M</ToggleGroupItem>
            <ToggleGroupItem value="6M">6M</ToggleGroupItem>
            <ToggleGroupItem value="1Y">1Y</ToggleGroupItem>
            <ToggleGroupItem value="ALL">ALL</ToggleGroupItem>
          </ToggleGroup>

          <ToggleGroup
            type="single"
            bind:value={mode}
            variant="outline"
            spacing={0}
            class="rounded-lg border border-white/10 bg-white/[0.02] p-1"
          >
            <ToggleGroupItem value="line">Line</ToggleGroupItem>
            <ToggleGroupItem value="area">Area</ToggleGroupItem>
            <ToggleGroupItem value="candles">Candles</ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-6">
        <div
          class="rounded-lg border border-neutral-800/90 bg-neutral-950/70 p-3"
        >
          <p class="text-xs text-neutral-400">Open</p>
          <p class="font-semibold">
            {numberFormatter.format(latest?.open ?? 0)}
          </p>
        </div>
        <div
          class="rounded-lg border border-neutral-800/90 bg-neutral-950/70 p-3"
        >
          <p class="text-xs text-neutral-400">High</p>
          <p class="font-semibold">
            {numberFormatter.format(latest?.high ?? 0)}
          </p>
        </div>
        <div
          class="rounded-lg border border-neutral-800/90 bg-neutral-950/70 p-3"
        >
          <p class="text-xs text-neutral-400">Low</p>
          <p class="font-semibold">
            {numberFormatter.format(latest?.low ?? 0)}
          </p>
        </div>
        <div
          class="rounded-lg border border-neutral-800/90 bg-neutral-950/70 p-3"
        >
          <p class="text-xs text-neutral-400">Range Chg</p>
          <p
            class="font-semibold"
            style={`color: ${rangeChange >= 0 ? palette.positive : palette.negative};`}
          >
            {formatSigned(rangeChangePercent)}%
          </p>
        </div>
        <div
          class="rounded-lg border border-neutral-800/90 bg-neutral-950/70 p-3"
        >
          <p class="text-xs text-neutral-400">Range L/H</p>
          <p class="font-semibold text-sm">
            {numberFormatter.format(minClose)} / {numberFormatter.format(
              maxClose
            )}
          </p>
        </div>
        <div
          class="rounded-lg border border-neutral-800/90 bg-neutral-950/70 p-3"
        >
          <p class="text-xs text-neutral-400">Avg Vol</p>
          <p class="font-semibold">{compactFormatter.format(avgVolume)}</p>
        </div>
      </div>

      <div class="flex flex-wrap items-center justify-between gap-2">
        <div class="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            class="h-8 border-white/10 bg-white/[0.02]"
            disabled={panOffset >= maxPanOffset}
            onclick={panLeft}
          >
            <ChevronLeft class="size-4" />
             Scroll Left
          </Button>
          <Button
            variant="outline"
            size="sm"
            class="h-8 border-white/10 bg-white/[0.02]"
            disabled={panOffset <= 0}
            onclick={panRight}
          >
            <ChevronRight class="size-4" />
            Back
          </Button>
        </div>

        <div class="flex items-center gap-2 text-xs text-neutral-400">
          <button
            type="button"
            class="rounded-md border border-white/10 px-2 py-1 hover:bg-white/[0.04]"
            onclick={() => (showSma20 = !showSma20)}
          >
            SMA20: {showSma20 ? "On" : "Off"}
          </button>
          <button
            type="button"
            class="rounded-md border border-white/10 px-2 py-1 hover:bg-white/[0.04]"
            onclick={() => (showVolume = !showVolume)}
          >
            Volume: {showVolume ? "On" : "Off"}
          </button>
        </div>
      </div>

      <Separator />

      <div
        class="relative h-80 w-full rounded-xl border border-white/10 p-2 shadow-inner"
        style={`background: ${palette.panel};`}
      >
        {#if mode === "area"}
          <AreaChart
            data={visibleData}
            x="date"
            y="close"
            {yDomain}
            rule={false}
            points={false}
            props={{
              area: {
                fill: palette.area,
                fillOpacity: 0.16,
                line: {
                  stroke: palette.line,
                  strokeWidth: 2,
                },
              },
              xAxis: {
                ticks: 6,
                format: (value: Date) => formatAxisDate(value),
                classes: axisClasses,
              },
              yAxis: {
                ticks: 5,
                format: (value: number) => numberFormatter.format(value),
                classes: axisClasses,
              },
              grid: {
                class: "stroke-white/[0.04]",
              },
            }}
          />
        {:else if mode === "line"}
          <LineChart
            data={visibleData}
            x="date"
            y="close"
            {yDomain}
            series={lineSeries}
            rule={false}
            points={false}
            props={{
              spline: {
                strokeWidth: 2,
              },
              xAxis: {
                ticks: 6,
                format: (value: Date) => formatAxisDate(value),
                classes: axisClasses,
              },
              yAxis: {
                ticks: 5,
                format: (value: number) => numberFormatter.format(value),
                classes: axisClasses,
              },
              grid: {
                class: "stroke-white/[0.04]",
              },
            }}
          />
        {:else}
          <svg
            viewBox={`0 0 ${candlePlot.width} ${candlePlot.height}`}
            preserveAspectRatio="none"
            class="h-full w-full"
          >
            {#each candlePlot.ticks as tick}
              <line
                x1="0"
                y1={tick.y}
                x2={candlePlot.width}
                y2={tick.y}
                stroke="rgba(255,255,255,0.04)"
                stroke-width="1"
              />
            {/each}

            {#each candlePlot.verticalGridX as x}
              <line
                x1={x}
                y1="0"
                x2={x}
                y2={candlePlot.height}
                stroke="rgba(255,255,255,0.03)"
                stroke-width="1"
              />
            {/each}

            {#each candlePlot.candles as candle}
              <line
                x1={candle.x}
                y1={candle.highY}
                x2={candle.x}
                y2={candle.lowY}
                stroke={candle.isUp ? palette.positive : palette.negative}
                stroke-width="1.25"
              />
              <rect
                x={candle.x - candlePlot.bodyWidth / 2}
                y={candle.bodyY}
                width={candlePlot.bodyWidth}
                height={candle.bodyHeight}
                fill={candle.isUp ? palette.positive : palette.negative}
                rx="1"
              />
            {/each}
          </svg>
        {/if}

        <div
          class={`absolute inset-2 ${isDragging ? "cursor-grabbing" : "cursor-grab"} touch-none`}
          onpointerdown={onChartPointerDown}
          onpointermove={onChartPointerMove}
          onpointerup={onChartPointerUp}
          onpointercancel={onChartPointerUp}
          onmouseleave={onChartLeave}
          onwheel={onChartWheel}
        >
          {#if hoveredPoint}
            <div
              class="absolute top-0 bottom-0 border-l border-dashed border-white/20 pointer-events-none"
              style={`left: ${hoverX}px;`}
            ></div>
            <div
              class="absolute left-0 right-0 border-t border-dashed border-white/15 pointer-events-none"
              style={`top: ${hoverY}px;`}
            ></div>
            <div
              class="absolute h-2.5 w-2.5 rounded-full border border-white/70 pointer-events-none"
              style={`left: ${hoverX - 5}px; top: ${hoverY - 5}px; background: ${palette.line};`}
            ></div>

            <div
              class="absolute min-w-44 rounded-md border border-white/12 bg-[#0b1220]/95 px-2.5 py-2 text-[11px] text-slate-200 shadow-lg pointer-events-none"
              style={`left: ${tooltipX}px; top: ${tooltipY}px;`}
            >
              <p class="mb-1 text-slate-400">
                {dateFormatter.format(hoveredPoint.date)}
              </p>
              <div class="grid grid-cols-2 gap-x-2 gap-y-1">
                <span class="text-slate-400">O</span><span
                  >{numberFormatter.format(hoveredPoint.open)}</span
                >
                <span class="text-slate-400">H</span><span
                  >{numberFormatter.format(hoveredPoint.high)}</span
                >
                <span class="text-slate-400">L</span><span
                  >{numberFormatter.format(hoveredPoint.low)}</span
                >
                <span class="text-slate-400">C</span><span
                  >{numberFormatter.format(hoveredPoint.close)}</span
                >
                <span class="text-slate-400">Vol</span><span
                  >{compactFormatter.format(hoveredPoint.volume)}</span
                >
              </div>
              <p
                class="mt-1.5"
                style={`color: ${hoveredChange >= 0 ? palette.positive : palette.negative};`}
              >
                {formatSigned(hoveredChange)} ({formatSigned(
                  hoveredChangePercent
                )}%)
              </p>
            </div>
          {/if}
        </div>
      </div>

      {#if showVolume}
        <div
          class="rounded-xl border border-white/10 p-2"
          style={`background: ${palette.panel};`}
        >
          {#if hasVolumeData}
            <svg
              viewBox={`0 0 ${volumePlot.width} ${volumePlot.height}`}
              preserveAspectRatio="none"
              class="h-24 w-full"
            >
              {#each volumePlot.gridY as y}
                <line
                  x1="0"
                  y1={y}
                  x2={volumePlot.width}
                  y2={y}
                  stroke="rgba(255,255,255,0.04)"
                  stroke-width="1"
                />
              {/each}

              {#each volumePlot.bars as bar}
                <rect
                  x={bar.x - volumePlot.barWidth / 2}
                  y={bar.y}
                  width={volumePlot.barWidth}
                  height={bar.height}
                  fill={bar.isUp
                    ? "rgba(38,166,154,0.65)"
                    : "rgba(239,83,80,0.65)"}
                  rx="1"
                />
              {/each}
            </svg>
          {:else}
            <div class="py-3 px-2 text-xs text-neutral-500">
              Volume tidak tersedia di sumber data aktif.
            </div>
          {/if}
        </div>
      {/if}

      <p class="text-xs text-neutral-500">
        Last updated: {dateFormatter.format(new Date(currentMarket.fetchedAt))} |
        Data points: {visibleData.length}
      </p>
    </CardContent>
  </Card>

  <Dialog bind:open={isChartDialogOpen}>
    <DialogContent
      showCloseButton={true}
      class="!inset-0 !top-0 !left-0 !w-screen !h-screen !max-w-none sm:!max-w-none !translate-x-0 !translate-y-0 !rounded-none !p-0 !border-0 bg-[#0b0f14] !overflow-y-auto"
    >
      <div class="flex h-full min-h-0 w-full flex-col">
        <DialogHeader class="px-4 py-3 border-b border-white/10 bg-[#0f1420]">
          <DialogTitle class="text-base md:text-lg">
            {currentMarket.title} ({currentMarket.symbol}) - Fullscreen
          </DialogTitle>
        </DialogHeader>

        <div class="flex-1 min-h-0 overflow-y-auto p-3 pb-[max(1rem,env(safe-area-inset-bottom))] md:p-4">
          <div class="mb-3 space-y-3">
            <div class="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <select
                bind:value={selectedMarketCode}
                class="w-full md:w-auto rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2 text-sm text-neutral-200 outline-none focus:ring-1 focus:ring-white/25"
              >
                {#each markets as market}
                  <option value={market.code} class="bg-neutral-900 text-neutral-200">
                    {market.label} ({market.symbol})
                  </option>
                {/each}
              </select>

              <div class="flex flex-wrap items-center gap-2">
                <ToggleGroup
                  type="single"
                  bind:value={interval}
                  variant="outline"
                  spacing={0}
                  class="rounded-lg border border-white/10 bg-white/[0.02] p-1"
                >
                  <ToggleGroupItem value="1M">1M</ToggleGroupItem>
                  <ToggleGroupItem value="3M">3M</ToggleGroupItem>
                  <ToggleGroupItem value="6M">6M</ToggleGroupItem>
                  <ToggleGroupItem value="1Y">1Y</ToggleGroupItem>
                  <ToggleGroupItem value="ALL">ALL</ToggleGroupItem>
                </ToggleGroup>

                <ToggleGroup
                  type="single"
                  bind:value={mode}
                  variant="outline"
                  spacing={0}
                  class="rounded-lg border border-white/10 bg-white/[0.02] p-1"
                >
                  <ToggleGroupItem value="line">Line</ToggleGroupItem>
                  <ToggleGroupItem value="area">Area</ToggleGroupItem>
                  <ToggleGroupItem value="candles">Candles</ToggleGroupItem>
                </ToggleGroup>
              </div>
            </div>

            <div class="flex flex-wrap items-center justify-between gap-2">
              <div class="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  class="h-8 border-white/10 bg-white/[0.02]"
                  disabled={panOffset >= maxPanOffset}
                  onclick={panLeft}
                >
                  <ChevronLeft class="size-4" />
Scroll Left
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  class="h-8 border-white/10 bg-white/[0.02]"
                  disabled={panOffset <= 0}
                  onclick={panRight}
                >
                  <ChevronRight class="size-4" />
                  Back
                </Button>
              </div>

              <div class="flex items-center gap-2 text-xs text-neutral-400">
                <button
                  type="button"
                  class="rounded-md border border-white/10 px-2 py-1 hover:bg-white/[0.04]"
                  onclick={() => (showSma20 = !showSma20)}
                >
                  SMA20: {showSma20 ? "On" : "Off"}
                </button>
                <button
                  type="button"
                  class="rounded-md border border-white/10 px-2 py-1 hover:bg-white/[0.04]"
                  onclick={() => (showVolume = !showVolume)}
                >
                  Volume: {showVolume ? "On" : "Off"}
                </button>
              </div>
            </div>
          </div>

          <div
            class="relative h-[72vh] w-full rounded-xl border border-white/10 p-2"
            style={`background: ${palette.panel};`}
          >
            {#if mode === "area"}
              <AreaChart
                data={visibleData}
                x="date"
                y="close"
                {yDomain}
                rule={false}
                points={false}
                props={{
                  area: {
                    fill: palette.area,
                    fillOpacity: 0.16,
                    line: {
                      stroke: palette.line,
                      strokeWidth: 2,
                    },
                  },
                  xAxis: {
                    ticks: 8,
                    format: (value: Date) => formatAxisDate(value),
                    classes: axisClasses,
                  },
                  yAxis: {
                    ticks: 6,
                    format: (value: number) => numberFormatter.format(value),
                    classes: axisClasses,
                  },
                  grid: {
                    class: "stroke-white/[0.04]",
                  },
                }}
              />
            {:else if mode === "line"}
              <LineChart
                data={visibleData}
                x="date"
                y="close"
                {yDomain}
                series={lineSeries}
                rule={false}
                points={false}
                props={{
                  spline: {
                    strokeWidth: 2,
                  },
                  xAxis: {
                    ticks: 8,
                    format: (value: Date) => formatAxisDate(value),
                    classes: axisClasses,
                  },
                  yAxis: {
                    ticks: 6,
                    format: (value: number) => numberFormatter.format(value),
                    classes: axisClasses,
                  },
                  grid: {
                    class: "stroke-white/[0.04]",
                  },
                }}
              />
            {:else}
              <svg
                viewBox={`0 0 ${candlePlot.width} ${candlePlot.height}`}
                preserveAspectRatio="none"
                class="h-full w-full"
              >
                {#each candlePlot.ticks as tick}
                  <line
                    x1="0"
                    y1={tick.y}
                    x2={candlePlot.width}
                    y2={tick.y}
                    stroke="rgba(255,255,255,0.04)"
                    stroke-width="1"
                  />
                {/each}
                {#each candlePlot.verticalGridX as x}
                  <line
                    x1={x}
                    y1="0"
                    x2={x}
                    y2={candlePlot.height}
                    stroke="rgba(255,255,255,0.03)"
                    stroke-width="1"
                  />
                {/each}
                {#each candlePlot.candles as candle}
                  <line
                    x1={candle.x}
                    y1={candle.highY}
                    x2={candle.x}
                    y2={candle.lowY}
                    stroke={candle.isUp ? palette.positive : palette.negative}
                    stroke-width="1.25"
                  />
                  <rect
                    x={candle.x - candlePlot.bodyWidth / 2}
                    y={candle.bodyY}
                    width={candlePlot.bodyWidth}
                    height={candle.bodyHeight}
                    fill={candle.isUp ? palette.positive : palette.negative}
                    rx="1"
                  />
                {/each}
              </svg>
            {/if}

            <div
              class={`absolute inset-2 ${isDragging ? "cursor-grabbing" : "cursor-grab"} touch-none`}
              onpointerdown={onChartPointerDown}
              onpointermove={onChartPointerMove}
              onpointerup={onChartPointerUp}
              onpointercancel={onChartPointerUp}
              onmouseleave={onChartLeave}
              onwheel={onChartWheel}
            >
              {#if hoveredPoint}
                <div
                  class="absolute top-0 bottom-0 border-l border-dashed border-white/20 pointer-events-none"
                  style={`left: ${hoverX}px;`}
                ></div>
                <div
                  class="absolute left-0 right-0 border-t border-dashed border-white/15 pointer-events-none"
                  style={`top: ${hoverY}px;`}
                ></div>
                <div
                  class="absolute h-2.5 w-2.5 rounded-full border border-white/70 pointer-events-none"
                  style={`left: ${hoverX - 5}px; top: ${hoverY - 5}px; background: ${palette.line};`}
                ></div>

                <div
                  class="absolute min-w-44 rounded-md border border-white/12 bg-[#0b1220]/95 px-2.5 py-2 text-[11px] text-slate-200 shadow-lg pointer-events-none"
                  style={`left: ${tooltipX}px; top: ${tooltipY}px;`}
                >
                  <p class="mb-1 text-slate-400">{dateFormatter.format(hoveredPoint.date)}</p>
                  <div class="grid grid-cols-2 gap-x-2 gap-y-1">
                    <span class="text-slate-400">O</span><span>{numberFormatter.format(hoveredPoint.open)}</span>
                    <span class="text-slate-400">H</span><span>{numberFormatter.format(hoveredPoint.high)}</span>
                    <span class="text-slate-400">L</span><span>{numberFormatter.format(hoveredPoint.low)}</span>
                    <span class="text-slate-400">C</span><span>{numberFormatter.format(hoveredPoint.close)}</span>
                    <span class="text-slate-400">Vol</span><span>{compactFormatter.format(hoveredPoint.volume)}</span>
                  </div>
                  <p
                    class="mt-1.5"
                    style={`color: ${hoveredChange >= 0 ? palette.positive : palette.negative};`}
                  >
                    {formatSigned(hoveredChange)} ({formatSigned(hoveredChangePercent)}%)
                  </p>
                </div>
              {/if}
            </div>
          </div>

          {#if showVolume}
            <div
              class="mt-3 rounded-xl border border-white/10 p-2"
              style={`background: ${palette.panel};`}
            >
              {#if hasVolumeData}
                <svg
                  viewBox={`0 0 ${volumePlot.width} ${volumePlot.height}`}
                  preserveAspectRatio="none"
                  class="h-28 w-full"
                >
                  {#each volumePlot.gridY as y}
                    <line
                      x1="0"
                      y1={y}
                      x2={volumePlot.width}
                      y2={y}
                      stroke="rgba(255,255,255,0.04)"
                      stroke-width="1"
                    />
                  {/each}
                  {#each volumePlot.bars as bar}
                    <rect
                      x={bar.x - volumePlot.barWidth / 2}
                      y={bar.y}
                      width={volumePlot.barWidth}
                      height={bar.height}
                      fill={bar.isUp
                        ? "rgba(38,166,154,0.65)"
                        : "rgba(239,83,80,0.65)"}
                      rx="1"
                    />
                  {/each}
                </svg>
              {:else}
                <div class="py-3 px-2 text-xs text-neutral-500">
                  Volume tidak tersedia di sumber data aktif.
                </div>
              {/if}
            </div>
          {/if}
        </div>
      </div>
    </DialogContent>
  </Dialog>
{/if}
