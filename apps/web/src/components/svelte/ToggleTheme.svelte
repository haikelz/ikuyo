<script>
  import { Moon, Sun } from "lucide-svelte";
  import { onMount } from "svelte";
  import { twMerge } from "tailwind-merge";

  let theme = "system";
  let isDark = false;

  // Function to update theme based on selection
  function setTheme(newTheme) {
    theme = newTheme;

    if (
      theme === "dark" ||
      (theme === "system" &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      document.documentElement.classList.add("dark");
      isDark = true;
    } else {
      document.documentElement.classList.remove("dark");
      isDark = false;
    }

    // Save theme preference to localStorage
    localStorage.setItem("theme", theme);
  }

  // Function to toggle between light and dark
  function toggleTheme() {
    const newTheme = isDark ? "light" : "dark";
    setTheme(newTheme);
  }

  // Initialize theme on component mount
  onMount(() => {
    // Check if user has a saved preference
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme) {
      theme = savedTheme;
    }

    // Set initial theme
    setTheme(theme);

    // Add event listener for system theme changes
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = () => {
      if (theme === "system") {
        setTheme("system");
      }
    };

    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  });
</script>

<div class="flex items-center space-x-2">
  <button
    on:click={toggleTheme}
    class="p-1.5 rounded-full bg-monochrome-3 dark:bg-neutral-900"
    aria-label="Toggle theme"
  >
    {#if isDark}
      <Sun class={twMerge("font-bold dark:text-monochrome-1")} size={21} />
    {:else}
      <Moon class={twMerge("font-bold dark:text-monochrome-1")} size={21} />
    {/if}
  </button>
</div>
