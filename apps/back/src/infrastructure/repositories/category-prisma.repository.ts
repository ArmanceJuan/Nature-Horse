import { Category } from "../../domain/entities/category.entity.js";
import type { ICategoryRepository } from "../../domain/interfaces/category-repository.interface.js";
import type { DatabaseClient } from "../database/database-client.js";

interface CategoryRow {
  id: string;
  slug: string;
  name: string;
  position: number;
}

export class CategoryPrismaRepository implements ICategoryRepository {
  private readonly database: DatabaseClient;

  constructor(database: DatabaseClient) {
    this.database = database;
  }

  async findAll(): Promise<Category[]> {
    const rows = await this.database.category.findMany({
      orderBy: { position: "asc" },
    });

    return rows.map((row) => this.toDomain(row));
  }

  async findById(id: string): Promise<Category | null> {
    const row = await this.database.category.findUnique({ where: { id } });

    return row ? this.toDomain(row) : null;
  }

  private toDomain(row: CategoryRow): Category {
    return new Category({
      id: row.id,
      slug: row.slug,
      name: row.name,
      position: row.position,
    });
  }
}
