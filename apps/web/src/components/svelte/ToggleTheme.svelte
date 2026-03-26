<script>
  import { Button } from "@/components/svelte/ui/button";
  import { Moon, Sun } from "lucide-svelte";
  import { onMount } from "svelte";

  let theme = "system";
  let isDark = false;

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

    localStorage.setItem("theme", theme);
  }

  function toggleTheme() {
    const newTheme = isDark ? "light" : "dark";
    setTheme(newTheme);
  }

  onMount(() => {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme) {
      theme = savedTheme;
    }

    setTheme(theme);

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
  <Button
    onclick={toggleTheme}
    variant="secondary"
    size="icon-sm"
    class="rounded-full"
    aria-label="Toggle theme"
  >
    {#if isDark}
      <Sun class="font-bold text-neutral-50" size={21} />
    {:else}
      <Moon class="font-bold text-neutral-50" size={21} />
    {/if}
  </Button>
</div>
