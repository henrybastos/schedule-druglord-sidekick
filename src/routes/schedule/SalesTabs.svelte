<script lang="ts">
   import type { Product } from '$lib/types';
   import Badge from '$lib/ui/Badge.svelte';
   import Button from '$lib/ui/Button.svelte';
   import ScrollArea from '$lib/ui/ScrollArea.svelte';
   import Tabs, { type Trigger } from '$lib/ui/Tabs.svelte';
   import { Popover } from 'bits-ui';
   import _ from 'lodash';
   import { nanoid } from 'nanoid';

   type Props = {
      currentProduct: Product;
      onSaleDeleted: () => void;
   }

   let { currentProduct = $bindable(), onSaleDeleted }: Props = $props();

   const tabsTriggers: Trigger[] = [
      { value: 'sales-history', label: 'Sales History' }, 
      { value: 'sales-by-customer', label: 'Sales by Customer' }
   ]

   let salesHistory = $derived(new Map((currentProduct?.salesHistory).map(v => [nanoid(), v])));

   let sortedCustomerSales = $derived.by<Map<string, { amount: number, price: number }>>(() => {
      if (currentProduct?.salesHistory) {
         const customers = new Set(currentProduct?.salesHistory.map(s => s.customer));
         const sales = new Map(Array.from(customers).map(c => ([c, { amount: 0, price: 0 }])))
   
         for (let sale of currentProduct?.salesHistory) {
            const currentSale = sales.get(sale.customer);

            if (currentSale) {
               sales.set(sale.customer, { 
                  amount: currentSale?.amount + sale.amount,
                  price: currentSale?.price + sale.price,
               })
            }
         }

         const sortedSales = _.sortBy(Array.from(sales), ([, sale]) => sale.price);
         return new Map(sortedSales.reverse());
      } else {
         return new Map([]);
      }
   });

   function deleteSingleSaleHistory(id: string) {
      salesHistory.delete(id);
      currentProduct.salesHistory = Array.from(salesHistory.values());
      salesHistory = new Map(salesHistory);
      onSaleDeleted();
   }
</script>

<Tabs class="mt-6" defaultTab="sales-history" triggers={tabsTriggers}>
   {#snippet content({ TabContent })}
      <TabContent value="sales-history">
         <div class="flex flex-col gap-3 w-full">
            <div class="grid grid-cols-[auto_min-content_auto] gap-x-3 px-6 py-4 border-2 border-primary-muted rounded-md divide-y-2 divide-primary-muted/75">
               <div class="grid grid-cols-subgrid col-span-full w-full p-3 last:pb-0 first:pt-0">
                  <span class="text-subtle">Buyer</span>
                  <span class="text-subtle">Amount</span>
                  <span class="text-subtle text-center">Price</span>
               </div>
      
               <div class="grid grid-cols-subgrid col-span-full w-full max-h-70 overflow-y-scroll">
                  {#each Array.from(salesHistory.entries()).reverse()  as [id, sale] (id)}
                     <Popover.Root>
                        <Popover.Trigger class="group grid grid-cols-subgrid col-span-full w-full p-3 hover:bg-primary-light/50 transition-all rounded-md cursor-pointer">
                           <span class="capitalize text-left">{ sale.customer }</span>
                           <span class="font-mono">x{ sale.amount }</span>
                           <span class="font-mono justify-self-end">
                              ${ sale.price }
                              <Badge class="ml-1">${ Math.round(sale.price / sale.amount) }</Badge>
                           </span>
                        </Popover.Trigger>
                        <Popover.Portal>
                           <Popover.Content side="right" sideOffset={6} class="bg-primary-subtle p-1 border-2 w-fit border-primary-light rounded-md data-[state=open]:animate-in data-[state=open]:zoom-in-95 data-[state=open]:fade-in-5 animate-out zoom-out-95 fade-out-5">
                              <Button onclick={() => deleteSingleSaleHistory(id)} variant="danger" size="icon">
                                 <i class="ti ti-trash text-lg"></i>
                              </Button>
                           </Popover.Content>
                        </Popover.Portal>
                     </Popover.Root>
                  {/each}
               </div>
            </div>
         </div>
      </TabContent>
      
      <TabContent value="sales-by-customer">
         <div class="flex flex-col gap-3 w-full">
            <div class="grid grid-cols-[auto_min-content_auto] gap-x-3 px-6 py-4 border-2 border-primary-muted rounded-md divide-y-2 divide-primary-muted/75">
               <div class="grid grid-cols-subgrid col-span-full w-full p-3 last:pb-0 first:pt-0">
                  <span class="text-subtle">Buyer</span>
                  <span class="text-subtle">Amount</span>
                  <span class="text-subtle text-center">Price</span>
               </div>
      
               {#each sortedCustomerSales.entries() as [customer, sale] (nanoid())}
                  <div class="grid grid-cols-subgrid col-span-full w-full p-3 last:pb-0 first:pt-0">
                     <span class="capitalize">{ customer }</span>
                     <span class="font-mono text-center">x{ sale.amount }</span>
                     <span class="font-mono justify-self-end">
                        ${ sale.price }
                        <Badge class="ml-1">${ Math.round(sale.price / sale.amount) }</Badge>
                     </span>
                  </div>
               {/each}
            </div>
         </div>
      </TabContent>
   {/snippet}
</Tabs>