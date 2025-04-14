<script lang="ts">
   import { cn } from "$lib";
   import type { Snippet } from "svelte";

   interface BadgeProps {
      children: Snippet;
      class?: string;
   }

   let { class: className, children }: BadgeProps = $props();
</script>

<span class={cn("badge", className)}>
   {@render children?.()}
</span>