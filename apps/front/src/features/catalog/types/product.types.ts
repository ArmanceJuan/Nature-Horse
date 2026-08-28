export interface ProductVariant {
  size: string;
  color: string;
  stockByStore: Record<string, number>;
}

export interface Product {
  id: string;
  name: string;
  collection: "textile-performance" | "haute-sellerie";
  price: number;
  imageUrl: string;
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
