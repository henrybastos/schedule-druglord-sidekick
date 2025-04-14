<script lang="ts">
   import TOML, { type TomlPrimitive } from 'smol-toml';
   import Badge from "$lib/ui/Badge.svelte";
   import Select, { type SelectOption } from "$lib/ui/Select.svelte";
   import { Button, Label } from "bits-ui";
   import { onMount } from "svelte";
    import Meter from '$lib/ui/Meter.svelte';

   interface Product {
      value: string;
      label: string;
      group?: string;
      disabled: boolean;
      price: ProductPrice,
      recipe?: ProductRecipeStep[],
      sellingsHistory?: Array<number>;
   }

   type ProductPrice = {
      suggested: number;
      asking: number;
   }

   type ProductRecipeStep = {
      product: string;
      nextProductIngredient?: string;
   }

   let products: Map<string, Product> = $state(new Map());

   let options: SelectOption[] = $derived(Array.from(products.values()).map(({ label, value, disabled, group }) => ({ label, value, disabled, group })));

   let productName = $state('');
   let amount = $state(1);
   
   let product = $derived(products.get(productName));
   
   let priceAdvantage = $derived((product?.price?.asking ?? 0) * amount > Math.floor((product?.price?.suggested ?? 0) * amount * 1.3))

   let sellings = $derived.by(() => {
      if (product?.sellingsHistory) {
         const total = product.sellingsHistory.flat().reduce((sum, num) => sum + num, 0);
         const min = Math.min(...product.sellingsHistory.flat());
         const max = Math.max(...product.sellingsHistory.flat());
         const count = product.sellingsHistory.flat().length;
         const avg = Number((total / count).toFixed(2));

         return { total, min, max, avg, count };
      }
   })

   onMount(async () => {
      const response = await fetch('/products.toml');
      const tomlProducts = TOML.parse(await response.text()) as unknown as Record<string, Product[]>;

      products = new Map(tomlProducts.products.map(o => [o.value, o]));
   });
</script>

<svelte:head>
   <title>Schedule Druglord Sidekick</title>
</svelte:head>

<h1 class="w-full text-center text-2xl uppercase font-bold mb-6">Schedule Druglord Sidekick</h1>

