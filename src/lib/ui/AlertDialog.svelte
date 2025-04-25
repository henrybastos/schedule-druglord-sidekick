<script lang="ts">
	import type { Snippet } from "svelte";
	import { AlertDialog, type WithoutChild } from "bits-ui";
   import { cn } from "$lib/utils";
   import type { ClassValue } from "clsx";

	type Props = AlertDialog.RootProps & {
		title: Snippet;
		description?: Snippet;
		action: Snippet<[AlertDialog.ActionProps]>;
		cancel: Snippet<[AlertDialog.CancelProps]>;
      class?: ClassValue;
		contentProps?: WithoutChild<AlertDialog.ContentProps>;
	};
 
	let {
		open = $bindable(false),
		children,
		contentProps,
		title,
		action,
		cancel,
      class: className,
		description,
		...restProps
	}: Props = $props();
</script>
 
<AlertDialog.Root bind:open {...restProps}>
	<AlertDialog.Portal>
		<AlertDialog.Overlay class="data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=open]:fixed inset-0 z-50 bg-black/75" />
		<AlertDialog.Content class={cn("fixed flex flex-col p-6 z-50 rounded-md bg-primary-muted data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 w-xl left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%]", className)} {...contentProps}>
			<AlertDialog.Title class="text-2xl text-secondary font-bold">
				{@render title()}
			</AlertDialog.Title>

			<AlertDialog.Description class="text-lg text-secondary font-medium my-3">
				{@render description?.()}
			</AlertDialog.Description>

			{@render children?.()}

         <div class="flex justify-end gap-x-3 w-full">
            <AlertDialog.Cancel>
					{@render cancel({...cancel})}
				</AlertDialog.Cancel>

            <AlertDialog.Action>
					{@render action({...action})}
				</AlertDialog.Action>
         </div>
		</AlertDialog.Content>
	</AlertDialog.Portal>
</AlertDialog.Root>