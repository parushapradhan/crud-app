'use server';

import { deleteProductById, updateProductById, insertProduct } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function deleteProduct(formData: FormData) {
  const id = Number(formData.get('id'));
  if (id) {
    await deleteProductById(id);
    revalidatePath('/');
  }
}

export async function updateProduct(formData: FormData) {
  const id = Number(formData.get('id'));
  const name = formData.get('name') as string;
  const price = formData.get('price') as string;
  const stock = Number(formData.get('stock'));
  const status = formData.get('status') as 'active' | 'inactive' | 'archived';
  const imageUrl = formData.get('imageUrl') as string;
  const availableAt = new Date(formData.get('availableAt') as string);

  if (id && name && price && stock && status && imageUrl && availableAt) {
    await updateProductById(id, {
      name,
      price,
      stock,
      status,
      imageUrl,
      availableAt
    });
    revalidatePath('/');
  }
}

export async function addProduct(formData: FormData) {
  const name = formData.get('name') as string;
  const price = formData.get('price') as string;
  const stock = Number(formData.get('stock'));
  const status = formData.get('status') as 'active' | 'inactive' | 'archived';
  const imageUrl = formData.get('imageUrl') as string;
  const availableAt = new Date(formData.get('availableAt') as string);

  if (name && price && stock && status && imageUrl && availableAt) {
    await insertProduct({
      name: name.trim(),
      price,
      stock,
      status,
      imageUrl: imageUrl.trim(),
      availableAt
    });
    revalidatePath('/');
  }
}
