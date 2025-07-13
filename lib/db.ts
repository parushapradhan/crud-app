import 'server-only';

import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import {
  pgTable,
  text,
  numeric,
  integer,
  timestamp,
  pgEnum,
  serial
} from 'drizzle-orm/pg-core';
import { count, eq, ilike } from 'drizzle-orm';
import { createInsertSchema } from 'drizzle-zod';

export const db = drizzle(neon(process.env.POSTGRES_URL!));

export const statusEnum = pgEnum('status', ['active', 'inactive', 'archived']);

export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  imageUrl: text('image_url').notNull(),
  name: text('name').notNull(),
  status: statusEnum('status').notNull(),
  price: numeric('price', { precision: 10, scale: 2 }).notNull(),
  stock: integer('stock').notNull(),
  availableAt: timestamp('available_at').notNull()
});

export type SelectProduct = typeof products.$inferSelect;
export const insertProductSchema = createInsertSchema(products);

export async function getProducts(
  search: string,
  offset: number
): Promise<{
  products: SelectProduct[];
  newOffset: number | null;
  totalProducts: number;
}> {
  // Always search the full table, not per page
  if (search) {
    return {
      products: await db
        .select()
        .from(products)
        .where(ilike(products.name, `%${search}%`))
        .limit(1000),
      newOffset: null,
      totalProducts: 0
    };
  }

  if (offset === null) {
    return { products: [], newOffset: null, totalProducts: 0 };
  }

  let totalProducts = await db.select({ count: count() }).from(products);
  let moreProducts = await db.select().from(products).limit(5).offset(offset);
  let newOffset = moreProducts.length >= 5 ? offset + 5 : null;

  return {
    products: moreProducts,
    newOffset,
    totalProducts: totalProducts[0].count
  };
}

export async function deleteProductById(id: number) {
  await db.delete(products).where(eq(products.id, id));
}

export async function getProductById(id: number): Promise<SelectProduct | null> {
  const result = await db.select().from(products).where(eq(products.id, id));
  return result[0] || null;
}

export async function updateProductById(
  id: number,
  data: {
    name: string;
    price: string;
    stock: number;
    status: 'active' | 'inactive' | 'archived';
    imageUrl: string;
    availableAt: Date;
  }
) {
  await db
    .update(products)
    .set({
      name: data.name,
      price: data.price,
      stock: data.stock,
      status: data.status,
      imageUrl: data.imageUrl,
      availableAt: data.availableAt
    })
    .where(eq(products.id, id));
}

export async function insertProduct(data: {
  name: string;
  price: string;
  stock: number;
  status: 'active' | 'inactive' | 'archived';
  imageUrl: string;
  availableAt: Date;
}) {
  await db.insert(products).values({
    name: data.name,
    price: data.price,
    stock: data.stock,
    status: data.status,
    imageUrl: data.imageUrl,
    availableAt: data.availableAt
  });
}
