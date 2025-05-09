export type Product = {
   value: string;
   label: string;
   group: 'methanphetamine' | 'weed';
   disabled: boolean;
   price: {
      suggested: number;
      asking: number;
   };
   recipe: Array<ProductRecipeStep>;
}

export type SalesHistory = Array<SaleType>;

export type SaleType = {
   id: string;
   createdAt?: number;
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

export type IngredientsData = Map<IngredientsKeys, {
   label: string;
   price: number;
}>