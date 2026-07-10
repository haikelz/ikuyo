<script lang="ts">
import { XIcon } from "lucide-svelte";
import { twMerge } from "tailwind-merge";

const title = "Free Palestine 🇵🇸";
const description = `Stand for humanity!`;
const linkTo = "https://twitter.com/search?q=%23PalestineLivesMatter";

let isVisible = $state(true);

function closeBanner() {
  isVisible = false;
}
</script>

{#if isVisible}
  <div
    class={twMerge(
      "hidden fixed sm:sticky sm:top-0! isolate z-50 sm:flex items-center overflow-hidden w-full! px-3.5 py-2.5 md:px-6",
      "bg-background border-b border-border/40",
    )}
  >
    <div class="flex justify-between w-full items-center">
      <p
        class={twMerge(
          "mx-auto text-sm leading-4 sm:leading-6",
          "text-muted-foreground",
        )}
      >
        <a href={linkTo} target="_blank" rel="noopener noreferrer" aria-label="Free Palestine (opens in new tab)" class="hover:text-foreground transition-colors">
          <strong class="font-medium text-foreground">{title}</strong>
          {description}
        </a>
      </p>

      <button
        onclick={closeBanner}
        class={twMerge(
          "ml-4 shrink-0 rounded-md p-1.5 transition-colors duration-200",
          "hover:bg-muted text-muted-foreground hover:text-foreground",
        )}
        aria-label="Close banner"
      >
        <XIcon size={18} />
      </button>
    </div>
  </div>
{/if}
