export type ProductStatus = "ACTIVE" | "ARCHIVED";

export const SIZE_ATTRIBUTE = "Taille";

export interface ProductCategoryProps {
  id: string;
  slug: string;
  name: string;
}

export class ProductCategory {
  readonly id: string;
  readonly slug: string;
  readonly name: string;

  constructor(props: ProductCategoryProps) {
    this.id = props.id;
    this.slug = props.slug;
    this.name = props.name;
  }
}

export interface ProductImageProps {
  id: string;
  url: string;
  altText: string | null;
  position: number;
}

export class ProductImage {
  readonly id: string;
  readonly url: string;
  readonly altText: string | null;
  readonly position: number;

  constructor(props: ProductImageProps) {
    this.id = props.id;
    this.url = props.url;
    this.altText = props.altText;
    this.position = props.position;
  }
}

export interface AttributeValueProps {
  attributeName: string;
  value: string;
}

export class AttributeValue {
  readonly attributeName: string;
  readonly value: string;

  constructor(props: AttributeValueProps) {
    this.attributeName = props.attributeName;
    this.value = props.value;
  }
}

export interface ProductVariantProps {
  id: string;
  attributeValues: AttributeValue[];
  stockByStore: Record<string, number>;
}

export class ProductVariant {
  readonly id: string;
  readonly attributeValues: AttributeValue[];
  readonly stockByStore: Record<string, number>;

  constructor(props: ProductVariantProps) {
    this.id = props.id;
    this.attributeValues = props.attributeValues;
    this.stockByStore = { ...props.stockByStore };
  }

  attribute(name: string): string | undefined {
    return this.attributeValues.find(
      (attributeValue) => attributeValue.attributeName === name,
    )?.value;
  }

  stockInStore(storeId: string): number {
    return this.stockByStore[storeId] ?? 0;
  }

  totalStock(): number {
    return Object.values(this.stockByStore).reduce(
      (sum, quantity) => sum + quantity,
      0,
    );
  }

  withStock(storeId: string, quantity: number): ProductVariant {
    return new ProductVariant({
      id: this.id,
      attributeValues: this.attributeValues,
      stockByStore: { ...this.stockByStore, [storeId]: quantity },
    });
  }
}

export interface ProductProps {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  collection: string;
  discipline: string;
  category: ProductCategory | null;
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

export class Product {
  readonly id: string;
  readonly slug: string;
  readonly name: string;
  readonly description: string;
  readonly price: number;
  readonly collection: string;
  readonly discipline: string;
  readonly category: ProductCategory | null;
  readonly status: ProductStatus;
  readonly specs: string[];
  readonly shippingInfo: string;
  readonly isNew: boolean;
  readonly isPopular: boolean;
  readonly images: ProductImage[];
  readonly variants: ProductVariant[];
  readonly createdAt: Date;
  readonly updatedAt: Date;

  constructor(props: ProductProps) {
    this.id = props.id;
    this.slug = props.slug;
    this.name = props.name;
    this.description = props.description;
    this.price = props.price;
    this.collection = props.collection;
    this.discipline = props.discipline;
    this.category = props.category;
    this.status = props.status;
    this.specs = props.specs;
    this.shippingInfo = props.shippingInfo;
    this.isNew = props.isNew;
    this.isPopular = props.isPopular;
    this.images = props.images;
    this.variants = props.variants;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  isActive(): boolean {
    return this.status === "ACTIVE";
  }

  totalStock(): number {
    return this.variants.reduce(
      (sum, variant) => sum + variant.totalStock(),
      0,
    );
  }

  isVisibleInCatalog(): boolean {
    return this.isActive() && this.totalStock() > 0;
  }

  hasAnySize(sizes: string[]): boolean {
    return this.variants.some((variant) => {
      const size = variant.attribute(SIZE_ATTRIBUTE);
      return size !== undefined && sizes.includes(size);
    });
  }

  withStatus(status: ProductStatus): Product {
    return new Product({ ...this.toProps(), status });
  }

  withVariantStock(
    variantId: string,
    storeId: string,
    quantity: number,
  ): Product {
    const variants = this.variants.map((variant) =>
      variant.id === variantId ? variant.withStock(storeId, quantity) : variant,
    );

    return new Product({ ...this.toProps(), variants });
  }

  private toProps(): ProductProps {
    return {
      id: this.id,
      slug: this.slug,
      name: this.name,
      description: this.description,
      price: this.price,
      collection: this.collection,
      discipline: this.discipline,
      category: this.category,
      status: this.status,
      specs: this.specs,
      shippingInfo: this.shippingInfo,
      isNew: this.isNew,
      isPopular: this.isPopular,
      images: this.images,
      variants: this.variants,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
