export const ORDER_LIMITS = {
  MAX_LINES: 50,
  MAX_UNITS_PER_LINE: 100,
} as const;

export interface CreateOrderItemInput {
  productVariantId: string;
  quantity: number;
}

export interface GuestCustomerInput {
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

export interface CreateOrderInput {
  userId: string | null;
  storeId: string;
  guest?: GuestCustomerInput;
  items: CreateOrderItemInput[];
}
