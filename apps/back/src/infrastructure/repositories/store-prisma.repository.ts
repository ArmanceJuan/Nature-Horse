import { Store } from "../../domain/entities/store.entity.js";
import type { IStoreRepository } from "../../domain/interfaces/store-repository.interface.js";
import type { DatabaseClient } from "../database/database-client.js";

interface StoreRow {
  id: string;
  name: string;
  address: string;
  postalCode: string;
  city: string;
  phone: string | null;
  email: string | null;
  openingHours: unknown;
  createdAt: Date;
  updatedAt: Date;
}

export class StorePrismaRepository implements IStoreRepository {
  private readonly database: DatabaseClient;

  constructor(database: DatabaseClient) {
    this.database = database;
  }

  async findAll(): Promise<Store[]> {
    const rows = await this.database.store.findMany({
      orderBy: { city: "asc" },
    });

    return rows.map((row) => this.toDomain(row));
  }

  async findById(id: string): Promise<Store | null> {
    const row = await this.database.store.findUnique({ where: { id } });

    return row ? this.toDomain(row) : null;
  }

  private toDomain(row: StoreRow): Store {
    return new Store({
      id: row.id,
      name: row.name,
      address: row.address,
      postalCode: row.postalCode,
      city: row.city,
      phone: row.phone,
      email: row.email,
      openingHours: row.openingHours as string[],
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    });
  }
}
