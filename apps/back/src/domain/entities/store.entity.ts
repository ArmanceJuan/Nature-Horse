export interface Store {
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
