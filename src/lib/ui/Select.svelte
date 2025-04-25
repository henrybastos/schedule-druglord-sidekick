<script lang="ts">
   import { cn } from "$lib/utils";
	import { Select, type WithoutChildren } from "bits-ui";

	export type SelectOption = { 
		value: string; 
		label: string; 
		group?: string; 
		disabled?: boolean;
	}
 
	type Props = WithoutChildren<Select.RootProps> & {
		placeholder?: string;
		options: SelectOption[];
		contentProps?: WithoutChildren<Select.ContentProps>;
		class?: string;
		// any other specific component props if needed
	};
 
	let { value = $bindable(), options = $bindable(), contentProps, placeholder, class: className, ...restProps }: Props = $props();
 
	const selectedLabel = $derived(options.find((item) => item.value === value)?.label);
</script>
 
<!--
TypeScript Discriminated Unions + destructing (required for "bindable") do not
get along, so we shut typescript up by casting `value` to `never`, however,
from the perspective of the consumer of this component, it will be typed appropriately.
-->
<Select.Root bind:value={value as never} {...restProps}>
	<Select.Trigger class={cn("input-md select-none capitalize", className)}>
		{selectedLabel ? selectedLabel : placeholder}
      <i class="flex size-4.5 text-secondary icon-[tabler--chevron-down]"></i>
	</Select.Trigger>

	<Select.Portal>
		<Select.Content class="focus-override border-input-muted shadow-popover data-[state=open]:animate-pop-in data-[state=closed]:animate-pop-out select-side-animation select-side-translate outline-hidden z-50 max-h-[calc(var(--bits-select-content-available-height)-1rem)] w-[var(--bits-select-anchor-width)] min-w-[var(--bits-select-anchor-width)] select-none rounded-sm bg-primary-dark" {...contentProps}>
			<Select.ScrollUpButton class="flex w-full items-center justify-center py-1">
            <i class="flex size-4.5 text-secondary icon-[tabler--chevron-up]"></i>
         </Select.ScrollUpButton>

			<Select.Viewport>
				{#if options.some(o => o?.group)}
					{#each Array.from(new Set(options.map(o => o?.group))) as group (group)}
						<Select.Group>
							<Select.GroupHeading class="inline-flex items-center uppercase text-xs font-medium text-subtle py-1">
								<span class="bg-primary-dark px-3">{ group ?? 'Ungrouped' }</span>
								<span class="flex w-[var(--bits-select-content-available-width)] h-[2px] bg-primary-subtle"></span>
							</Select.GroupHeading>

							{#each options.filter(o => o.group == group) as option (option.value)}	
								<Select.Item value={option.value} label={option.label} disabled={option.disabled} class="outline-hidden data-disabled:opacity-50 flex h-input-md w-full select-none items-center p-3 text-sm cursor-pointer data-highlighted:bg-primary-muted data-highlighted:data-disabled:bg-transparent data-highlighted:data-disabled:cursor-not-allowed transition-all rounded-sm capitalize">
									{#snippet children({ selected })}
										{option.label}
									
										{#if selected}
											<div class="ml-auto">
												<i class="flex size-4.5 text-secondary icon-[tabler--check]"></i>
											</div>
										{/if}
									{/snippet}
								</Select.Item>
							{/each}
						</Select.Group>
					{/each}
				{:else}
					{#each options as option (option.value)}	
						<Select.Item value={option.value} label={option.label} disabled={option.disabled} class="outline-hidden data-disabled:opacity-50 flex h-input-md w-full select-none items-center p-3 text-sm cursor-pointer data-highlighted:bg-primary-muted data-highlighted:data-disabled:bg-transparent data-highlighted:data-disabled:cursor-not-allowed transition-all rounded-sm capitalize">
							{#snippet children({ selected })}
								{option.label}
							
								{#if selected}
									<div class="ml-auto">
										<i class="ti ti-check text-secondary text-xl"></i>
									</div>
								{/if}
							{/snippet}
						</Select.Item>
					{/each}
				{/if}
			</Select.Viewport>

         <Select.ScrollDownButton class="flex w-full items-center justify-center py-1">
            <i class="flex size-4.5 text-secondary icon-[tabler--chevron-down]"></i>
         </Select.ScrollDownButton>
		</Select.Content>
	</Select.Portal>
</Select.Root>