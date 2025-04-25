<script lang="ts">
	import type { HTMLInputAttributes } from "svelte/elements";
	import { tv, type VariantProps } from "tailwind-variants";
	import { cn } from "$lib/utils";

	const variants = tv({
		base: "inline-flex items-center justify-between rounded-sm border-2 border-primary-light focus-visible-outline transition-all duration-75 data-[invalid=true]:border-red-500 text-secondary font-semibold [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-inner-outer-button]:appearance-none",
		variants: {
			size: {
				default: "h-10 px-3 gap-x-3 text-lg",
				sm: "h-9 px-2 gap-x-2 text-base",
			},
		},
		defaultVariants: {
			size: "default",
		},
	});

	type InputProps = Omit<HTMLInputAttributes, "size"> & {
		size?: VariantProps<typeof variants>["size"];
		class?: string;
		value?: string | number;
		icon?: string;
	};

	let {
		class: className,
		size = "default",
		value = $bindable(),
		icon,
		...restProps
	}: InputProps = $props();
</script>

<div class="relative w-fit">
	{#if icon}
		<i class="ti ti-{icon} text-secondary-subtle/50 text-xl absolute top-[50%] translate-y-[-50%] left-2"></i>
	{/if}
	<input data-icon={icon != undefined} bind:value class={cn(variants({ size }), 'data-[icon=true]:pl-8', className)} {...restProps} />
</div>