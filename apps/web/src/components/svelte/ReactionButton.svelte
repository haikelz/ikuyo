<script lang="ts">
  import { Heart } from "lucide-svelte";
  import { api } from "@/configs/ky";
  import { onMount } from "svelte";

  export let slug: string;
  export let apiUrl: string;

  let love = 0;
  let loading = false;
  let reacted = localStorage.getItem(`reaction:${slug}`) === "1";

  async function fetchReactions() {
    try {
      const { data } = await api
        .get(`${apiUrl}/api/v1/reactions`)
        .json<{ data: { slug: string; love: number }[] }>();
      const found = data.find((r) => r.slug === slug);
      if (found) love = found.love;
    } catch {}
  }

  async function toggleReaction() {
    if (loading) return;
    loading = true;
    try {
      if (reacted) {
        const { data } = await api
          .post(`${apiUrl}/api/v1/reactions/${slug}/remove`)
          .json<{ data: { slug: string; love: number } }>();
        love = data.love;
        reacted = false;
        localStorage.removeItem(`reaction:${slug}`);
      } else {
        const { data } = await api
          .post(`${apiUrl}/api/v1/reactions/${slug}/add`)
          .json<{ data: { slug: string; love: number } }>();
        love = data.love;
        reacted = true;
        localStorage.setItem(`reaction:${slug}`, "1");
      }
    } catch {} finally {
      loading = false;
    }
  }

  onMount(fetchReactions);
</script>

<div class="flex flex-col items-center gap-2 py-4">
  <button
    on:click={toggleReaction}
    disabled={loading}
    class="group flex items-center gap-2 px-4 py-2 rounded-full border border-border/60 hover:border-red-400/50 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all disabled:opacity-50"
    aria-label={reacted ? "Unlike" : "Like this post"}
  >
    <Heart
      class="h-5 w-5 transition-all duration-200 {reacted ? 'text-red-500 fill-red-500 scale-110' : 'text-muted-foreground group-hover:text-red-400'}"
      fill={reacted ? "currentColor" : "none"}
      strokeWidth={1.5}
    />
    <span class="text-sm font-medium tabular-nums {reacted ? 'text-red-500' : 'text-muted-foreground group-hover:text-red-400'}">
      {love || 0}
    </span>
  </button>
  <span class="text-xs text-muted-foreground">
    {reacted ? "You loved this" : "Loved this post?"}
  </span>
</div>
