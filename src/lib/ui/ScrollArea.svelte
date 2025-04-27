<script lang="ts">
   import { cn } from "$lib/utils";
	import { ScrollArea, type WithoutChild } from "bits-ui";
   import type { ClassNameValue } from "tailwind-merge";
 
	type Props = WithoutChild<ScrollArea.RootProps> & {
		orientation?: "vertical" | "horizontal" | "both";
		class?: ClassNameValue;
	};
 
	let {
		ref = $bindable(null),
		orientation = "vertical",
		class: className,
		children,
		...restProps
	}: Props = $props();
</script>
 
{#snippet Scrollbar({ orientation }: { orientation: "vertical" | "horizontal" })}
	<ScrollArea.Scrollbar 
      {orientation}
      class="bg-primary-dark hover:bg-dark-10 data-[state=visible]:animate-in data-[state=hidden]:animate-out data-[state=hidden]:fade-out-0 data-[state=visible]:fade-in-0 flex w-2.5 touch-none select-none rounded-full border-l border-l-transparent p-px transition-all duration-200 hover:w-3"
   >
		<ScrollArea.Thumb class="bg-primary-subtle flex-1 rounded-full"/>
	</ScrollArea.Scrollbar>
{/snippet}
 
<ScrollArea.Root class="relative overflow-hidden rounded-md" bind:ref {...restProps}>
	<ScrollArea.Viewport class={cn("h-full w-full", className)}>
		{@render children?.()}
	</ScrollArea.Viewport>
	
	{#if orientation === "vertical" || orientation === "both"}
		{@render Scrollbar({ orientation: "vertical" })}
	{/if}
	{#if orientation === "horizontal" || orientation === "both"}
		{@render Scrollbar({ orientation: "horizontal" })}
	{/if}
	<ScrollArea.Corner />
</ScrollArea.Root>