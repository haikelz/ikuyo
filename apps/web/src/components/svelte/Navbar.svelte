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
    "fixed bg-neutral-950/70 w-full rounded-none md:rounded-full! md:w-fit items-center space-x-5 md:space-x-0 justify-center right-0 left-0 flex px-3 py-2.5 md:px-3 md:py-2.5 md:space-y-5 border-b-[0.5px] md:border-[0.5px] mx-auto backdrop-blur-md z-50! transition-transform duration-300 ease-in-out",
    isVisible
      ? "translate-y-0 md:bottom-4"
      : "-translate-y-full md:translate-y-full md:bottom-0",
  )}
>
  <div
    class="flex justify-between w-full md:w-fit flex-col items-center md:space-x-5!"
  >
    <div class="flex justify-between w-full items-center">
      <Tooltip content="My Istri">
        {#snippet children()}
          <a data-cy="home-btn" href="/" aria-label="/" class="mr-5!">
            <Button
              type="button"
              variant="secondary"
              size="icon-sm"
              class="rounded-full p-0 overflow-hidden"
              aria-label="/"
            >
              <img
                class="rounded-full h-6 w-6 object-cover photos"
                alt="Github Profile"
                width={500}
                height={500}
                draggable={false}
                src="https://avatars.githubusercontent.com/u/77146709?v=4"
              />
            </Button>
          </a>
        {/snippet}
      </Tooltip>
      <div class="md:flex space-x-5 text-neutral-50 hidden">
        {#each navList as item}
          <Tooltip content={item.label}>
            {#snippet children()}
              <a
                data-cy={`${item.path.slice(1)}-btn`}
                href={item.path}
                aria-label={item.path}
                class="cursor-pointer"
              >
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  class={cn(
                    "rounded-full",
                    currentPath.includes(item.path) ? "bg-neutral-900" : "",
                  )}
                  aria-label={item.path}
                >
                  <item.icon
                    size={21}
                    class={cn("font-bold text-neutral-50")}
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
          class="m-0! block rounded-full md:hidden"
          aria-expanded={isOpen}
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
          class="border-neutral-800 bg-neutral-950/95 pb-8"
          showCloseButton={false}
        >
          <SheetHeader>
            <SheetTitle class="text-left">Menu</SheetTitle>
          </SheetHeader>
          <nav class="flex flex-col gap-3 pt-2">
            {#each navList as item}
              <a
                data-cy={`${item.path.slice(1)}-btn`}
                href={item.path}
                aria-label={item.path}
                class="cursor-pointer font-bold text-neutral-50 no-underline hover:underline text-lg"
                onclick={() => {
                  isOpen = false;
                }}
              >
                {item.path.slice(1)[0].toUpperCase() +
                  item.path.slice(2)}
              </a>
            {/each}
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  </div>
</nav>
