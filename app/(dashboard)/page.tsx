import { File } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AddProductForm } from './add-product-form';
import { ProductsTabs } from './products-tabs';
import { getProducts } from '@/lib/db';

export default async function ProductsPage(
  props: {
    searchParams: Promise<{ q: string; offset: string; tab?: string }>;
  }
) {
  const searchParams = await props.searchParams;
  const search = searchParams.q ?? '';
  const currentOffset = Number(searchParams.offset ?? 0);
  const currentTab = searchParams.tab ?? 'all';
  
  // Get products based on current tab
  const { products, newOffset, totalProducts } = await getProducts(
    search,
    currentOffset,
    currentTab === 'active' ? 'active' : 
    currentTab === 'inactive' ? 'inactive' : 
    currentTab === 'archived' ? 'archived' : 
    undefined
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-end gap-2">
    
        <AddProductForm />
      </div>
      <ProductsTabs
        products={products}
        offset={currentOffset}
        totalProducts={totalProducts}
        currentTab={currentTab}
      />
    </div>
  );
}
