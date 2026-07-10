<script lang="ts">
  import {
    Button,
    cn,
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
  } from "@ikuyo/ui";
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
  import ToggleTheme from "./ToggleTheme.svelte";

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
    "fixed inset-x-0 top-0 z-50! flex w-full justify-center transition-transform duration-300 ease-in-out bg-background/95 backdrop-blur-sm border-b border-border/70",
    isVisible ? "translate-y-0" : "-translate-y-full",
  )}
>
  <div
    class={cn(
      "flex w-full max-w-6xl min-h-16 items-center justify-between px-4 md:px-8",
    )}
  >
    <a
      data-cy="home-btn"
      href="/"
      aria-label="Home"
      class="shrink-0 flex items-center gap-3 no-underline"
    >
      <img
        class="rounded-md h-8 w-8 object-cover"
        alt="Haikel"
        width={500}
        height={500}
        draggable={false}
        src="https://avatars.githubusercontent.com/u/77146709?v=4"
      />
      <span class="font-medium text-foreground tracking-tight">ekel.dev</span>
    </a>
    <div class="hidden text-foreground md:flex md:items-center md:space-x-8">
      {#each navList as item}
        <a
          data-cy={`${item.path.slice(1)}-btn`}
          href={item.path}
          aria-label={item.label}
          class={cn(
            "text-sm font-medium transition-colors no-underline",
            currentPath.includes(item.path)
              ? "text-foreground"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {item.label}
        </a>
      {/each}
      <div class="pl-4 border-l border-border/70">
        <ToggleTheme />
      </div>
    </div>
    <Sheet bind:open={isOpen}>
      <Button
        variant="ghost"
        size="icon-sm"
        onclick={toggleNavbar}
        class="m-0! shrink-0 md:hidden text-muted-foreground hover:text-foreground transition-colors"
        aria-expanded={isOpen}
        aria-controls="mobile-nav-sheet"
        aria-label="Toggle navigation menu"
      >
        {#if isOpen}
          <XIcon size={20} />
        {:else}
          <MenuIcon size={20} />
        {/if}
      </Button>
      <SheetContent
        side="bottom"
        id="mobile-nav-sheet"
        class="rounded-t-md border-border/80 bg-background pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-2 border-t border-border/70"
        showCloseButton={false}
      >
        <div
          class="mx-auto mb-3 h-1 w-8 shrink-0 rounded-sm bg-muted-foreground/25"
          aria-hidden="true"
        ></div>
        <SheetHeader class="space-y-1 pb-2 text-left">
          <div class="flex items-center justify-between">
            <SheetTitle
              class="text-base font-medium tracking-tight text-foreground"
            >
              Navigate
            </SheetTitle>
            <ToggleTheme />
          </div>
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
                "flex min-h-12 items-center gap-3 rounded-md px-3 py-2.5 text-base font-medium no-underline transition-colors",
                active
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
              )}
              onclick={() => {
                isOpen = false;
              }}
            >
              <span
                class="flex size-9 shrink-0 items-center justify-center rounded-md bg-muted/50"
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
</nav>
