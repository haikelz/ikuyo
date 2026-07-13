<script lang="ts">
  import type { GuestbookProps } from "@/types";
  import { onMount } from "svelte";
  import { Button, Card, CardContent, Dialog, DialogContent, DialogHeader, DialogTitle, Input, Textarea } from "@ikuyo/ui";

  let { apiUrl }: { apiUrl: string } = $props();

  let messages = $state<GuestbookProps[]>([]);
  let loading = $state(true);
  let error = $state<string | null>(null);
  let deletingId = $state<number | null>(null);

  // Create form
  let open = $state(false);
  let message = $state("");
  let username = $state("");
  let submitting = $state(false);
  let formError = $state<string | null>(null);

  async function fetchMessages() {
    loading = true;
    error = null;
    try {
      const res = await fetch(`${apiUrl}/api/v1/guestbook`);
      if (!res.ok) throw new Error();
      const json = await res.json() as { data: GuestbookProps[] };
      messages = json.data.sort(
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
      const res = await fetch(`${apiUrl}/api/v1/guestbook`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim(), message: message.trim() }),
      });
      if (!res.ok) throw new Error();
      message = "";
      username = "";
      open = false;
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
      const res = await fetch(`${apiUrl}/api/v1/guestbook/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      messages = messages.filter((m) => m.id !== id);
    } catch {
      // silently fail
    } finally {
      deletingId = null;
    }
  }

  onMount(fetchMessages);
</script>

<div class="mb-6">
  <Button variant="outline" class="rounded-none" onclick={() => (open = true)}>
    Write a message
  </Button>
</div>

<Dialog bind:open>
  <DialogContent class="rounded-none border-border/70 bg-background sm:max-w-md">
    <DialogHeader>
      <DialogTitle class="text-lg font-medium tracking-tight text-foreground">Write a Message</DialogTitle>
    </DialogHeader>

    <form onsubmit={handleCreate} class="space-y-4 mt-4">
      <div class="space-y-2">
        <label for="username" class="text-sm font-medium text-foreground">Name</label>
        <Input
          id="username"
          bind:value={username}
          maxlength={50}
          required
          placeholder="Your name"
          class="rounded-none border-border/70 bg-transparent text-foreground placeholder:text-muted-foreground"
        />
      </div>
      <div class="space-y-2">
        <label for="msg" class="text-sm font-medium text-foreground">Message</label>
        <Textarea
          id="msg"
          bind:value={message}
          maxlength={500}
          rows={4}
          required
          placeholder="Write your message..."
          class="rounded-none border-border/70 bg-transparent text-foreground placeholder:text-muted-foreground"
        />
        <p class="text-xs text-muted-foreground">{message.length}/500</p>
      </div>

      {#if formError}
        <p class="text-sm text-muted-foreground">{formError}</p>
      {/if}

      <div class="flex justify-end gap-3 pt-2">
        <Button type="button" variant="ghost" class="rounded-none" onclick={() => (open = false)}>
          Cancel
        </Button>
        <Button
          type="submit"
          variant="outline"
          class="rounded-none"
          disabled={submitting || !message.trim() || !username.trim()}
        >
          {submitting ? "Sending..." : "Send"}
        </Button>
      </div>
    </form>
  </DialogContent>
</Dialog>

{#if loading}
  <p class="text-muted-foreground">Loading messages...</p>
{:else if error}
  <p class="text-muted-foreground">{error}</p>
{:else if messages.length === 0}
  <p class="text-muted-foreground">No messages yet. Be the first!</p>
{:else}
  {#each messages as item (item.id)}
    <Card class="group rounded-none border-border/70 bg-transparent mb-4 hover:border-border/80 transition-colors">
      <CardContent class="p-6 sm:p-8">
        <h3 class="mb-0 mt-0 text-xl sm:text-2xl font-medium tracking-tight text-foreground">
          {item.message}
        </h3>
        <div class="flex items-center justify-between mt-3 sm:mt-4">
          <p class="mb-0 text-sm sm:text-base text-muted-foreground">
            <span class="font-medium text-foreground">{item.username}</span>
          </p>
          <Button
            variant="ghost"
            size="sm"
            class="rounded-none opacity-0 group-hover:opacity-100 transition-opacity text-xs text-muted-foreground hover:text-foreground"
            onclick={() => handleDelete(item.id)}
            disabled={deletingId === item.id}
          >
            {deletingId === item.id ? "..." : "Delete"}
          </Button>
        </div>
      </CardContent>
    </Card>
  {/each}
{/if}
