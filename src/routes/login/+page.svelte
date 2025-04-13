<script lang="ts">
   import Select from "$lib/Select.svelte";
    import { Label } from "bits-ui";

   const options = [
      { value: "aerial-lift",  label: "aerial lift", disabled: false, },
      { value: "alarm",        label: "Alarm",       disabled: false, },
      { value: "test",        label: "Test",       disabled: false, },
   ];

   let value = $state<string>("");
</script>

<svelte:head>
   <title>Bits UI - Playground</title>
</svelte:head>

<main class="flex flex-col w-[40rem] bg-stone-900 rounded-md p-6 gap-2">
   <Label.Root class="inline-flex font-medium">Título</Label.Root>
   <input class="input-md" type="text" name="" id="">

   <Select type="single" {options} placeholder="Hello" bind:value/>
   <pre>{ value }</pre>
</main>