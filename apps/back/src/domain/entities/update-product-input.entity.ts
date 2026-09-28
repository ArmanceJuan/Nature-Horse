export interface UpdateProductInput {
  name?: string;
  description?: string;
  price?: number;
  collection?: string;
  discipline?: string;
  categoryId?: string;
  specs?: string[];
  shippingInfo?: string;
  isNew?: boolean;
  isPopular?: boolean;
}
