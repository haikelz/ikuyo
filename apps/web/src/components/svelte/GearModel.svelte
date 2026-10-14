<script lang="ts">
  import { Button } from "@ikuyo/ui";
  import {
    ChevronDown,
    ChevronUp,
    Minus,
    Plus,
    RotateCcw,
    RotateCw,
  } from "lucide-svelte";
  import { onMount } from "svelte";
  import type {
    GearKind,
    GearViewer,
    ModelView,
    ViewCommand,
  } from "./gear/gear-viewer";

  let {
    kind,
    name,
    screenSrc,
  }: {
    kind: GearKind;
    name: string;
    screenSrc?: string;
  } = $props();

  let canvas: HTMLCanvasElement;
  let status = $state<"idle" | "loading" | "ready" | "unavailable">("idle");
  let view = $state<ModelView>("default");
  let viewer: GearViewer | undefined;
  const directions = [
    { command: "left", label: "Rotate left", icon: RotateCcw },
    { command: "right", label: "Rotate right", icon: RotateCw },
    { command: "up", label: "Tilt up", icon: ChevronUp },
    { command: "down", label: "Tilt down", icon: ChevronDown },
    { command: "in", label: "Zoom in", icon: Plus },
    { command: "out", label: "Zoom out", icon: Minus },
  ] satisfies { command: ViewCommand; label: string; icon: typeof Plus }[];

  onMount(() => {
    status = "loading";
    let unmounted = false;

    async function initialize() {
      try {
        const { createGearViewer } = await import("./gear/gear-viewer");
        if (unmounted) return;
        const activeViewer = await createGearViewer(
          canvas,
          kind,
          screenSrc,
          (nextView) => {
            view = nextView;
          },
          () => {
            status = "unavailable";
          },
        );
        if (unmounted) {
          activeViewer.dispose();
          return;
        }
        viewer = activeViewer;
        status = "ready";
      } catch (error) {
        if (unmounted) return;
        console.error(`Unable to display the ${name} 3D model.`, error);
        status = "unavailable";
      }
    }

    void initialize();
    return () => {
      unmounted = true;
      viewer?.dispose();
    };
  });
</script>

<figure
  class="m-0 space-y-4"
  aria-label={`${name} 3D viewer`}
  data-gear-model={kind}
  data-status={status}
>
  <div
    class="relative overflow-hidden rounded-lg border border-border/70 bg-muted/35"
  >
    <canvas
      bind:this={canvas}
      class={`block w-full cursor-grab active:cursor-grabbing ${kind === "keyboard" ? "h-64 sm:h-80" : "h-72 sm:h-96"}`}
      aria-label={`3D model of ${name}. Use the controls below to change the view.`}
      aria-describedby={`${kind}-model-hint`}
      role="img"
    ></canvas>
    {#if status !== "ready"}
      <div
        class="absolute inset-0 flex items-center justify-center bg-muted/35 p-8 text-center"
        role="status"
      >
        {#if status === "unavailable"}
          <p class="m-0 max-w-sm text-sm leading-7 text-muted-foreground">
            3D is unavailable in this browser. Enable WebGL or try another
            browser to explore this model.
          </p>
        {:else}
          <p class="m-0 text-sm text-muted-foreground">
            {#if status === "loading"}Loading 3D model…{/if}
            <noscript>Enable JavaScript to explore this 3D model.</noscript>
          </p>
        {/if}
      </div>
    {/if}
  </div>

  <figcaption class="space-y-3">
    <div
      class="flex justify-center flex-wrap items-center gap-2"
      role="group"
      aria-label={`${name} model controls`}
    >
      <Button
        variant="outline"
        class="h-11 px-4"
        disabled={status !== "ready"}
        aria-label={`Reset ${name} view`}
        onclick={() => viewer?.move("reset")}>Reset view</Button
      >
      <Button
        variant="outline"
        class="h-11 px-4"
        disabled={status !== "ready"}
        aria-label={`Show ${name} from above`}
        aria-pressed={view === "top"}
        onclick={() => viewer?.move("top")}>View from above</Button
      >
      {#each directions as direction}
        <Button
          variant="outline"
          size="icon"
          class="size-11"
          disabled={status !== "ready"}
          aria-label={`${direction.label}: ${name}`}
          title={direction.label}
          onclick={() => viewer?.move(direction.command)}
        >
          <direction.icon class="size-4" aria-hidden="true" />
        </Button>
      {/each}
    </div>
    <p
      id={`${kind}-model-hint`}
      class="m-0 text-xs text-center leading-6 text-muted-foreground"
    >
      Drag with a mouse or two fingers to rotate. Scroll or pinch to zoom.
    </p>
  </figcaption>
</figure>
