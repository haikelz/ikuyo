<script lang="ts">
  import { api } from "@/configs/ky";
  import type { GuestbookProps } from "@/types";
  import { BACKEND_API_URL } from "@/utils/env";
  import { onMount } from "svelte";

  let messages = $state<GuestbookProps[]>([]);
  let loading = $state(true);
  let error = $state<string | null>(null);
  let deletingId = $state<number | null>(null);

  // Create form
  let showForm = $state(false);
  let message = $state("");
  let username = $state("");
  let submitting = $state(false);
  let formError = $state<string | null>(null);

  async function fetchMessages() {
    loading = true;
    error = null;
    try {
      const response = await api
        .get(`${BACKEND_API_URL}/api/v1/guestbook`)
        .json<{ data: GuestbookProps[] }>();
      messages = response.data.sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    } catch (err) {
      error = "Failed to load messages.";
    } finally {
      loading = false;
    }
  }

  async function handleCreate(e: SubmitEvent) {
    e.preventDefault();
    if (!message.trim() || !username.trim()) return;

    submitting = true;
    formError = null;
    try {
      await api.post(`${BACKEND_API_URL}/api/v1/guestbook`, {
        json: { username: username.trim(), message: message.trim() },
      });
      message = "";
      username = "";
      showForm = false;
      await fetchMessages();
    } catch (err) {
      formError = "Failed to send message. Try again.";
    } finally {
      submitting = false;
    }
  }

  async function handleDelete(id: number) {
    deletingId = id;
    try {
      await api.delete(`${BACKEND_API_URL}/api/v1/guestbook/${id}`);
      messages = messages.filter((m) => m.id !== id);
    } catch {
      // silently fail
    } finally {
      deletingId = null;
    }
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === "Escape") showForm = false;
  }

  onMount(fetchMessages);
</script>

<svelte:window onkeydown={handleKeydown} />

<!-- Create message trigger -->
<div class="mb-6">
  <button
    class="text-sm font-medium text-foreground border border-border/70 bg-transparent px-4 py-2 rounded-none hover:border-border transition-colors"
    onclick={() => (showForm = true)}
  >
    Write a message
  </button>
</div>

<!-- Create form modal -->
{#if showForm}
  <!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
  <div
    class="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-black/50"
    role="dialog"
    aria-modal="true"
    aria-label="Write a guestbook message"
    onclick={(e) => e.target === e.currentTarget && (showForm = false)}
  >
    <form
      onsubmit={handleCreate}
      class="w-full max-w-md rounded-none border border-border/70 bg-background p-6"
    >
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-medium tracking-tight text-foreground">Write a Message</h3>
        <button
          type="button"
          class="text-muted-foreground hover:text-foreground transition-colors"
          onclick={() => (showForm = false)}
          aria-label="Close"
        >&#x2715;</button>
      </div>

      <div class="space-y-4">
        <div>
          <label for="username" class="block text-sm font-medium text-foreground mb-1">Name</label>
          <input
            id="username"
            type="text"
            bind:value={username}
            maxlength="50"
            required
            class="w-full text-sm text-foreground bg-transparent border border-border/70 rounded-none px-3 py-2 outline-none focus:border-border"
            placeholder="Your name"
          />
        </div>
        <div>
          <label for="message" class="block text-sm font-medium text-foreground mb-1">Message</label>
          <textarea
            id="message"
            bind:value={message}
            maxlength="500"
            rows="4"
            required
            class="w-full text-sm text-foreground bg-transparent border border-border/70 rounded-none px-3 py-2 outline-none focus:border-border resize-none"
            placeholder="Write your message..."
          ></textarea>
          <p class="text-xs text-muted-foreground mt-1">{message.length}/500</p>
        </div>
      </div>

      {#if formError}
        <p class="text-sm text-muted-foreground mt-3">{formError}</p>
      {/if}

      <div class="flex justify-end gap-3 mt-6">
        <button
          type="button"
          class="text-sm text-muted-foreground hover:text-foreground transition-colors px-4 py-2"
          onclick={() => (showForm = false)}
        >
          Cancel
        </button>
        <button
          type="submit"
          class="text-sm font-medium text-foreground border border-border/70 bg-transparent px-4 py-2 rounded-none hover:border-border transition-colors disabled:opacity-50"
          disabled={submitting || !message.trim() || !username.trim()}
        >
          {submitting ? "Sending..." : "Send"}
        </button>
      </div>
    </form>
  </div>
{/if}

<!-- Messages -->
{#if loading}
  <p class="text-muted-foreground">Loading messages...</p>
{:else if error}
  <p class="text-muted-foreground">{error}</p>
{:else if messages.length === 0}
  <p class="text-muted-foreground">No messages yet. Be the first!</p>
{:else}
  {#each messages as item (item.id)}
    <div class="group relative p-6 sm:p-8 w-full rounded-none bg-transparent border border-border/70 hover:border-border/80 transition-colors">
      <h3 class="mb-0 mt-0 text-xl sm:text-2xl font-medium tracking-tight text-foreground">
        {item.message}
      </h3>
      <div class="flex items-center justify-between mt-3 sm:mt-4">
        <p class="mb-0 text-sm sm:text-base text-muted-foreground">
          <span class="font-medium text-foreground">{item.username}</span>
        </p>
        <button
          class="text-xs text-muted-foreground hover:text-foreground transition-colors opacity-0 group-hover:opacity-100"
          onclick={() => handleDelete(item.id)}
          disabled={deletingId === item.id}
          aria-label="Delete message"
        >
          {deletingId === item.id ? "..." : "Delete"}
        </button>
      </div>
    </div>
  {/each}
{/if}
