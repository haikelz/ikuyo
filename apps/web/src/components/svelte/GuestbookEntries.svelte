<script lang="ts">
  import { api } from "@/configs/ky";
  import { hideProfanity } from "@/helpers/profanity";
  import type { GuestbookProps } from "@/types";
  import { format } from "date-fns";
  import { onMount } from "svelte";

  let { backendApiUrl }: { backendApiUrl: string } = $props();
  let entries = $state<GuestbookProps[]>([]);
  let loading = $state(true);
  let error = $state(false);
  let fetching = false;

  async function loadEntries() {
    if (fetching) return;
    fetching = true;
    try {
      if (!backendApiUrl) throw new Error("Missing backend API URL");
      const response = await api
        .get(`${backendApiUrl}/api/v1/guestbook`, { cache: "no-store" })
        .json<{ data: GuestbookProps[] }>();
      entries = response.data
        .map((entry) => ({ ...entry, message: hideProfanity(entry.message) }))
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      error = false;
    } catch {
      error = true;
    } finally {
      loading = false;
      fetching = false;
    }
  }

  onMount(() => {
    void loadEntries();
    const interval = window.setInterval(() => {
      if (!document.hidden) void loadEntries();
    }, 30_000);
    const onVisibilityChange = () => {
      if (!document.hidden) void loadEntries();
    };
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  });
</script>

{#if loading}
  <p role="status" class="font-medium text-muted-foreground">Loading messages…</p>
{:else if error && entries.length === 0}
  <p role="alert" class="font-medium text-muted-foreground">Could not load messages. Please try again later.</p>
{:else}
  {#if error}
    <p role="status" class="mb-4 text-sm text-muted-foreground">Could not refresh messages. Showing the last loaded entries.</p>
  {/if}
  {#if entries.length === 0}
    <p class="font-medium text-muted-foreground">There is no message right now!</p>
  {:else}
    <div class="w-full border-b border-border/70">
      {#each entries as item (item.id)}
        <article
          data-cy="guestbook-row"
          class="grid gap-3 border-t border-border/70 py-6 sm:grid-cols-[8rem_1fr_auto] sm:items-baseline sm:gap-6"
        >
          <time
            datetime={new Date(item.created_at).toISOString()}
            class="font-mono text-xs tabular-nums text-muted-foreground"
          >
            {format(item.created_at, "yyyy.MM.dd")}
          </time>
          <h3 class="m-0 text-lg font-semibold leading-7 tracking-tight text-foreground text-pretty">
            {item.message}
          </h3>
          <p class="m-0 text-sm font-medium text-muted-foreground">{item.username}</p>
        </article>
      {/each}
    </div>
  {/if}
{/if}
