<script lang="ts">
  import { CalendarDate, getLocalTimeZone, parseDate, today } from "@internationalized/date";
  import { DateField, type WithoutChildrenOrChild } from "bits-ui";
  import { onMount } from "svelte";

  type Props = WithoutChildrenOrChild<DateField.RootProps> & {
    defaultValue?: string;
  };

  let {
    value = $bindable(),
    placeholder,
    defaultValue,
    ...restProps
  }: Props = $props();

  onMount(() => {
    value = defaultValue ? parseDate(defaultValue) : undefined;
  });
</script>

<DateField.Root
  {...restProps}
  bind:value
  bind:placeholder
  locale="pt-BR"
>
  <DateField.Input
    class="h-10 w-fit px-2 flex items-center justify-center rounded-sm transition-all duration-75 disabled:cursor-not-allowed disabled:opacity-50 data-invalid:border-red-500 bg-transparent text-secondary cursor-pointer border-2 border-secondary-subtle/25 active:border-secondary-subtle/15 select-none"
  >
    {#snippet children({ segments })}
      {#each segments as { part, value }}
        <div class="inline-block select-none">
          {#if part === "literal"}
            <DateField.Segment {part} class="text-secondary-subtle/50 font-semibold px-0.5">
              {value}
            </DateField.Segment>
          {:else}
            <DateField.Segment  {part} class="aria-[valuetext=Empty]:text-secondary-subtle/50 text-secondary font-medium hover:text-secondary-subtle px-1 transition-all border-b-2 border-b-transparent focus-visible:outline-none focus-visible:border-b-secondary">
              {value}
            </DateField.Segment>
          {/if}
        </div>
      {/each}
    {/snippet}
  </DateField.Input>
</DateField.Root> 
