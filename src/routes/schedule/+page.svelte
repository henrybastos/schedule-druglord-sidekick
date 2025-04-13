<script lang="ts">
   import Select, { type SelectOption } from "$lib/Select.svelte";
   import { Button, Label } from "bits-ui";

   interface Product {
      value: string;
      label: string;
      group?: string;
      disabled: boolean;
      price: ProductPrice,
      process?: ProductProcessStep[]
   }

   type ProductPrice = {
      suggested: number;
      asking: number;
   }

   type ProductProcessStep = {
      product: string;
      nextProductIngredient?: string;
   }

   const products: Map<string, Product> = new Map([
      [ 
         'dark-shit', {
            value: 'dark-shit',
            label: 'DARK SHIT',
            group: 'weed',
            disabled: false,
            price: { 
               suggested: 122, 
               asking: 155 
            },
            process: [
               { product: 'Green Crack',  nextProductIngredient: 'Battery', },
               { product: 'Afghan Piss',  nextProductIngredient: 'Viagra', },
               { product: 'MERDA VERDE',  nextProductIngredient: 'Motor Oil', },
               { product: 'Bio Punch',    nextProductIngredient: 'Mouth Wash', },
               { product: 'BEBÊ CAGÂO',   nextProductIngredient: 'Iodine', },
               { product: 'Big Shitto',   nextProductIngredient: 'Addy', },
               { product: 'DARK SHIT',    nextProductIngredient: '', },
            ],
         },
      ],
      [ 
         'darker-shit', {
            value: 'darker-shit',
            label: 'DARKER SHIT',
            group: 'weed',
            disabled: false,
            price: { 
               suggested: 142, 
               asking: 230 
            },
            process: [
               { product: 'Green Crack',  nextProductIngredient: 'Battery', },
               { product: 'Afghan Piss',  nextProductIngredient: 'Viagra', },
               { product: 'MERDA VERDE',  nextProductIngredient: 'Motor Oil', },
               { product: 'Bio Punch',    nextProductIngredient: 'Mouth Wash', },
               { product: 'BEBÊ CAGÂO',   nextProductIngredient: 'Iodine', },
               { product: 'Big Shitto',   nextProductIngredient: 'Addy', },
               { product: 'DARK SHIT',    nextProductIngredient: 'Horse Semen', },
               { product: 'DARKER SHIT',  nextProductIngredient: '', },
            ],
         },
      ],
      [ 
         'duracell-v3', {
            value: 'duracell-v3',
            label: 'DURACELL V3',
            group: 'methanphetamine',
            disabled: false,
            price: { 
               suggested: 262, 
               asking: 400
            },
            process: [
               { product: 'Meth',            nextProductIngredient: 'Battery', },
               { product: 'CIANETO',         nextProductIngredient: 'Paracetamol', },
               { product: 'Sweet Durkle',    nextProductIngredient: 'Viagra', },
               { product: 'Thick Balls',     nextProductIngredient: 'Motor Oil', },
               { product: 'Gorilla Cake',    nextProductIngredient: 'Energy Drink', },
               { product: 'White Cookies',   nextProductIngredient: 'Mouth Wash', },
               { product: 'Banana Cookies',  nextProductIngredient: 'Chili', },
               { product: 'DURACELL V2',     nextProductIngredient: 'Addy', },
               { product: 'DURACELL V3',     },
            ]
         },
      ],
      [ 
         'a-bomba', {
            value: 'a-bomba',
            label: 'A BOMBA',
            disabled: false,
            price: { 
               suggested: 71, 
               asking: 95 
            },
         },
      ],
   ])

   const options: SelectOption[] = Array.from(products.values()).map(({ label, value, disabled, group }) => ({ label, value, disabled, group }));

   let productName = $state('');
   let amount = $state(1);
   
   let product = $derived(products.get(productName));
   
   let priceAdvantage = $derived((product?.price?.asking ?? 0) * amount > Math.floor((product?.price?.suggested ?? 0) * amount * 1.3))
</script>

<svelte:head>
   <title>Schedule Manager</title>
</svelte:head>

<main class="flex flex-col w-[50rem] bg-primary-subtle rounded-md p-6 gap-2">
   <div class="border-b-2 border-b-primary pb-6 w-full">
      <h2 class="mb-3 text-lg font-semibold">Product</h2>
      
      <div class="inline-flex gap-x-3 w-full">
         <Select class="w-full" type="single" options={options} placeholder="Select a product" bind:value={productName}/>
         <input bind:value={amount} class="input-md w-[6rem]" type="number" name="amount" id="amount">
         <Button.Root onclick={() => amount++} class="btn-md btn-icon btn-outline">
            <i class="ti ti-chevron-up text-lg"></i>
         </Button.Root>
         
         <Button.Root onclick={() => amount--} class="btn-md btn-icon btn-outline">
            <i class="ti ti-chevron-down text-lg"></i>
         </Button.Root>
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
                     <span class="badge">${ product?.price?.suggested }</span>
                  </span>
                  <span>
                     Auto Price 
                     <span class="badge">+ 30%</span>
                  </span>
                  <span>
                     Asking Price
                     <span class="badge">${ product?.price?.asking }</span>
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

      <div class="border-b-2 last:border-none border-b-primary pb-6 last:pb-0">
         <h2 class="my-3 text-lg font-semibold">Process</h2>
         
         {#if product?.process}
            <div class="grid grid-cols-[repeat(4,_min-content)] items-center justify-center gap-3 text-nowrap">
               {#each product.process as step}
                  <div class="grid grid-cols-subgrid col-span-full">
                     <span>{ step.product }</span>
                     {#if step.nextProductIngredient}
                        <i class="ti ti-plus text-lg"></i>
                        <span class="badge">{ step.nextProductIngredient }</span>
                        <i class="ti ti-corner-right-down text-lg"></i>
                     {/if}
                  </div>
               {/each}
            </div>
         {:else}
            <span class="flex text-muted">No process registered for { product.label }</span>
         {/if}
      </div>
   {:else}
   <span class="flex text-muted">No product selected</span>
   {/if}
</main>