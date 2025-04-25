export type Product = {
   value: string;
   label: string;
   group: 'methanphetamine' | 'weed';
   disabled: boolean;
   price: {
      suggested: number;
      asking: number;
   };
   salesHistory: Array<ProductSalesHistoryItem>;
   recipe: Array<ProductRecipeStep>;
}

export type ProductSalesHistoryItem = {
   customer: string;
   amount: number;
   price: number;
}

export type ProductRecipeStep = {
   product: string;
   nextProductIngredient: IngredientsKeys;
}

export type IngredientsKeys = 
   'addy' | 
   'banana' | 
   'battery' | 
   'chili' | 
   'cuke' | 
   'donut' | 
   'energy-drink' |
   'flu-medicine' |
   'gasoline' |
   'horse-semen' |
   'iodine' |
   'jar' |
   'mega-bean' |
   'motor-oil' |
   'mouth-wash' |
   'paracetamol' |
   'viagor'
;

export type IngredientsData = {
   [K in IngredientsKeys]: {
      label: string;
      price: number;
   }
}