<script lang="ts">
  import {
    AlbumIcon,
    HashIcon,
    ImagesIcon,
    ListIcon,
    NotepadTextIcon,
  } from "lucide-svelte";
  import { twMerge } from "tailwind-merge";

  let { currentPath = "" } = $props();

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

  let prevScrollPosition = $state(0);
  let isShow = $state(true);

  $effect(() => {
    function handleScroll() {
      const currentScrollPosition = window.scrollY;
      isShow =
        prevScrollPosition > currentScrollPosition ||
        currentScrollPosition < 60;

      prevScrollPosition = currentScrollPosition;
    }

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  });
</script>

<nav
  data-cy="bottom-nav"
  class={twMerge(
    "fixed flex justify-center items-center px-3 py-1.5 space-x-5",
    "w-fit border-[0.5px] mx-auto right-0 left-0 bottom-4 rounded-full",
    "bg-monochrome-1/70 transition-all backdrop-blur-md border-monochrome-3 z-50",
    isShow ? "translate-y-0 opacity-100" : "translate-y-full bottom-0 opacity-0"
  )}
>
  <a data-cy="home-btn" href="/" aria-label="/">
    <button
      type="button"
      aria-label="/"
      class={twMerge(
        "p-2",
        currentPath === "/" ? "bg-monochrome-3 rounded-full" : ""
      )}
    >
      <img
        class="rounded-full h-6 w-6 object-cover photos"
        draggable={false}
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
          "p-1.5",
          currentPath.includes(item.path) ? "bg-monochrome-3 rounded-full" : ""
        )}
      >
        <Icon
          size={21}
          class={twMerge(
            "font-bold",
            currentPath.includes(item.path) ? "text-base-0" : "text-base-0"
          )}
        />
      </button>
    </a>
  {/each}
</nav>
