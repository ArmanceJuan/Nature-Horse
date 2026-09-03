export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export const validateCreateOrderDTO = (data: unknown): ValidationResult => {
  const errors: string[] = [];

  if (typeof data !== "object" || data === null) {
    return { isValid: false, errors: ["Invalid request body"] };
  }

  const body = data as Record<string, unknown>;

  if (typeof body.storeId !== "string" || body.storeId.trim().length === 0) {
    errors.push("storeId is required");
  }

  if (!Array.isArray(body.items) || body.items.length === 0) {
    errors.push("At least one item is required");
  } else {
    const invalidItem = body.items.some((item) => {
      if (typeof item !== "object" || item === null) return true;
      const i = item as Record<string, unknown>;
      return (
        typeof i.productVariantId !== "string" ||
        typeof i.quantity !== "number" ||
        i.quantity <= 0 ||
        !Number.isInteger(i.quantity)
      );
    });
    if (invalidItem) {
      errors.push(
        "Each item must have a valid productVariantId and a positive integer quantity",
      );
    }
  }

  return { isValid: errors.length === 0, errors };
};
