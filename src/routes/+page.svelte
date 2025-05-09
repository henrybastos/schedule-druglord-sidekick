<script lang="ts">
   import TOML, { type TomlPrimitive } from 'smol-toml';
   import Badge from "$lib/ui/Badge.svelte";
   import Select, { type SelectOption } from "$lib/ui/Select.svelte";
   import { Label } from "bits-ui";
   import { onMount, type Snippet } from "svelte";
   // import Meter from '$lib/ui/Meter.svelte';
   import ConfigDialog from './schedule/ConfigDialog.svelte';
   import Button from '$lib/ui/Button.svelte';
   import type { IngredientsKeys, Product, SalesHistory } from '$lib/types';
   import Input from '$lib/ui/Input.svelte';
   import SalesTabs from './schedule/SalesTabs.svelte';
   import _ from 'lodash';
   import { nanoid } from 'nanoid';
   import { CustomersList, ProductIngredients } from '$lib';
    import { SvelteMap } from 'svelte/reactivity';

   // {
   //    "Product": "mouthwash",
   //    "Mixer": "granddaddypurple",
   //    "Output": "ogmint"
   // },

   const customers: SelectOption[] = CustomersList.sort().map(c => ({ label: c, value: _.kebabCase(c) }));

   let products = $state<Map<string, Product>>(new SvelteMap());
   let sales = $state<Map<string, SalesHistory>>(new SvelteMap());
   let isConfigDialogOpen = $state(false);
   let time = $state('00:00:00');

   let options: SelectOption[] = $derived(Array.from(products.values()).map(({ label, value, disabled, group }) => ({ label, value, disabled, group })));

   let selectedClient = $state('');
   let selectedProduct = $state('');
   let realProductPrice = $state(0);
   let amount = $state(1);
   
   let currentProduct = $derived<Product | undefined>(products.get(selectedProduct));
   let currentSales = $derived(sales.get(selectedProduct) ?? []);
   
   let priceAdvantage = $derived((currentProduct?.price?.asking ?? 0) * amount > Math.floor((currentProduct?.price?.suggested ?? 0) * amount * 1.3))
   let batchAmount = $state(0);
   let batchPrice = $derived.by(() => {
      if (currentProduct && batchAmount) {
         return currentProduct.recipe
            .map((step) => (ProductIngredients.get((step.nextProductIngredient as IngredientsKeys))?.price ?? 0) * batchAmount)
            .reduce((a,b) => a+b);
      }
   });

   // let sellings = $derived.by(() => {
   //    if (product?.sellingsHistory) {
   //       const total = product.sellingsHistory.flat().reduce((sum, num) => sum + num, 0);
   //       const min = Math.min(...product.sellingsHistory.flat());
   //       const max = Math.max(...product.sellingsHistory.flat());
   //       const count = product.sellingsHistory.flat().length;
   //       const avg = Number((total / count).toFixed(2));

   //       return { total, min, max, avg, count };
   //    }
   // })

   async function fetchProducts() {
      const localStorageProducts = localStorage.getItem('products');
      let jsonProducts;
      
      if (localStorageProducts) {
         jsonProducts = JSON.parse(localStorageProducts);
      } else {
         console.error('No products found');
         // const response = await fetch('/products.toml');
         // if (response) {
         //    jsonProducts = TOML.parse(await response.text()) as unknown as Record<string, Product[]>;
         //    console.log(jsonProducts);
         // } else {
         //    console.error('No Products Manifest was found.');
         // }
      }  

      if (jsonProducts?.products) {
         products = new SvelteMap(jsonProducts.products.map((o: Product) => [o.value, o]));
      } else {
         console.error('Cade os podruto');
      }
   }

   function addSale() {
      
      if (selectedClient) {
         const salesHistory = sales.get(selectedProduct) ?? [];

         const newSale = {
            id: nanoid(),
            createdAt: Date.now(),
            customer: selectedClient,
            amount: amount,
            price: realProductPrice
         }

         sales.set(selectedProduct, [newSale, ...salesHistory]);
         currentSales = sales.get(selectedProduct) ?? currentSales;
         // currentProduct = products.get(selectedProduct);
         saveProductsOnLocalStorage()
      }
   }

   function saveProductsOnLocalStorage() {
      sales.set(selectedProduct, currentSales);
      console.log(sales);
      
      localStorage.setItem('products', JSON.stringify({ products: Array.from(products.values()) }));
      localStorage.setItem('schedule-druglord-sidekick-all-sales', JSON.stringify(Object.fromEntries(sales.entries())));
   }

   $effect(() => {
      if (currentProduct?.price) {
         realProductPrice = currentProduct.price.asking * amount;
      }
   })

   onMount(async () => {
      let localStorageSales = localStorage.getItem('schedule-druglord-sidekick-all-sales');
      
      if (!localStorageSales) {
         localStorage.setItem('schedule-druglord-sidekick-all-sales', JSON.stringify([]));
         sales = new SvelteMap([]);
      } else {
         const parsedSales = JSON.parse(localStorageSales);

         if (parsedSales) {
            sales = new SvelteMap(Object.entries(parsedSales));
         }
      }

      setInterval(() => time = new Date().toLocaleTimeString('pt-BR'), 1000);
      await fetchProducts();
   });
</script>

