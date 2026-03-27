<script lang="ts">
import { onMount } from "svelte";

onMount(() => {
  function handleCopyClick(e: MouseEvent) {
    const target = e.target as HTMLElement;
    const button = target.closest("[data-copy-button]");
    if (!button) return;

    const wrapper = button.closest(".code-block-wrapper");
    if (!wrapper) return;

    const codeEl = wrapper.querySelector("pre code");
    if (!codeEl) return;

    const text = codeEl.textContent ?? "";
    navigator.clipboard.writeText(text).then(() => {
      const originalHtml = button.innerHTML;
      button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
      button.setAttribute("aria-label", "Copied!");
      setTimeout(() => {
        button.innerHTML = originalHtml;
        button.setAttribute("aria-label", "Copy code");
      }, 2000);
    });
  }

  document.addEventListener("click", handleCopyClick);

  return () => {
    document.removeEventListener("click", handleCopyClick);
  };
});
</script>

<div style="display: none" aria-hidden="true" />