<main class="flex flex-col w-[55rem] bg-primary-subtle rounded-md p-6 gap-2">
   <div class="border-b-2 border-b-primary pb-6 w-full">
      <h2 class="mb-3 text-lg font-semibold">Product</h2>
      
      <div class="inline-flex gap-x-3 w-full">
         <Select class="w-full" type="single" bind:options={options} placeholder="Select a product" bind:value={productName}/>
         <input bind:value={amount} class="input-md w-[4rem] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none" type="number" name="amount" id="amount">
         
         <div class="inline-flex">
            <Button.Root onclick={() => amount++} class="btn-md btn-icon btn-outline rounded-r-none">
               <i class="ti ti-chevron-up text-lg"></i>
            </Button.Root>
            
            <Button.Root onclick={() => amount--} class="btn-md btn-icon btn-outline rounded-l-none border-l-0 ml-[-2px]">
               <i class="ti ti-chevron-down text-lg"></i>
            </Button.Root>
         </div>
      </div>
   </div>

   {#if product}
      <div class="border-b-2 border-b-primary pb-6">
         <h2 class="my-3 text-lg font-semibold">Price</h2>
   
         {#if product?.price?.suggested}
            <!-- <div class="inline-flex gap-x-2">
               <Label.Root class="inline-flex font-medium">{ productLabel }</Label.Root>
               <span class="inline-flex rounded-sm px-2 py-1 uppercase text-xs bg-stone-800 w-fit text-nowrap">${ suggestedPrice }</span>
            </div> -->
            
            <div class="grid grid-cols-[6rem_auto_auto_auto] w-full gap-3">
               <div class="grid grid-cols-subgrid col-span-full text-subtle font-semibold uppercase text-sm text-nowrap">
                  <span>Amount</span>
                  <span>
                     Suggested Price
                     <Badge class="ml-1">${ product?.price?.suggested }</Badge>
                  </span>
                  <span>
                     Auto Price 
                     <Badge class="ml-1">+ 30%</Badge>
                  </span>
                  <span>
                     Asking Price
                     <Badge class="ml-1">
                        ${ product?.price?.asking }
                     </Badge>
                  </span>
               </div>
   
               <div class="grid grid-cols-subgrid col-span-full">
                  <span class="flex">x{ amount }</span>
         
                  <span class="flex">${ product?.price?.suggested * amount }</span>
                  
                  <div class="inline-flex gap-x-3">
                     <span data-advantage={priceAdvantage} class="flex data-[advantage=false]:text-green-500">${ Math.floor(product?.price?.suggested * amount * 1.3) }</span>
                  </div>
         
                  {#if product?.price?.asking}
                     <span data-advantage={priceAdvantage} class="flex data-[advantage=true]:text-green-500">${ product?.price?.asking * amount }</span>
                  {:else}
                     <span class="flex text-muted">No asking price</span>
                  {/if}
               </div>
            </div>
         {:else}
            <span class="text-red-500">Error: Product not registered ({ product })</span>
         {/if}
      </div>

      <div class="flex gap-x-3">
         <div class="border-b-2 last:border-none border-b-primary pb-6 w-full last:pb-0">
            <h2 class="my-3 text-lg font-semibold">Recipe</h2>
            
            {#if product?.recipe}
               <div class="grid grid-cols-[repeat(4,_min-content)] items-center justify-center gap-3 px-6 py-4 rounded-md mx-auto text-nowrap w-fit border-2 border-primary-muted">
                  {#each product.recipe as step}
                     <div class="grid grid-cols-subgrid col-span-full">
                        {#if step.nextProductIngredient}
                           <span>{ step.product }</span>
                           <i class="ti ti-plus text-lg"></i>
                           <Badge>{ step.nextProductIngredient }</Badge>
                           <i class="ti ti-corner-right-down text-lg"></i>
                        {:else}
                           <span class="mx-auto col-span-full font-medium">{ step.product }</span>
                        {/if}
                     </div>
                  {/each}
               </div>
            {:else}
               <span class="flex text-muted">No recipe registered for { product.label }</span>
            {/if}
         </div>
   
         <div class="border-b-2 last:border-none border-b-primary pb-6 w-full last:pb-0">
            <h2 class="my-3 text-lg font-semibold">Sellings History</h2>
            
            {#if sellings}
               <!-- {@const min = Math.min(...product.sellingsHistory.flat())}
               {@const max = Math.max(...product.sellingsHistory.flat())}
               {@const avg = product.sellingsHistory.reduce((sum, num) => sum + num, 0) / product.sellingsHistory.length}
               <Meter {min} {max} label="Máxima" value={405} valueLabel="wtf"/> -->
   
               <div class="grid grid-cols-2 w-full gap-y-3">
                  <div class="flex flex-col gap-y-1">
                     <span class="text-subtle font-semibold uppercase text-sm">Sellings</span>
                     <span>x{ sellings.count }</span>
                  </div>
                  
                  <div class="flex flex-col gap-y-1">
                     <span class="text-subtle font-semibold uppercase text-sm">Maximum Price</span>
   
                     <div class="inline-flex items-center gap-x-1 text-green-500">
                        <span>${ sellings.max }</span>
                        <i class="ti ti-arrow-badge-up-filled"></i>
                     </div>
                  </div>
                  
                  <div class="flex flex-col gap-y-1">
                     <span class="text-subtle font-semibold uppercase text-sm">Avarage Price</span>
                     <span class="text-sky-500">${ sellings.avg }</span>
                  </div>
   
                  <div class="flex flex-col gap-y-1">
                     <span class="text-subtle font-semibold uppercase text-sm">Minimum Price</span>
                     
                     <div class="inline-flex items-center gap-x-1 text-red-500">
                        <span>${ sellings.min }</span>
                        <i class="ti ti-arrow-badge-down"></i>
                     </div>
                  </div>
                  
                  <div class="flex flex-col col-span-full gap-y-2">
                     <div class="inline-flex items-center justify-center h-3 w-full rounded-full *:rounded-l-full relative overflow-hidden">
                        <span class="absolute bg-green-500 outline-primary-subtle outline-2 inset-0"></span>
                        <span style="right: { 100 - (Math.ceil((sellings.avg / sellings.total) * 100)) }%" class="absolute bg-sky-500 outline-primary-subtle outline-2 inset-0"></span>
                        <span style="right: { 100 - (Math.ceil((sellings.min / sellings.total) * 100)) }%" class="absolute bg-red-500 outline-primary-subtle outline-2 inset-0"></span>
                     </div>
                  </div>
               </div>
            {:else}
               <span class="flex text-muted">No sellings history of { product.label }</span>
            {/if}
         </div>
      </div>
   {:else}
   <span class="flex text-muted">No product selected</span>
   {/if}
</main>