export interface CreateProductVariantInput {
  attributes: { attributeName: string; value: string }[];
  stockByStore: Record<string, number>;
}

export interface CreateProductInput {
  name: string;
  description: string;
  price: number;
  collection: string;
  discipline: string;
  categoryId: string;
  specs: string[];
  shippingInfo: string;
  isNew: boolean;
  isPopular: boolean;
  images: { url: string; altText?: string }[];
  variants: CreateProductVariantInput[];
}
