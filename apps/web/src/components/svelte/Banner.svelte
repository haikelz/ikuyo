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
      "bottom-0! fixed sm:sticky sm:top-0! isolate z-50 sm:flex items-center overflow-hidden w-full! px-3.5 py-2.5 backdrop-blur-sm md:px-6",
      "bg-gray-600/70"
    )}
  >
    <div
      class="absolute left-[max(-7rem,calc(50%-52rem))] top-1/2 -z-10 -translate-y-1/2 transform-gpu blur-2xl"
      aria-hidden="true"
    >
      <div
        class="aspect-[577/310] w-[36.0625rem] bg-gradient-to-r from-[#149954] to-[#E4312b] opacity-80 md:opacity-50"
        style="clip-path: polygon(74.8% 41.9%, 97.2% 73.2%, 100% 34.9%, 92.5% 0.4%, 87.5% 0%, 75% 28.6%, 58.5% 54.6%, 50.1% 56.8%, 46.9% 44%, 48.3% 17.4%, 24.7% 53.9%, 0% 27.9%, 11.9% 74.2%, 24.9% 54.1%, 68.6% 100%, 74.8% 41.9%)"
      ></div>
    </div>
    <div
      class="absolute left-[max(45rem,calc(50%+8rem))] top-1/2 -z-10 -translate-y-1/2 transform-gpu blur-2xl"
      aria-hidden="true"
    >
      <div
        class="aspect-[577/310] w-[36.0625rem] bg-gradient-to-r from-[#149954] to-[#E4312b] opacity-80 md:opacity-50"
        style="clip-path: polygon(74.8% 41.9%, 97.2% 73.2%, 100% 34.9%, 92.5% 0.4%, 87.5% 0%, 75% 28.6%, 58.5% 54.6%, 50.1% 56.8%, 46.9% 44%, 48.3% 17.4%, 24.7% 53.9%, 0% 27.9%, 11.9% 74.2%, 24.9% 54.1%, 68.6% 100%, 74.8% 41.9%)"
      ></div>
    </div>
    <div class="flex justify-between w-full items-center">
      <p
        class={twMerge(
          "mx-auto text-sm leading-4 sm:leading-6",
          "text-gray-300"
        )}
      >
        <a href={linkTo} target="_blank" rel="noopener noreferrer">
          <strong class="font-semibold">{title}</strong>
          {description}
        </a>
      </p>

      <button
        onclick={closeBanner}
        class={twMerge(
          "ml-4 shrink-0 rounded-md p-1.5 transition-colors duration-200",
          "hover:bg-gray-700 text-gray-300 hover:text-gray-100"
        )}
        aria-label="Close banner"
      >
        <XIcon size={18} />
      </button>
    </div>
  </div>
{/if}
