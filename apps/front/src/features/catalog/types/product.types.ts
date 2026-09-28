export type Discipline = "dressage" | "obstacle" | "complet" | "loisir";

export interface Category {
  id: string;
  slug: string;
  name: string;
  position: number;
}

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
  category: ProductCategory | null;
  status: "ACTIVE" | "ARCHIVED";
  specs: string[];
  shippingInfo: string;
  isNew: boolean;
  isPopular: boolean;
  images: ProductImage[];
  variants: ProductVariant[];
  createdAt: string;
  updatedAt: string;
}
