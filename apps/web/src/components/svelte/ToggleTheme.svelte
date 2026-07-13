<script>
import { Button } from "@ikuyo/ui";
import { Moon, Sun } from "lucide-svelte";
import { onMount } from "svelte";

let theme = "system";
let isDark = false;

function setTheme(newTheme) {
  theme = newTheme;

  if (
    theme === "dark" ||
    (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches)
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
    variant="outline"
    size="icon-sm"
    class="text-muted-foreground hover:text-foreground transition-colors rounded-md"
    aria-label="Toggle theme"
  >
    {#if isDark}
      <Sun size={20} />
    {:else}
      <Moon size={20} />
    {/if}
  </Button>
</div>
