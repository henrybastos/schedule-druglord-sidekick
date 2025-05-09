<script lang="ts">
   import Dialog from "$lib/ui/Dialog.svelte";
   import { json } from "@codemirror/lang-json";
   import CodeMirror from "svelte-codemirror-editor";
   import { onMount } from "svelte";
   import { dracula } from "thememirror";
   import Button from "$lib/ui/Button.svelte";
   import ScrollArea from "$lib/ui/ScrollArea.svelte";
   import type { Product } from "$lib/types";
    import { Tabs } from "bits-ui";

   let defaultProducts: Array<Product> = [];

   const identationSize = 2;
   let { open = $bindable(), onchange } = $props();
   let products = $state(JSON.stringify(defaultProducts));
   let productsCM = $derived(typeof products == 'string' ? products : JSON.stringify(products, null, identationSize));
   let customersCM = $state('');
   let errorLabel = $state();
   let changes = $state(false);
   let changesLabel = $derived(changes ? 'Unsaved changes' : undefined);
   let tabsValue = $state('products-tab');

   const blankSales = $derived(JSON.parse(products).products?.map(({ value }: { value: string }) => ({ [value]: [] })));

   function saveProducts() {
      if (productsCM) {
         try {
            const jsonProducts = JSON.stringify(JSON.parse(productsCM));
            localStorage.setItem('products', jsonProducts);
            changes = false;
            errorLabel = '';
            onchange();
         } catch (error: any) {
            if (error.message.match('is not valid JSON')?.[0]) {
               console.error(error);
               errorLabel = 'Error: Invalid JSON'
            }
         }
      }
   }

   function saveProductsBackup() {
      if (productsCM) {
         try {
            const localStorageBackup = JSON.parse(localStorage.getItem('schedule-druglord-sidekick-products-backup') ?? '{ "schedule-druglord-sidekick-products-backup": [] }');
            const backupAmount = localStorageBackup["schedule-druglord-sidekick-products-backup"].length;

            if (backupAmount < 30) {
               localStorageBackup["schedule-druglord-sidekick-products-backup"].push({ [`products-${ Math.random().toString().substring(2,10) }`]: JSON.parse(productsCM).products })
               localStorage.setItem('schedule-druglord-sidekick-products-backup', JSON.stringify(localStorageBackup));
            }
         } catch (error: any) {
            if (error.message.match('is not valid JSON')?.[0]) {
               console.error(error);
               errorLabel = 'Error [Backup]: Invalid JSON'
            }
         }
      }
   }

   function fetchProducts() {
      const productsLA = localStorage.getItem("products");
      changes = false;
      
      if (productsLA) {
         products = JSON.stringify(JSON.parse(productsLA), null, identationSize);
         productsCM = products;
      }
   }

   function loadDefaultProducts() {
      const data = JSON.stringify({ products: defaultProducts }, null, 3);
      productsCM = data;
   }

   function closeDialog() {
      open = false;
      changes = false;
      productsCM = products;
   }

   function resetSales() {
      console.log(blankSales);
      console.log(JSON.stringify(JSON.parse(customersCM)));
   }

   $effect(() => {
      if (open == true) {
         fetchProducts();
      } else if (open == false) {
         closeDialog();
      }
   })

   onMount(() => {
      fetchProducts();
      customersCM = JSON.stringify(JSON.parse(localStorage.getItem('schedule-druglord-sidekick-all-sales') ?? JSON.stringify(blankSales)), null, 3)
      // customersCM = JSON.stringify(JSON.parse(localStorage.getItem('schedule-druglord-sidekick-all-sales') ?? JSON.stringify(blankSales)), null, 3)
   });
</script>

<Dialog 
   class="max-w-5xl min-h-[40rem]"
   contentProps={{ interactOutsideBehavior: changes ? 'ignore' : 'close' }} 
   bind:open
>
   {#snippet title()}
      <h1>Configurations</h1>
   {/snippet}

   {#snippet close()}
      <Button disabled={changes} onclick={closeDialog} variant="ghost" size="icon">
         <i class="ti ti-x text-xl"></i>
      </Button>
   {/snippet}

   <Tabs.Root bind:value={tabsValue}>
      <Tabs.List class="flex w-full border-2 border-input-muted rounded-md p-1 gap-1 mt-3">
         <Tabs.Trigger class="w-full" value="products-tab">
            <Button class="w-full" size="sm" variant={tabsValue == 'products-tab' ? 'default' : 'ghost'}>Products</Button>
         </Tabs.Trigger>

         <Tabs.Trigger class="w-full" value="customers-tab">
            <Button class="w-full" size="sm" variant={tabsValue == 'customers-tab' ? 'default' : 'ghost'}>Customers</Button>
         </Tabs.Trigger>
      </Tabs.List>

      <Tabs.Content value="products-tab">
         <h2 class="text-lg font-semibold my-3">Products</h2>

         <ScrollArea orientation="both" class="max-h-[40rem]">
            <CodeMirror
               bind:value={productsCM}
               on:change={() => changes = true}
               lang={json()}
               theme={dracula}
               class="text-base"
            />
         </ScrollArea>
      
         <span data-error={errorLabel != undefined} class="w-full text-right mt-3 text-secondary-subtle data-[error=true]:text-red-500">{ errorLabel ?? changesLabel }</span>
      
         <div class="flex flex-row-reverse mt-3 gap-x-3">
            <Button size="icon" variant="ghost" onclick={fetchProducts}>
               <i class="ti ti-reload text-xl"></i>
            </Button>
            <Button disabled={!changes} onclick={saveProducts}>Save</Button>
            <Button variant="outline" onclick={() => open = false}>Cancel</Button>
            <Button variant="ghost" onclick={loadDefaultProducts}>Load default data</Button>
            <Button variant="ghost" onclick={saveProductsBackup}>Save backup</Button>
         </div>
      </Tabs.Content>

      <Tabs.Content value="customers-tab">
         <h2 class="text-lg font-semibold my-3">Customers</h2>

         <ScrollArea orientation="both" class="max-h-[40rem]">
            <CodeMirror
               readonly
               value={customersCM}
               lang={json()}
               theme={dracula}
               class="text-base"
            />
         </ScrollArea>

         <div class="flex flex-row-reverse mt-3 gap-x-3">
            <Button variant="danger" onclick={resetSales}>Reset sales</Button>
         </div>
      </Tabs.Content>
   </Tabs.Root>
</Dialog>
