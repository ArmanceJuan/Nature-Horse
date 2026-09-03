export interface ApiAttributeValue {
  attributeName: string;
  value: string;
}

export interface ApiProductVariant {
  id: string;
  attributeValues: ApiAttributeValue[];
  stockByStore: Record<string, number>;
}

export interface ApiProductImage {
  id: string;
  url: string;
  altText: string | null;
  position: number;
}

export interface ApiProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  collection: string;
  discipline: string;
  specs: string[];
  shippingInfo: string;
  isNew: boolean;
  isPopular: boolean;
  images: ApiProductImage[];
  variants: ApiProductVariant[];
}
