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
    "fixed bg-neutral-950/70 w-full rounded-none md:rounded-full! md:w-fit items-center space-x-5 md:space-x-0 justify-center right-0 left-0 md:bottom-4 flex px-3 py-2.5 md:px-3 md:py-2.5 md:space-y-5 border-b-[0.5px] md:border-[0.5px] mx-auto backdrop-blur-md z-50!"
  )}
>
  <div
    class="flex justify-between w-full md:w-fit flex-col items-center md:space-x-5!"
  >
    <div class="flex justify-between w-full items-center">
      <a data-cy="home-btn" href="/" aria-label="/" class="mr-5!">
        <button
          type="button"
          aria-label="/"
          class={twMerge("p-1.5 cursor-pointer bg-neutral-900 rounded-full")}
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
      <div class="md:flex space-x-5 text-neutral-50 hidden">
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
                  ? "bg-neutral-900 rounded-full"
                  : ""
              )}
            >
              <item.icon
                size={21}
                class={twMerge("font-bold text-neutral-50")}
              />
            </button>
          </a>
        {/each}
      </div>
      <button
        onclick={toggleNavbar}
        class="block md:hidden m-0! text-neutral-50 bg-neutral-900 rounded-full p-1.5"
      >
        {#if isOpen}
          <XIcon size={21} />
        {:else}
          <MenuIcon size={21} />
        {/if}
      </button>
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
            class="cursor-pointer font-bold text-neutral-50 no-underline hover:underline"
          >
            {item.path.slice(1)[0][0].toUpperCase() + item.path.slice(2)}
          </a>
        {/each}
      </div>
    {/if}
  </div>
</nav>
