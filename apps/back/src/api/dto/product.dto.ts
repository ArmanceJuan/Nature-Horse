export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export const validateCreateProductDTO = (data: unknown): ValidationResult => {
  const errors: string[] = [];

  if (typeof data !== "object" || data === null) {
    return { isValid: false, errors: ["Invalid request body"] };
  }

  const body = data as Record<string, unknown>;

  if (typeof body.name !== "string" || body.name.trim().length === 0) {
    errors.push("Name is required");
  }

  if (
    typeof body.description !== "string" ||
    body.description.trim().length === 0
  ) {
    errors.push("Description is required");
  }

  if (typeof body.price !== "number" || body.price <= 0) {
    errors.push("Price must be a positive number");
  }

  if (
    typeof body.collection !== "string" ||
    body.collection.trim().length === 0
  ) {
    errors.push("Collection is required");
  }

  if (
    typeof body.discipline !== "string" ||
    body.discipline.trim().length === 0
  ) {
    errors.push("Discipline is required");
  }

  if (
    typeof body.categoryId !== "string" ||
    body.categoryId.trim().length === 0
  ) {
    errors.push("Category is required");
  }

  if (
    !Array.isArray(body.specs) ||
    !body.specs.every((s) => typeof s === "string")
  ) {
    errors.push("Specs must be an array of strings");
  }

  if (
    typeof body.shippingInfo !== "string" ||
    body.shippingInfo.trim().length === 0
  ) {
    errors.push("Shipping info is required");
  }

  if (typeof body.isNew !== "boolean") {
    errors.push("isNew must be a boolean");
  }

  if (typeof body.isPopular !== "boolean") {
    errors.push("isPopular must be a boolean");
  }

  if (!Array.isArray(body.images) || body.images.length === 0) {
    errors.push("At least one image is required");
  } else {
    const invalidImage = body.images.some(
      (img) =>
        typeof img !== "object" ||
        img === null ||
        typeof (img as Record<string, unknown>).url !== "string",
    );
    if (invalidImage) {
      errors.push("Each image must have a valid url");
    }
  }

  if (!Array.isArray(body.variants) || body.variants.length === 0) {
    errors.push("At least one variant is required");
  } else {
    const invalidVariant = body.variants.some((v) => {
      if (typeof v !== "object" || v === null) return true;
      const variant = v as Record<string, unknown>;
      if (!Array.isArray(variant.attributes) || variant.attributes.length === 0)
        return true;
      if (
        typeof variant.stockByStore !== "object" ||
        variant.stockByStore === null
      )
        return true;
      return false;
    });
    if (invalidVariant) {
      errors.push(
        "Each variant must have attributes and a stockByStore object",
      );
    }
  }

  return { isValid: errors.length === 0, errors };
};

export const validateUpdateProductDTO = (data: unknown): ValidationResult => {
  const errors: string[] = [];

  if (typeof data !== "object" || data === null) {
    return { isValid: false, errors: ["Invalid request body"] };
  }

  const body = data as Record<string, unknown>;

  if (
    body.name !== undefined &&
    (typeof body.name !== "string" || body.name.trim().length === 0)
  ) {
    errors.push("Name must be a non-empty string");
  }

  if (
    body.description !== undefined &&
    (typeof body.description !== "string" ||
      body.description.trim().length === 0)
  ) {
    errors.push("Description must be a non-empty string");
  }

  if (
    body.price !== undefined &&
    (typeof body.price !== "number" || body.price <= 0)
  ) {
    errors.push("Price must be a positive number");
  }

  if (body.collection !== undefined && typeof body.collection !== "string") {
    errors.push("Collection must be a string");
  }

  if (body.discipline !== undefined && typeof body.discipline !== "string") {
    errors.push("Discipline must be a string");
  }

  if (
    body.specs !== undefined &&
    (!Array.isArray(body.specs) ||
      !body.specs.every((s) => typeof s === "string"))
  ) {
    errors.push("Specs must be an array of strings");
  }

  if (
    body.shippingInfo !== undefined &&
    typeof body.shippingInfo !== "string"
  ) {
    errors.push("Shipping info must be a string");
  }

  if (body.isNew !== undefined && typeof body.isNew !== "boolean") {
    errors.push("isNew must be a boolean");
  }

  if (body.isPopular !== undefined && typeof body.isPopular !== "boolean") {
    errors.push("isPopular must be a boolean");
  }

  return { isValid: errors.length === 0, errors };
};
