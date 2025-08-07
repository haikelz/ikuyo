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
  import { twMerge } from "tailwind-merge";
  import ToggleTheme from "./ToggleTheme.svelte";

  let { currentPath } = $props();

  const navList = [
    {
      id: 1,
      icon: ListIcon,
      path: "/works",
    },
    {
      id: 2,
      icon: NotepadTextIcon,
      path: "/notes",
    },
    {
      id: 3,
      icon: HashIcon,
      path: "/tags",
    },
    {
      id: 4,
      icon: ImagesIcon,
      path: "/photos",
    },
    {
      id: 5,
      icon: AlbumIcon,
      path: "/guestbook",
    },
  ];

  let isOpen = $state(false);

  function toggleNavbar() {
    isOpen = !isOpen;
  }
</script>

<nav
  class={twMerge(
    "md:relative fixed md:top-0 md:left-0 top-4 left-4 bg-monochrome-1/70 dark:bg-neutral-950/70 right-4 border-dashed justify-between md:justify-start items-center space-x-5 md:space-x-0 md:bottom-0 flex-col flex md:items-start md:flex-col px-3 py-1.5 md:px-4 md:py-4 md:space-y-5",
    "border-[0.5px] rounded-md md:rounded-none md:border-[0.5px] mx-auto md:mx-0",
    "backdrop-blur-md z-50"
  )}
>
  <div
    class="flex flex-col justify-between items-center w-full md:flex-col md:space-y-5"
  >
    <div
      class="flex justify-between items-center flex-row md:flex-col w-full md:space-y-5"
    >
      <a data-cy="home-btn" href="/" aria-label="/">
        <button
          type="button"
          aria-label="/"
          class={twMerge(
            "p-1.5 cursor-pointer bg-monochrome-3 dark:bg-neutral-900 rounded-full"
          )}
        >
          <img
            class="rounded-full h-6 w-6 object-cover photos"
            alt="Github Profile"
            width={500}
            height={500}
            draggable={false}
            src="https://avatars.githubusercontent.com/u/77146709?v=4"
          />
        </button>
      </a>
      <div
        class="md:flex flex-col space-y-5 dark:text-monochrome-1 text-neutral-950 hidden"
      >
        {#each navList as item}
          <a
            data-cy={`${item.path.slice(1)}-btn`}
            href={item.path}
            aria-label={item.path}
            class="cursor-pointer"
          >
            <button
              type="button"
              aria-label={item.path}
              class={twMerge(
                "p-1.5 cursor-pointer",
                currentPath.includes(item.path)
                  ? "bg-monochrome-3 dark:bg-neutral-900 rounded-full"
                  : ""
              )}
            >
              <item.icon
                size={21}
                class={twMerge(
                  "font-bold text-gray-950 dark:text-monochrome-1"
                )}
              />
            </button>
          </a>
        {/each}
      </div>
      <div class="flex justify-center items-center space-x-5 md:space-x-0">
        <ToggleTheme />
        <button
          onclick={toggleNavbar}
          class="block md:hidden text-neutral-950 dark:text-monochrome-1 bg-monochrome-3 dark:bg-neutral-900 rounded-full p-1.5"
        >
          {#if isOpen}
            <XIcon size={21} />
          {:else}
            <MenuIcon size={21} />
          {/if}
        </button>
      </div>
    </div>
    {#if isOpen}
      <div
        class="flex md:hidden slide-enter-content justify-start w-full py-5 items-start space-y-5 flex-col"
      >
        {#each navList as item}
          <a
            data-cy={`${item.path.slice(1)}-btn`}
            href={item.path}
            aria-label={item.path}
            class="cursor-pointer text-neutral-950 font-bold dark:text-monochrome-1 no-underline hover:underline"
          >
            {item.path.slice(1)[0][0].toUpperCase() + item.path.slice(2)}
          </a>
        {/each}
      </div>
    {/if}
  </div>
</nav>
