<script lang="ts">
  import {
    AlbumIcon,
    HashIcon,
    ImagesIcon,
    ListIcon,
    MenuIcon,
    NotepadTextIcon,
    XIcon,
  } from "lucide-svelte";
  import { onMount } from "svelte";
  import { cn } from "@/lib/utils";
  import { Button } from "@/components/svelte/ui/button";
  import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
  } from "@/components/svelte/ui/sheet";
  import Tooltip from "./Tooltip.svelte";

  let { currentPath } = $props();

  const navList = [
    {
      id: 1,
      icon: ListIcon,
      path: "/works",
      label: "Works",
    },
    {
      id: 2,
      icon: NotepadTextIcon,
      path: "/notes",
      label: "Notes",
    },
    {
      id: 3,
      icon: HashIcon,
      path: "/tags",
      label: "Tags",
    },
    {
      id: 4,
      icon: ImagesIcon,
      path: "/photos",
      label: "Photos",
    },
    {
      id: 5,
      icon: AlbumIcon,
      path: "/guestbook",
      label: "Guestbook",
    },
  ];

  let isOpen = $state(false);
  let isVisible = $state(true);
  let lastScrollY = $state(0);
  let ticking = $state(false);

  function toggleNavbar() {
    isOpen = !isOpen;
  }

  function handleScroll() {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const currentScrollY = window.scrollY;

        if (currentScrollY < 10) {
          isVisible = true;
        } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
          isVisible = false;
          isOpen = false;
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
  class={cn(
    "fixed z-50! flex w-full max-w-full items-center justify-center px-0 transition-transform duration-300 ease-in-out md:px-4",
    "border-b border-border/60 bg-background/80 backdrop-blur-xl md:border md:border-border/60 md:bg-background/70 md:backdrop-blur-md",
    "rounded-none md:rounded-full! md:w-fit md:max-w-none md:space-x-0 md:space-y-0 md:px-3 md:py-2.5",
    isVisible
      ? "translate-y-0 md:bottom-4"
      : "-translate-y-full md:translate-y-full md:bottom-0",
  )}
  style="padding-top: max(0.625rem, env(safe-area-inset-top, 0px));"
>
  <div
    class="flex w-full max-w-full flex-col items-stretch md:w-fit md:flex-row md:items-center md:space-x-5!"
  >
    <div
      class="flex min-h-13 w-full items-center justify-between gap-3 px-4 md:min-h-0 md:w-fit md:justify-center md:gap-5 md:px-3 md:py-0"
    >
      <Tooltip content="My Istri">
        {#snippet children()}
          <a data-cy="home-btn" href="/" aria-label="Home" class="shrink-0">
            <Button
              type="button"
              variant="secondary"
              size="icon-sm"
              class="rounded-full p-0 overflow-hidden"
            >
              <img
                class="rounded-full h-6 w-6 object-cover photos"
                alt=""
                width={500}
                height={500}
                draggable={false}
                src="https://avatars.githubusercontent.com/u/77146709?v=4"
              />
            </Button>
          </a>
        {/snippet}
      </Tooltip>
      <div class="hidden text-foreground md:flex md:items-center md:space-x-5">
        {#each navList as item}
          <Tooltip content={item.label}>
            {#snippet children()}
              <a
                data-cy={`${item.path.slice(1)}-btn`}
                href={item.path}
                aria-label={item.label}
                class="cursor-pointer"
              >
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  class={cn(
                    "rounded-full",
                    currentPath.includes(item.path) ? "bg-muted" : "",
                  )}
                >
                  <item.icon
                    size={21}
                    class="font-bold text-foreground"
                  />
                </Button>
              </a>
            {/snippet}
          </Tooltip>
        {/each}
      </div>
      <Sheet bind:open={isOpen}>
        <Button
          variant="secondary"
          size="icon-sm"
          onclick={toggleNavbar}
          class="m-0! shrink-0 rounded-full md:hidden"
          aria-expanded={isOpen}
          aria-controls="mobile-nav-sheet"
          aria-label="Toggle navigation menu"
        >
          {#if isOpen}
            <XIcon size={21} />
          {:else}
            <MenuIcon size={21} />
          {/if}
        </Button>
        <SheetContent
          side="bottom"
          id="mobile-nav-sheet"
          class="rounded-t-2xl border-border/80 bg-background/95 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-2 shadow-2xl"
          showCloseButton={false}
        >
          <div
            class="mx-auto mb-3 h-1 w-10 shrink-0 rounded-full bg-muted-foreground/25"
            aria-hidden="true"
          ></div>
          <SheetHeader class="space-y-1 pb-2 text-left">
            <SheetTitle class="text-base font-semibold tracking-tight">
              Navigate
            </SheetTitle>
          </SheetHeader>
          <nav
            class="flex max-h-[min(70vh,28rem)] flex-col gap-1 overflow-y-auto overscroll-contain px-1 pb-1"
            aria-label="Primary"
          >
            {#each navList as item}
              {@const active = currentPath.includes(item.path)}
              <a
                data-cy={`${item.path.slice(1)}-btn`}
                href={item.path}
                aria-current={active ? "page" : undefined}
                class={cn(
                  "flex min-h-12 items-center gap-3 rounded-xl px-3 py-2.5 text-base font-medium no-underline transition-colors",
                  active
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                )}
                onclick={() => {
                  isOpen = false;
                }}
              >
                <span
                  class="flex size-9 shrink-0 items-center justify-center rounded-lg bg-background/80 ring-1 ring-border/60"
                >
                  <item.icon size={20} class="text-foreground" />
                </span>
                <span>{item.label}</span>
              </a>
            {/each}
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  </div>
</nav>
