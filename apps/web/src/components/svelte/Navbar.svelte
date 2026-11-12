<script lang="ts">
import {
  Button,
  cn,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@ikuyo/ui";
import {
  AlbumIcon,
  HashIcon,
  HouseIcon,
  ImagesIcon,
  ListIcon,
  MenuIcon,
  NotepadTextIcon,
} from "lucide-svelte";
import { onMount } from "svelte";
import ToggleTheme from "./ToggleTheme.svelte";

let { currentPath } = $props();

const navList = [
  {
    id: 0,
    icon: HouseIcon,
    path: "/",
    label: "Home",
    cy: "home-btn",
  },
  {
    id: 1,
    icon: ListIcon,
    path: "/works",
    label: "Works",
    cy: "works-btn",
  },
  {
    id: 2,
    icon: NotepadTextIcon,
    path: "/notes",
    label: "Notes",
    cy: "notes-btn",
  },
  {
    id: 3,
    icon: HashIcon,
    path: "/tags",
    label: "Tags",
    cy: "tags-btn",
  },
  {
    id: 4,
    icon: ImagesIcon,
    path: "/photos",
    label: "Photos",
    cy: "photos-btn",
  },
  {
    id: 5,
    icon: AlbumIcon,
    path: "/guestbook",
    label: "Guestbook",
    cy: "guestbook-btn",
  },
];

const isActive = (path: string) =>
  path === "/" ? currentPath === "/" : currentPath.includes(path);

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

<!-- Controls pin their radius with `!` because the site-wide :focus-visible rule inherits the parent radius. -->
<nav
  aria-label="Primary"
  class={cn(
    "fixed top-[max(1rem,env(safe-area-inset-top))] right-4 z-50 flex items-center gap-2 transition-transform duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
    isVisible ? "translate-y-0" : "-translate-y-[calc(100%+2rem)]",
  )}
>
  <ToggleTheme />
  <DropdownMenu>
    <DropdownMenuTrigger>
      {#snippet child({ props })}
        <Button
          {...props}
          type="button"
          variant="outline"
          size="icon-sm"
          data-cy="nav-menu-btn"
          aria-label="Open navigation menu"
          class="rounded-md! bg-background"
        >
          <MenuIcon size={21} aria-hidden="true" />
        </Button>
      {/snippet}
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" sideOffset={8} class="w-52">
      {#each navList as item}
        {@const active = isActive(item.path)}
        <DropdownMenuItem>
          {#snippet child({ props })}
            <a
              {...props}
              data-cy={item.cy}
              href={item.path === "/" ? "/" : `${item.path}/`}
              aria-current={active ? "page" : undefined}
              class={cn(
                props.class as string,
                "rounded-md! font-medium! no-underline!",
                // The accent background marks keyboard and pointer focus; the dot marks the current page.
                active ? "text-foreground" : "text-muted-foreground",
              )}
            >
              <item.icon size={16} aria-hidden="true" />
              <span>{item.label}</span>
              {#if active}
                <span class="ml-auto size-1.5 rounded-full bg-primary" aria-hidden="true"></span>
              {/if}
            </a>
          {/snippet}
        </DropdownMenuItem>
      {/each}
    </DropdownMenuContent>
  </DropdownMenu>
</nav>
