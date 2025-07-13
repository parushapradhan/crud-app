'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useRouter, useSearchParams } from 'next/navigation';
import { ProductsTable } from './products-table';
import { SelectProduct } from '@/lib/db';

interface ProductsTabsProps {
  products: SelectProduct[];
  offset: number;
  totalProducts: number;
  currentTab: string;
}

export function ProductsTabs({ products, offset, totalProducts, currentTab }: ProductsTabsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleTabChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('tab', value);
    params.delete('offset'); // Reset to first page when changing tabs
    router.push(`/?${params.toString()}`);
  };

  return (
    <Tabs value={currentTab} onValueChange={handleTabChange}>
      <div className="flex items-center">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="inactive">Inactive</TabsTrigger>
          <TabsTrigger value="archived" className="hidden sm:flex">
            Archived
          </TabsTrigger>
        </TabsList>
      </div>
      <TabsContent value="all">
        <ProductsTable
          products={products}
          offset={offset}
          totalProducts={totalProducts}
        />
      </TabsContent>
      <TabsContent value="active">
        <ProductsTable
          products={products}
          offset={offset}
          totalProducts={totalProducts}
        />
      </TabsContent>
      <TabsContent value="inactive">
        <ProductsTable
          products={products}
          offset={offset}
          totalProducts={totalProducts}
        />
      </TabsContent>
      <TabsContent value="archived">
        <ProductsTable
          products={products}
          offset={offset}
          totalProducts={totalProducts}
        />
      </TabsContent>
    </Tabs>
  );
} 