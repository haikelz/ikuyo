<script lang="ts">
import { cn } from "@ikuyo/ui";
import { onMount } from "svelte";
import ToggleTheme from "./ToggleTheme.svelte";

let { currentPath } = $props();

const navList = [
  { id: 0, path: "/", label: "Home", cy: "home-btn" },
  { id: 1, path: "/about", label: "About", cy: "about-btn" },
  { id: 2, path: "/works", label: "Works", cy: "works-btn" },
  { id: 3, path: "/notes", label: "Notes", cy: "notes-btn" },
  { id: 4, path: "/tags", label: "Tags", cy: "tags-btn" },
  { id: 5, path: "/photos", label: "Photos", cy: "photos-btn" },
  { id: 6, path: "/guestbook", label: "Guestbook", cy: "guestbook-btn" },
];

const isActive = (path: string) =>
  path === "/" ? currentPath === "/" : currentPath.includes(path);

let list: HTMLUListElement;
let isVisible = $state(true);
let lastScrollY = $state(0);
let ticking = $state(false);

function handleScroll() {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < 10) {
        isVisible = true;
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        isVisible = false;
      } else if (currentScrollY < lastScrollY) {
        isVisible = true;
      }

      lastScrollY = currentScrollY;
      ticking = false;
    });

    ticking = true;
  }
}

onMount(() => {
  // On narrow screens the links scroll inside the bar; start with the current page centred.
  const active = list.querySelector<HTMLElement>('[aria-current="page"]');
  if (active) list.scrollLeft = active.offsetLeft - (list.clientWidth - active.offsetWidth) / 2;

  window.addEventListener("scroll", handleScroll, { passive: true });

  return () => {
    window.removeEventListener("scroll", handleScroll);
  };
});
</script>

<!-- Controls pin their radius with `!` because the site-wide :focus-visible rule inherits the parent radius. -->
<nav
  aria-label="Primary"
  class={cn(
    "fixed inset-x-0 top-[max(1rem,env(safe-area-inset-top))] z-50 mx-auto flex w-fit max-w-[calc(100%-2rem)] items-center gap-1 rounded-full border border-border/60 bg-background/60 pr-1 shadow-sm backdrop-blur-md backdrop-saturate-150 transition-transform duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
    isVisible ? "translate-y-0" : "-translate-y-[calc(100%+2rem)]",
  )}
>
  <!-- ponytail: the clipped label at the bar's edge is the only scroll hint; add an edge fade if visitors miss it. -->
  <!-- The p-1 leaves room for the 2px focus outline and its 2px offset inside the scroll clip. -->
  <ul
    bind:this={list}
    class="relative m-0 flex min-w-0 list-none items-center gap-0.5 overflow-x-auto overscroll-x-contain p-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
  >
    {#each navList as item}
      {@const active = isActive(item.path)}
      <li>
        <a
          data-cy={item.cy}
          href={item.path === "/" ? "/" : `${item.path}/`}
          aria-current={active ? "page" : undefined}
          class={cn(
            "block rounded-full! px-3 py-1.5 text-sm whitespace-nowrap font-medium! no-underline! transition-colors",
            active
              ? "bg-accent text-accent-foreground"
              : "text-muted-foreground hover:bg-accent/60 hover:text-foreground",
          )}
        >
          {item.label}
        </a>
      </li>
    {/each}
  </ul>
  <span class="h-5 w-px shrink-0 bg-border" aria-hidden="true"></span>
  <ToggleTheme />
</nav>
