<script lang="ts">
  import {
    AlbumIcon,
    HashIcon,
    ImagesIcon,
    ListIcon,
    NotepadTextIcon
  } from "lucide-svelte";
  import { twMerge } from "tailwind-merge";

  export let currentPath: string;

  const navList = [
    {
      id: 1,
      icon: ListIcon,
      path: "/works"
    },
    {
      id: 2,
      icon: NotepadTextIcon,
      path: "/notes"
    },
    {
      id: 3,
      icon: HashIcon,
      path: "/tags"
    },
    {
      id: 4,
      icon: ImagesIcon,
      path: "/photos"
    },
    {
      id: 5,
      icon: AlbumIcon,
      path: "/guestbook"
    }
  ];
</script>

<nav
  data-cy="bottom-nav"
  class={twMerge(
    "fixed flex justify-center items-center px-4 py-2 space-x-5",
    "w-fit border-[0.5px] mx-auto right-0 left-0 bottom-4 rounded-full",
    "bg-base-0/70 backdrop-blur-md border-base-2 z-50"
  )}
>
  <a data-cy="home-btn" href="/" aria-label="/">
    <button
      type="button"
      aria-label="/"
      class={twMerge(
        "p-2",
        currentPath === "/" ? "bg-base-5 rounded-full" : ""
      )}
    >
      <img
        class="rounded-full w-7"
        src="https://avatars.githubusercontent.com/u/77146709?v=4"
        alt="Github Profile"
        loading="lazy"
      />
    </button>
  </a>
  {#each navList as item}
    {@const Icon = item.icon}
    <a
      data-cy={`${item.path.slice(1)}-btn`}
      href={item.path}
      aria-label={item.path}
    >
      <button
        type="button"
        aria-label={item.path}
        class={twMerge(
          "p-2",
          currentPath.includes(item.path) ? "bg-base-5 rounded-full" : ""
        )}
      >
        <Icon
          size={23}
          class={twMerge(
            "font-bold border-base-5",
            currentPath.includes(item.path) ? "text-base-0" : "text-base-5"
          )}
        />
      </button>
    </a>
  {/each}
</nav>
