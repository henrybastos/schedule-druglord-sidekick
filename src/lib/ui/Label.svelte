<script lang="ts">
   import type { Snippet } from "svelte";
   import { Label } from "bits-ui";
   import { cn } from "$lib/utils";

   interface Props {
      children: Snippet;
      id?: string;
      for?: string;
      class?: string;
   }

   let { children, id, for: forName, class: className }: Props = $props();
 </script>
  
<Label.Root {id} for={forName} class={cn("font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70", className)}>
  {@render children?.()}
</Label.Root>