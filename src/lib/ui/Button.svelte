<script lang="ts">
	import type { Snippet } from "svelte";
	import { Button, type Button as ButtonPrimitive } from "bits-ui";
	import { cn } from "$lib/utils";
	import { tv, type VariantProps } from "tailwind-variants";

	const variants = tv({
		base: "flex items-center justify-center rounded-sm focus-visible-outline transition-all duration-75 disabled:cursor-not-allowed disabled:opacity-50",
		variants: {
			variant: {
				default: "bg-secondary-subtle text-primary-dark cursor-pointer hover:bg-secondary-muted active:bg-secondary-dark",
				outline: "bg-transparent text-secondary cursor-pointer border-2 border-secondary-subtle/25 hover:border-secondary-subtle/50 active:border-secondary-subtle/15",
				ghost: "bg-transparent text-secondary cursor-pointer hover:bg-secondary-subtle/15 active:bg-primary-muted",
				danger: "bg-red-900 text-secondary cursor-pointer hover:bg-red-700 active:bg-red-950",
			},
			size: {
				default: "h-10 px-4 py-2 text-base gap-x-3 font-semibold",
				sm: "h-9 px-3 gap-x-2 text-base font-semibold",
				icon: "size-10 leading-0 aspect-square justify-center",
			}
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		}
	});

	type ButtonProps = ButtonPrimitive.RootProps & {
		variant?: VariantProps<typeof variants>["variant"];
		size?: VariantProps<typeof variants>["size"];
		id?: string;
		class?: string;
		children: Snippet;
	}

	let { id, class: className, children, variant = "default", size = "default", ...restProps }: ButtonProps = $props();
</script>

<Button.Root {id} class={cn(variants({ variant, size, className }), className)} {...restProps}>
	{@render children?.()}
</Button.Root>