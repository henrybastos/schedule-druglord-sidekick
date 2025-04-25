<script lang="ts">
   import type { Product } from '$lib/types';
   import Badge from '$lib/ui/Badge.svelte';
   import Tabs, { type Trigger } from '$lib/ui/Tabs.svelte';
   import _ from 'lodash';

   type Props = {
      currentProduct: Product;
   }

   let { currentProduct = $bindable() }: Props = $props();
   const tabsTriggers: Trigger[] = [
      { value: 'sales-history', label: 'Sales History' }, 
      { value: 'sales-by-customer', label: 'Sales by Customer' }
   ]

   let salesByCustomer = $derived.by<Map<string, { amount: number, price: number }>>(() => {
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

         console.log(sales);
         return sales;
      } else {
         return new Map([]);
      }
   });

   function sortCustomerSales() {
      const sortedSales = _.sortBy(Array.from(salesByCustomer), ([, sale]) => sale.price);
      return new Map(sortedSales.reverse());
   }

   function sortSales() {
      const sortedSales = _.sortBy(currentProduct.salesHistory, (sale) => sale.price);
      return sortedSales.reverse();
   }

   $effect(() => {
      if (salesByCustomer) {
         sortCustomerSales()
         console.log('sortCustomerSales');
      }
   })
   
   $effect(() => {
      if (currentProduct.salesHistory) {
         sortSales()
         console.log('sortSales');
      }
   })
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
      
               {#each sortSales() as sale}
                  <div class="grid grid-cols-subgrid col-span-full w-full p-3 last:pb-0 first:pt-0">
                     <span class="capitalize">{ sale.customer }</span>
                     <span class="font-mono">x{ sale.amount }</span>
                     <span class="font-mono justify-self-end">
                        ${ sale.price }
                        <Badge class="ml-1">${ Math.round(sale.price / sale.amount) }</Badge>
                     </span>
                  </div>
               {/each}
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
      
               {#each sortCustomerSales().entries() as [customer, sale]}
                  <div class="grid grid-cols-subgrid col-span-full w-full p-3 last:pb-0 first:pt-0">
                     <span class="capitalize">{ customer }</span>
                     <span class="font-mono">x{ sale.amount }</span>
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