<script lang="ts">
	import type { Snippet } from "svelte";
	import { Dialog, type WithoutChild } from "bits-ui";
	import { cn } from "$lib/utils";
	import type { ClassNameValue } from "tailwind-merge";
 
	type Props = Dialog.RootProps & {
		title: Snippet;
		close?: Snippet;
		description?: Snippet;
		class?: ClassNameValue;
		contentProps?: WithoutChild<Dialog.ContentProps>;
	};
 
	let {
		open = $bindable(false),
		children,
		contentProps,
		title,
		close,
		class: className,
		description,
		...restProps
	}: Props = $props();
</script>
 
<Dialog.Root bind:open {...restProps}>
	<Dialog.Portal>
		<Dialog.Overlay class="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=open]:fixed inset-0 z-50 bg-black/75"/>

		<Dialog.Content
			class={cn("fixed flex flex-col p-6 z-50 rounded-md bg-primary-muted data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 w-full max-w-[calc(100%-2rem)] lg:max-w-4xl left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]", className)}
			{...contentProps}
		>
			<Dialog.Title class="flex justify-between items-start text-xl font-bold">
				{@render title()}

				{#if close}
					<Dialog.Close>
						{@render close()}
					</Dialog.Close>
				{/if}
			</Dialog.Title>
			
			<Dialog.Description>
				{@render description?.()}
			</Dialog.Description>

			{@render children?.()}
		</Dialog.Content>
	</Dialog.Portal>
</Dialog.Root>