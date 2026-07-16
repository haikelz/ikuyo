<script lang="ts">
import { Select, SelectContent, SelectItem, SelectTrigger } from "@ikuyo/ui";
import { LaptopMinimal, Moon, Sun } from "lucide-svelte";
import { onMount } from "svelte";

type Theme = "light" | "dark" | "system";

let theme: Theme = "system";
let mounted = false;

function applyTheme(newTheme: Theme) {
  theme = newTheme;

  if (
    theme === "dark" ||
    (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches)
  ) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }

  localStorage.setItem("theme", theme);
}

onMount(() => {
  const savedTheme = localStorage.getItem("theme");

  if (savedTheme === "light" || savedTheme === "dark" || savedTheme === "system") {
    theme = savedTheme;
  }

  applyTheme(theme);

  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

  const handleChange = () => {
    if (theme === "system") {
      applyTheme("system");
    }
  };

  mounted = true;

  mediaQuery.addEventListener("change", handleChange);

  return () => {
    mediaQuery.removeEventListener("change", handleChange);
  };
});

$: if (mounted) {
  applyTheme(theme);
}
</script>

<div class="flex items-center">
  <Select
    type="single"
    bind:value={theme}
  >
    <SelectTrigger
      class="w-auto border-border/70 bg-transparent px-2 text-foreground"
      aria-label="Theme mode"
      data-cy="theme-toggle"
    >
      {#if theme === "light"}
        <Sun size={16} />
      {:else if theme === "dark"}
        <Moon size={16} />
      {:else}
        <LaptopMinimal size={16} />
      {/if}
    </SelectTrigger>
    <SelectContent class="border-border/70 bg-background text-foreground">
      <SelectItem
      value="light"
      label="Light"
      aria-label="Use light theme"
      class="focus:bg-muted/50 data-[highlighted]:bg-muted/50"
      data-cy="theme-light"
    >
      <div class="flex items-center gap-2">
        <Sun size={16} />
        <span>Light</span>
      </div>
    </SelectItem>
    <SelectItem
      value="dark"
      label="Dark"
      aria-label="Use dark theme"
      class="focus:bg-muted/50 data-[highlighted]:bg-muted/50"
      data-cy="theme-dark"
    >
      <div class="flex items-center gap-2">
        <Moon size={16} />
        <span>Dark</span>
      </div>
    </SelectItem>
    <SelectItem
      value="system"
      label="System"
      aria-label="Use system theme"
      class="focus:bg-muted/50 data-[highlighted]:bg-muted/50"
      data-cy="theme-system"
    >
      <div class="flex items-center gap-2">
        <LaptopMinimal size={16} />
        <span>System</span>
      </div>
    </SelectItem>
  </SelectContent>
  </Select>
</div>
