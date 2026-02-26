<script lang="ts">
  import { ImageIcon } from "lucide-svelte";
  import { onMount } from "svelte";
  import { fade, scale } from "svelte/transition";
  import PhotoGrid from "./PhotoGrid.svelte";

  let { images = [] } = $props<{ images: string[] }>();

  let confirmed = $state(false);
  let showWarning = $state(false);

  function confirm() {
    confirmed = true;
    showWarning = false;
  }

  function dismiss() {
    showWarning = false;
    history.back();
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === "Escape") dismiss();
  }

  function teleport(node: HTMLElement) {
    document.body.appendChild(node);
    return {
      destroy() {
        if (node.parentNode) node.parentNode.removeChild(node);
      },
    };
  }

  onMount(() => {
    showWarning = true;
  });
</script>

{#if showWarning}
  <div
    use:teleport
    class="fixed inset-0 z-[9999] flex items-center justify-center p-4"
    transition:fade={{ duration: 180 }}
    onkeydown={handleKeydown}
    role="dialog"
    tabindex="-1"
    aria-modal="true"
    aria-labelledby="warning-title"
  >
    <div class="absolute inset-0 bg-black/70 backdrop-blur-[16px]"></div>
    <div
      class="relative z-10 w-full max-w-sm rounded-2xl border border-white/10 bg-neutral-900/90 p-6 shadow-2xl"
      transition:scale={{ duration: 280, start: 0.92, opacity: 0 }}
    >
      <div
        class="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/15"
      >
        <ImageIcon size={24} class="text-amber-400" />
      </div>
      <h2
        id="warning-title"
        class="mb-2 text-base font-semibold text-white leading-snug"
      >
        Attention!
      </h2>
      <p class="mb-6 text-sm leading-relaxed text-neutral-400 text-justify">
        The <span class="text-neutral-200 font-medium">/photos</span> page
        contains many high-resolution images. Some of them are larger than
        <span class="text-amber-400 font-medium">&gt; 1 MB</span>. Make sure
        you're on Wi-Fi or comfortable with your mobile data usage. <br />
        All of the photos are taken by myself using
        <span class="text-neutral-200 font-medium"
          >Sony A5000 + TTArtisan 56mm f/1.8</span
        > lens.
      </p>
      <div class="flex flex-col gap-2">
        <button
          class="w-full rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-neutral-900 transition-all hover:bg-neutral-100 active:scale-[.98] cursor-pointer outline-none"
          onclick={confirm}
        >
          Continue
        </button>
        <button
          class="w-full rounded-xl border border-white/10 bg-transparent px-4 py-2.5 text-sm font-medium text-neutral-400 transition-all hover:bg-white/5 hover:text-white active:scale-[.98] cursor-pointer outline-none"
          onclick={dismiss}
        >
          Go back
        </button>
      </div>
    </div>
  </div>
{/if}

{#if confirmed}
  <div transition:fade={{ duration: 300 }}>
    <PhotoGrid {images} masonry={true} />
  </div>
{/if}
