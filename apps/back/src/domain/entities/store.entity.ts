export interface StoreProps {
  id: string;
  name: string;
  address: string;
  postalCode: string;
  city: string;
  phone: string | null;
  email: string | null;
  openingHours: string[];
  createdAt: Date;
  updatedAt: Date;
}

export class Store {
  readonly id: string;
  readonly name: string;
  readonly address: string;
  readonly postalCode: string;
  readonly city: string;
  readonly phone: string | null;
  readonly email: string | null;
  readonly openingHours: string[];
  readonly createdAt: Date;
  readonly updatedAt: Date;

  constructor(props: StoreProps) {
    this.id = props.id;
    this.name = props.name;
    this.address = props.address;
    this.postalCode = props.postalCode;
    this.city = props.city;
    this.phone = props.phone;
    this.email = props.email;
    this.openingHours = props.openingHours;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  get fullAddress(): string {
    return `${this.address}, ${this.postalCode} ${this.city}`;
  }
}
