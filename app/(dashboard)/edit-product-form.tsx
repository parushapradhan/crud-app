'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { SelectProduct } from '@/lib/db';
import { updateProduct } from './actions';
import { Edit } from 'lucide-react';

interface EditProductFormProps {
  product: SelectProduct;
}

interface FormErrors {
  name?: string;
  price?: string;
  stock?: string;
  imageUrl?: string;
  availableAt?: string;
}

export function EditProductForm({ product }: EditProductFormProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [formData, setFormData] = useState({
    name: product.name,
    price: product.price.toString(),
    stock: product.stock.toString(),
    status: product.status,
    imageUrl: product.imageUrl,
    availableAt: product.availableAt.toISOString().split('T')[0]
  });

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    // Price validation
    if (!formData.price) {
      newErrors.price = 'Price is required';
    } else {
      const price = parseFloat(formData.price);
      if (isNaN(price) || price <= 0) {
        newErrors.price = 'Price must be a positive number';
      }
    }

    // Stock validation
    if (!formData.stock) {
      newErrors.stock = 'Stock is required';
    } else {
      const stock = parseInt(formData.stock);
      if (isNaN(stock) || stock < 0) {
        newErrors.stock = 'Stock must be a non-negative integer';
      }
    }

    // Image URL validation
    if (!formData.imageUrl.trim()) {
      newErrors.imageUrl = 'Image URL is required';
    } else if (!formData.imageUrl.startsWith('http')) {
      newErrors.imageUrl = 'Image URL must be a valid URL';
    }

    // Available date validation
    if (!formData.availableAt) {
      newErrors.availableAt = 'Available date is required';
    } else {
      const date = new Date(formData.availableAt);
      if (isNaN(date.getTime())) {
        newErrors.availableAt = 'Please select a valid date';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      const form = new FormData();
      form.append('id', product.id.toString());
      form.append('name', formData.name.trim());
      form.append('price', formData.price);
      form.append('stock', formData.stock);
      form.append('status', formData.status);
      form.append('imageUrl', formData.imageUrl.trim());
      form.append('availableAt', formData.availableAt);
      
      await updateProduct(form);
      setOpen(false);
      setErrors({});
    } catch (error) {
      console.error('Error updating product:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      // Reset form when closing
      setFormData({
        name: product.name,
        price: product.price.toString(),
        stock: product.stock.toString(),
        status: product.status,
        imageUrl: product.imageUrl,
        availableAt: product.availableAt.toISOString().split('T')[0]
      });
      setErrors({});
    }
    setOpen(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <Edit className="h-4 w-4 mr-2" />
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
          <DialogDescription>
            Make changes to your product here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="name" className="text-right text-sm font-medium">
                Name
              </label>
              <div className="col-span-3">
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && (
                  <p className="text-xs text-red-500 mt-1">{errors.name}</p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="price" className="text-right text-sm font-medium">
                Price
              </label>
              <div className="col-span-3">
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className={errors.price ? 'border-red-500' : ''}
                />
                {errors.price && (
                  <p className="text-xs text-red-500 mt-1">{errors.price}</p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="stock" className="text-right text-sm font-medium">
                Stock
              </label>
              <div className="col-span-3">
                <Input
                  id="stock"
                  type="number"
                  min="0"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  className={errors.stock ? 'border-red-500' : ''}
                />
                {errors.stock && (
                  <p className="text-xs text-red-500 mt-1">{errors.stock}</p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="status" className="text-right text-sm font-medium">
                Status
              </label>
              <div className="col-span-3">
                <select
                  id="status"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'inactive' | 'archived' })}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="imageUrl" className="text-right text-sm font-medium">
                Image URL
              </label>
              <div className="col-span-3">
                <Input
                  id="imageUrl"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className={errors.imageUrl ? 'border-red-500' : ''}
                />
                {errors.imageUrl && (
                  <p className="text-xs text-red-500 mt-1">{errors.imageUrl}</p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="availableAt" className="text-right text-sm font-medium">
                Available At
              </label>
              <div className="col-span-3">
                <Input
                  id="availableAt"
                  type="date"
                  value={formData.availableAt}
                  onChange={(e) => setFormData({ ...formData, availableAt: e.target.value })}
                  className={errors.availableAt ? 'border-red-500' : ''}
                />
                {errors.availableAt && (
                  <p className="text-xs text-red-500 mt-1">{errors.availableAt}</p>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 