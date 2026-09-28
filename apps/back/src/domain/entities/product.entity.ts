export type ProductStatus = "ACTIVE" | "ARCHIVED";

export interface ProductCategory {
  id: string;
  slug: string;
  name: string;
}

export interface ProductImage {
  id: string;
  url: string;
  altText: string | null;
  position: number;
}

export interface AttributeValue {
  attributeName: string;
  value: string;
}

export interface ProductVariant {
  id: string;
  attributeValues: AttributeValue[];
  stockByStore: Record<string, number>;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  collection: string;
  discipline: string;
  category?: ProductCategory | null;
  status: ProductStatus;
  specs: string[];
  shippingInfo: string;
  isNew: boolean;
  isPopular: boolean;
  images: ProductImage[];
  variants: ProductVariant[];
  createdAt: Date;
  updatedAt: Date;
}
