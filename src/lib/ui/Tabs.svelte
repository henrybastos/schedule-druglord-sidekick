<script lang="ts">
   import { cn } from "$lib/utils";
   import { Tabs } from "bits-ui";
   import type { Component, Snippet } from "svelte";
   import type { ClassValue } from "tailwind-variants";

   export type Trigger = {
      value: string;
      label: string;
   }

   type Props = {
      defaultTab: string;
      triggers: Trigger[];
      content: Snippet<[{ TabContent: Component<Tabs.ContentProps> }]>;
      class?: ClassValue;
   }

   let { defaultTab, triggers, content, class: className }: Props = $props();
 </script>
  
<Tabs.Root value={defaultTab} class={cn("flex flex-col gap-3 w-full", className)}>
   <Tabs.List class="inline-flex text-nowrap gap-x-1 rounded-md border-2 border-primary p-1 w-full">
      {#each triggers as trigger}
         <Tabs.Trigger
            value={trigger.value}
            class="data-[state=active]:bg-secondary bg-transparent data-[state=active]:text-primary text-secondary h-8 w-full px-3 rounded-sm font-medium cursor-pointer"
         >
            { trigger.label }
         </Tabs.Trigger>
      {/each}
   </Tabs.List>

   {@render content({ TabContent: Tabs.Content })}
</Tabs.Root>