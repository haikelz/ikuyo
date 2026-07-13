<script lang="ts">
  import { api } from "@/configs/ky";
  import type { GuestbookProps } from "@/types";
  import { BACKEND_API_URL } from "@/utils/env";
  import { format } from "date-fns";
  import { onMount } from "svelte";

  let messages = $state<GuestbookProps[]>([]);
  let loading = $state(true);
  let error = $state<string | null>(null);

  onMount(async () => {
    try {
      const response = await api
        .get(`${BACKEND_API_URL}/api/v1/guestbook`)
        .json<{ data: GuestbookProps[] }>();
      messages = response.data.sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    } catch (err) {
      error = (err as Error).message;
    } finally {
      loading = false;
    }
  });
</script>

{#if loading}
  <p class="text-muted-foreground">Loading messages...</p>
{:else if error}
  <p class="text-muted-foreground">Failed to load messages.</p>
{:else if messages.length === 0}
  <p class="text-muted-foreground">There is no message right now!</p>
{:else}
  {#each messages as item (item.id)}
    <div class="group relative p-6 sm:p-8 w-full rounded-none bg-transparent border border-border/70 hover:border-border/80 transition-colors">
      <h3 class="mb-0 mt-0 text-xl sm:text-2xl font-medium tracking-tight text-foreground">
        {item.message}
      </h3>
      <p class="mb-0 mt-3 sm:mt-4 text-sm sm:text-base text-muted-foreground">
        <span class="font-medium text-foreground">{item.username}</span>
        {" "} - {format(item.created_at, "MMMM d, yyyy")}
      </p>
    </div>
  {/each}
{/if}
