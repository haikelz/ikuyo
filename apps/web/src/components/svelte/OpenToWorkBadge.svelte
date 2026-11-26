<script lang="ts">
import {
  badgeVariants,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@ikuyo/ui";

const jobPreferences = [
  "Fullstack Developer",
  "Backend Developer",
  "Frontend Developer",
  "Devops Engineer",
  "Software Engineer",
  "AI Engineer",
];
const techStack = [
  "Next JS",
  "Javascript",
  "Typescript",
  "Golang",
  "Echo",
  "Fiber",
  "Gorm",
  "PostgreSQL",
  "MySQL",
  "Node JS",
  "Express JS",
  "Nest JS",
  "Hono JS",
  "Astro",
  "Svelte",
  "React",
  "CI/CD",
  "Docker",
  "Linux",
  "Kubernetes",
];
</script>

<Dialog>
  <DialogTrigger
    data-cy="open-to-work-badge"
    aria-label="Open job preferences"
    class={badgeVariants({ variant: "outline", class: "h-8 cursor-pointer border-border bg-card px-3 text-xs font-medium text-foreground shadow-xs hover:bg-accent focus-visible:ring-0" })}
  >
    <span class="size-1.5 rounded-full bg-success-foreground" aria-hidden="true"></span>
    #opentowork
  </DialogTrigger>
  <DialogContent data-cy="job-preferences-dialog" class="max-h-[calc(100dvh-2rem)] grid-rows-[auto_minmax(0,1fr)] gap-6 rounded-lg border border-border bg-popover p-5 shadow-panel sm:max-w-lg sm:p-6">
    <DialogHeader class="pr-10">
      <DialogTitle class="text-lg leading-tight">Open to work</DialogTitle>
      <DialogDescription>My preferred roles and the technologies I work with.</DialogDescription>
    </DialogHeader>
    <div data-cy="job-preferences-body" class="min-h-0 space-y-6 overflow-y-auto overscroll-contain">
      <section aria-labelledby="preferred-roles-title">
        <h2 id="preferred-roles-title" class="mb-3 font-sans text-xs text-muted-foreground font-medium">Job preferences</h2>
        <ul class="flex flex-wrap gap-2">
          {#each jobPreferences as role}
            <li class="rounded-md bg-secondary px-2.5 py-0.5 text-xs font-medium leading-5 text-foreground">{role}</li>
          {/each}
        </ul>
      </section>
      <section aria-labelledby="tech-stack-title">
        <h2 id="tech-stack-title" class="mb-3 font-sans text-xs text-muted-foreground font-medium">Tech stack</h2>
        <ul class="flex flex-wrap gap-2">
          {#each techStack as technology}
            <li class="rounded-md bg-secondary px-2.5 py-0.5 text-xs font-medium leading-5 text-foreground">{technology}</li>
          {/each}
        </ul>
      </section>
    </div>
  </DialogContent>
</Dialog>
