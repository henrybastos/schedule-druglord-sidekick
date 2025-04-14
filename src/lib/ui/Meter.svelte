<script lang="ts">
	import { Meter, useId } from "bits-ui";
	import type { ComponentProps } from "svelte";
 
	let {
		max = 100,
		value = 0,
		min = 0,
		label,
		valueLabel,
	}: ComponentProps<typeof Meter.Root> & {
		label: string;
		valueLabel: string;
	} = $props();
 
	const labelId = useId();
</script>
 
<div>
	<span id={labelId}> {label} </span>
	<span>{valueLabel}</span>
</div>
<Meter.Root class="bg-primary-muted relative h-[15px] overflow-hidden rounded-full" aria-labelledby={labelId} aria-valuetext={valueLabel} {value} {min} {max}>
   <div
      class="h-full w-full flex-1 rounded-full transition-all duration-1000 ease-in-out bg-lime-500"
      style="transform: translateX(-{100 - (100 * (value ?? 0)) / max}%)"
    ></div>
</Meter.Root>