<script lang="ts">
	import type { Snippet } from "svelte";
	import { DropdownMenu, type WithoutChild } from "bits-ui";

   type Item = {
      label: string;
      onclick: () => void | Promise<void>;
      danger?: boolean;
   }
 
	type Props = DropdownMenu.RootProps & {
		items: Item[];
		contentProps?: WithoutChild<DropdownMenu.ContentProps>;
      trigger?: Snippet;
		// other component props if needed
	};
 
	let {
		open = $bindable(false),
      trigger,
		children,
		items,
		contentProps,
		...restProps
	}: Props = $props();
</script>
 
<DropdownMenu.Root bind:open {...restProps}>
   {#if trigger}     
      <DropdownMenu.Trigger>
         {@render trigger()}
      </DropdownMenu.Trigger>
   {/if}

	<DropdownMenu.Portal>
		<DropdownMenu.Content 
         class="bg-primary-muted outline-hidden focus-visible:outline-hidden w-[229px] rounded-md border-2 border-primary p-1.5 data-[state=open]:animate-in data-[state=open]:slide-in-from-top-3 data-[state=open]:fade-in-5 data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:slide-out-to-top-3 data-[state=closed]:fade-out-5 data-[state=closed]:zoom-out-95"
         align="end"
         sideOffset={14}
         {...contentProps}
      >
         {#each items as item}
            <DropdownMenu.Item 
               data-danger={item?.danger != undefined}
               class="flex h-10 rounded-sm data-highlighted:bg-primary-subtle cursor-pointer select-none items-center p-3 text-secondary font-medium focus-visible:outline-none data-[danger=true]:bg-red-900/50 data-[danger=true]:hover:bg-red-900 transition-all"
               onclick={item.onclick}
               textValue={item.label}
            >
               {item.label}
            </DropdownMenu.Item>
         {/each}
		</DropdownMenu.Content>
	</DropdownMenu.Portal>
</DropdownMenu.Root>