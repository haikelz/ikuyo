<script lang="ts">
import { onMount } from "svelte";

onMount(() => {
  document.documentElement.setAttribute("data-code-toolbar-ready", "true");
  const timers = new Set<ReturnType<typeof setTimeout>>();
  async function handleCopyClick(e: MouseEvent) {
    const target = e.target as HTMLElement;
    const button = target.closest<HTMLButtonElement>("[data-copy-button], [data-wrap-button], [data-expand-button]");
    if (!button) return;

    const wrapper = button.closest(".code-block-wrapper");
    if (!wrapper) return;

    const codeEl = wrapper.querySelector("pre code");
    if (!codeEl) return;

    if (button.hasAttribute("data-wrap-button")) {
      const wrapped = button.getAttribute("aria-pressed") !== "true";
      wrapper.setAttribute("data-wrap", String(wrapped));
      button.setAttribute("aria-pressed", String(wrapped));
      return;
    }
    if (button.hasAttribute("data-expand-button")) {
      const expanded = button.getAttribute("aria-expanded") !== "true";
      wrapper.querySelector(".code-block-content")?.setAttribute("data-collapsed", String(!expanded));
      button.setAttribute("aria-expanded", String(expanded));
      button.textContent = expanded ? "Collapse code" : "Show full code";
      return;
    }
    button.disabled = true;
    try {
      await navigator.clipboard.writeText(codeEl.textContent ?? "");
      button.textContent = "Copied!";
      button.setAttribute("aria-label", "Copied!");
    } catch {
      button.textContent = "Try again";
      button.setAttribute("aria-label", "Copy failed. Try again");
    }
    button.disabled = false;
    const timer = setTimeout(() => {
      button.textContent = "Copy";
      button.setAttribute("aria-label", "Copy code");
      timers.delete(timer);
    }, 2000);
    timers.add(timer);
  }

  document.addEventListener("click", handleCopyClick);

  return () => {
    document.removeEventListener("click", handleCopyClick);
    document.documentElement.removeAttribute("data-code-toolbar-ready");
    for (const timer of timers) clearTimeout(timer);
  };
});
</script>

<div style="display: none" aria-hidden="true"></div>
