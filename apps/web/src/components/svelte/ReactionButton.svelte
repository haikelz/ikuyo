<script lang="ts">
import { Button } from "@ikuyo/ui";
import { Heart } from "lucide-svelte";
import { onMount } from "svelte";
import { api } from "@/configs/ky";

let { slug, apiUrl } = $props<{ slug: string; apiUrl: string }>();

const storageKey = `reaction:${slug}`;

let love = $state(0);
let loading = $state(false);
let reacted = $state(readReacted());

function readReacted() {
  try {
    return localStorage.getItem(storageKey) === "1";
  } catch {
    return false;
  }
}

function writeReacted(value: boolean) {
  try {
    if (value) localStorage.setItem(storageKey, "1");
    else localStorage.removeItem(storageKey);
  } catch {}
}

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
    const action = reacted ? "remove" : "add";
    const { data } = await api
      .post(`${apiUrl}/api/v1/reactions/${slug}/${action}`)
      .json<{ data: { slug: string; love: number } }>();
    love = data.love;
    reacted = !reacted;
    writeReacted(reacted);
  } catch {
  } finally {
    loading = false;
  }
}

onMount(fetchReactions);
</script>

<div class="flex flex-col items-center gap-2">
  <Button
    variant="outline"
    disabled={loading}
    aria-pressed={reacted}
    aria-label={reacted ? "Unlike" : "Like this post"}
    onclick={toggleReaction}
    class={reacted ? "text-primary hover:text-primary" : "text-muted-foreground"}
  >
    <Heart fill={reacted ? "currentColor" : "none"} strokeWidth={1.5} />
    <span class="tabular-nums">{love}</span>
  </Button>
  <span class="text-xs text-muted-foreground">
    {reacted ? "You loved this" : "Loved this post?"}
  </span>
</div>