<svelte:head>
   <title>Schedule Druglord Sidekick</title>
</svelte:head>

<div class="mb-6">
   <h1 class="w-full text-center text-2xl uppercase font-bold">Schedule Druglord Sidekick</h1>
   <span class="flex w-fit mx-auto font-semibold text-secondary-subtle/75">{ time }</span>
</div>

<main class="flex flex-col w-5xl bg-primary-subtle rounded-md p-6">
   <div class="flex flex-col border-b-2 border-b-primary pb-6 w-full gap-3">
      <div class="inline-flex justify-between w-full">
         <h2 class="mb-3 text-lg font-semibold">Product</h2>
         <Button variant="ghost" size="icon" onclick={() => isConfigDialogOpen = true}>
            <i class="ti ti-settings text-xl"></i>
         </Button>
      </div>
      
      <div class="inline-flex gap-x-3 w-full border-b-2 border-b-primary pb-6">
         <Select class="w-full" type="single" bind:options={options} placeholder="Select a product" bind:value={selectedProduct}/>
         <input bind:value={amount} class="input-md w-[4rem] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none" type="number" name="amount" id="amount">
         
         <div class="inline-flex">
            <Button variant="outline" size="icon" onclick={() => amount++} class="rounded-r-none">
               <i class="ti ti-chevron-up text-lg"></i>
            </Button>

            <Button variant="outline" size="icon" onclick={() => amount--} class="rounded-l-none border-l-0">
               <i class="ti ti-chevron-down text-lg"></i>
            </Button>
         </div>

         <Select class="w-full" type="single" options={customers} placeholder="Select a client" bind:value={selectedClient}/>

         <Input icon="currency-dollar" type="number" bind:value={realProductPrice} class="w-40"/>
         <Button onclick={addSale} variant="ghost" size="icon">
            <i class="ti ti-plus text-lg"></i>
         </Button>
      </div>
   </div>

   {#if currentProduct}
      <div class="border-b-2 border-b-primary pb-6">
         <h2 class="my-3 text-lg font-semibold">Price</h2>
   
         {#if currentProduct?.price?.suggested}
            <!-- <div class="inline-flex gap-x-2">
               <Label.Root class="inline-flex font-medium">{ productLabel }</Label.Root>
               <span class="inline-flex rounded-sm px-2 py-1 uppercase text-xs bg-stone-800 w-fit text-nowrap">${ suggestedPrice }</span>
            </div> -->
            
            <div class="grid grid-cols-[6rem_auto_auto_auto] w-full gap-3">
               <div class="grid grid-cols-subgrid col-span-full text-subtle font-semibold uppercase text-sm text-nowrap">
                  <span>Amount</span>
                  <span>
                     Suggested Price
                     <Badge class="ml-1">${ currentProduct?.price?.suggested }</Badge>
                  </span>
                  <span>
                     Auto Price 
                     <Badge class="ml-1">+ 30%</Badge>
                  </span>
                  <span>
                     Asking Price
                     <Badge class="ml-1">
                        ${ currentProduct?.price?.asking }
                     </Badge>
                  </span>
               </div>
   
               <div class="grid grid-cols-subgrid col-span-full">
                  <span class="flex">x{ amount }</span>
         
                  <span class="flex">${ currentProduct?.price?.suggested * amount }</span>
                  
                  <div class="inline-flex gap-x-3">
                     <span data-advantage={priceAdvantage} class="flex data-[advantage=false]:text-green-500">${ Math.floor(currentProduct?.price?.suggested * amount * 1.3) }</span>
                  </div>
         
                  {#if currentProduct?.price?.asking}
                     <span data-advantage={priceAdvantage} class="flex data-[advantage=true]:text-green-500">${ currentProduct?.price?.asking * amount }</span>
                  {:else}
                     <span class="flex text-muted">No asking price</span>
                  {/if}
               </div>
            </div>
         {:else}
            <span class="text-red-500">Error: Product not registered ({ currentProduct })</span>
         {/if}
      </div>

      <div class="flex gap-3">
         <div class="flex flex-col gap-3 w-full p-6">
            <h2 class="text-lg font-semibold">Recipe</h2>
            
            {#if currentProduct?.recipe}
               <div class="grid grid-cols-[repeat(4,_min-content)] items-center justify-center gap-3 px-6 py-4 rounded-md mx-auto text-nowrap w-fit border-2 border-primary-muted">
                  {#each currentProduct.recipe as step}
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

               <div class="inline-flex items-center gap-3">
                  <Input type="number" bind:value={batchAmount} class="w-40"/>
                  <span class="flex font-medium">${ batchPrice }</span>
               </div>
            {:else}
               <span class="flex text-muted">No recipe registered for { currentProduct.label }</span>
            {/if}
         </div>
   
         <SalesTabs bind:currentSales onSaleDeleted={saveProductsOnLocalStorage} bind:currentProduct/>

         <!-- <div class="border-b-2 last:border-none border-b-primary pb-6 w-full last:pb-0">
            <h2 class="my-3 text-lg font-semibold">Sellings History</h2>
            
            {#if sellings}
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
         </div> -->
      </div>
   {:else}
      <span class="flex text-muted">No product selected</span>
   {/if}
</main>

<ConfigDialog onchange={fetchProducts} bind:open={isConfigDialogOpen} />