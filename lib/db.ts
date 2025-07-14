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
import { count, eq, ilike, and, asc, sql } from 'drizzle-orm';
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
  offset: number,
  status?: 'active' | 'inactive' | 'archived'
): Promise<{
  products: SelectProduct[];
  newOffset: number | null;
  totalProducts: number;
}> {
  // Always search the full table, not per page
  if (search) {
    const searchCondition = ilike(products.name, `%${search}%`);
    const statusCondition = status ? eq(products.status, status) : undefined;
    const whereCondition = statusCondition ? and(searchCondition, statusCondition) : searchCondition;
    
    return {
      products: await db
        .select()
        .from(products)
        .where(whereCondition)
        .orderBy(asc(products.name))
        .limit(1000),
      newOffset: null,
      totalProducts: 0
    };
  }

  if (offset === null) {
    return { products: [], newOffset: null, totalProducts: 0 };
  }

  // Get total count with status filter
  let totalProducts;
  if (status) {
    totalProducts = await db.select({ count: count() }).from(products).where(eq(products.status, status));
  } else {
    totalProducts = await db.select({ count: count() }).from(products);
  }

  // Get products with status filter and sorting
  let moreProducts;
  if (status) {
    moreProducts = await db.select().from(products).where(eq(products.status, status)).orderBy(asc(products.name)).limit(5).offset(offset);
  } else {
    moreProducts = await db.select().from(products).orderBy(asc(products.name)).limit(5).offset(offset);
  }
  
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
  try {
    await db.insert(products).values({
      name: data.name,
      price: data.price,
      stock: data.stock,
      status: data.status,
      imageUrl: data.imageUrl,
      availableAt: data.availableAt
    });
  } catch (error) {
    // If there's a sequence conflict, reset the sequence and try again
    if (error instanceof Error && error.message.includes('duplicate key')) {
      // Reset the sequence to the maximum ID + 1
      await db.execute(sql`SELECT setval('products_id_seq', (SELECT MAX(id) FROM products) + 1, false)`);
      
      // Try inserting again
      await db.insert(products).values({
        name: data.name,
        price: data.price,
        stock: data.stock,
        status: data.status,
        imageUrl: data.imageUrl,
        availableAt: data.availableAt
      });
    } else {
      throw error;
    }
  }
}
