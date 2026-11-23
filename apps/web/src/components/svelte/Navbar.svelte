<script lang="ts">
import {
  buttonVariants,
  cn,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@ikuyo/ui";
import { Menu } from "lucide-svelte";
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

const linkState = (active: boolean) =>
  active
    ? "bg-secondary text-foreground"
    : "text-muted-foreground hover:bg-accent hover:text-foreground";

let menuOpen = $state(false);
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
  window.addEventListener("scroll", handleScroll, { passive: true });

  return () => {
    window.removeEventListener("scroll", handleScroll);
  };
});
</script>

<nav
  aria-label="Primary"
  class={cn(
    "fixed inset-x-0 top-[max(1rem,env(safe-area-inset-top))] z-50 mx-auto flex w-[calc(100%-2rem)] items-center justify-between gap-1 rounded-lg border border-border bg-background/85 py-1 pr-1 pl-3 shadow-panel backdrop-blur-[12px] transition-transform duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none sm:w-fit sm:justify-start sm:py-0 sm:pl-0",
    isVisible ? "translate-y-0" : "-translate-y-[calc(100%+2rem)]",
  )}
>
  <!-- Phones get the owner's name and a menu button; the link row takes over from sm. -->
  <a href="/" class="font-heading text-base font-medium text-foreground no-underline sm:hidden">Haikel</a>
  <ul class="m-0 hidden list-none items-center gap-0.5 p-1 sm:flex">
    {#each navList as item}
      {@const active = isActive(item.path)}
      <li>
        <a
          data-cy={item.cy}
          href={item.path === "/" ? "/" : `${item.path}/`}
          aria-current={active ? "page" : undefined}
          class={cn(
            "block rounded-md px-2.5 py-1.5 text-sm font-medium whitespace-nowrap no-underline transition-colors",
            linkState(active),
          )}
        >
          {item.label}
        </a>
      </li>
    {/each}
  </ul>
  <span class="hidden h-5 w-px shrink-0 bg-border sm:block" aria-hidden="true"></span>
  <div class="flex items-center gap-0.5">
    <ToggleTheme />
    <Sheet bind:open={menuOpen}>
      <SheetTrigger
        data-cy="menu-btn"
        aria-label="Open menu"
        class={buttonVariants({ variant: "ghost", size: "icon-sm", class: "sm:hidden" })}
      >
        <Menu class="size-4" aria-hidden="true" />
      </SheetTrigger>
      <SheetContent
        side="top"
        class="rounded-b-lg border-border bg-popover pt-[env(safe-area-inset-top)] shadow-panel"
      >
        <SheetHeader class="px-5 pt-5 pb-2">
          <SheetTitle class="text-lg leading-8">Menu</SheetTitle>
        </SheetHeader>
        <ul class="m-0 flex list-none flex-col gap-0.5 px-3 pt-0 pb-4">
          {#each navList as item}
            {@const active = isActive(item.path)}
            <li>
              <a
                href={item.path === "/" ? "/" : `${item.path}/`}
                aria-current={active ? "page" : undefined}
                onclick={() => (menuOpen = false)}
                class={cn(
                  "block rounded-md px-2 py-2.5 text-base font-medium no-underline transition-colors",
                  linkState(active),
                )}
              >
                {item.label}
              </a>
            </li>
          {/each}
        </ul>
      </SheetContent>
    </Sheet>
  </div>
</nav>
