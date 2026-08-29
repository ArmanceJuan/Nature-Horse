export type Discipline = "dressage" | "obstacle" | "complet" | "loisir";

export interface ProductVariant {
  size: string;
  color: string;
  stockByStore: Record<string, number>;
}

export interface Product {
  id: string;
  name: string;
  collection: "textile-performance" | "haute-sellerie";
  discipline: Discipline;
  price: number;
  imageUrl: string;
  images: string[];
  description: string;
  specs: string[];
  shippingInfo: string;
  variants: ProductVariant[];
  isNew: boolean;
  isPopular: boolean;
}

export interface Collection {
  id: "textile-performance" | "haute-sellerie";
  name: string;
  imageUrl: string;
}
