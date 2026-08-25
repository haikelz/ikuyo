# Exec Plan

## Goal

Restore Cloudflare Pages builds by selecting a Node.js release supported by
Astro 6.

## Scope

In scope:

- Declare Node.js 22.16.0 at the repository root.
- Document and locally validate the deployment runtime contract.

Out of scope:

- Triggering or changing a Cloudflare deployment.
- Expanding Git history in the Cloudflare checkout.
- Refactoring the existing build command.

## Risk Classification

Risk flags:

- External systems.
- Existing deployment behavior.
- Weak local proof of Cloudflare runtime selection.

Hard gates:

- External platform behavior.

## Work Phases

1. Confirm the failing runtime and Astro requirement.
2. Confirm Cloudflare's repository runtime-selection mechanism.
3. Add the version declaration and durable contract.
4. Run the existing production build locally.
5. Record proof without triggering a deployment.

## Stop Conditions

Pause for human confirmation if the fix requires editing Cloudflare dashboard
state, triggering a deployment, or changing the existing Bun/Moon workflow.
