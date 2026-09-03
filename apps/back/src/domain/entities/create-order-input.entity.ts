export interface CreateOrderItemInput {
  productVariantId: string;
  quantity: number;
}

export interface CreateOrderInput {
  userId: string;
  storeId: string;
  items: CreateOrderItemInput[];
}
