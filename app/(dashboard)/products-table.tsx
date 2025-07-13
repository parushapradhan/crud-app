'use client';

import {
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  Table
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Product } from './product';
import { SelectProduct } from '@/lib/db';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ProductsTable({
  products,
  offset,
  totalProducts
}: {
  products: SelectProduct[];
  offset: number;
  totalProducts: number;
}) {
  let router = useRouter();
  let searchParams = useSearchParams();
  let productsPerPage = 5;
  let currentPage = Math.floor(offset / productsPerPage);
  let totalPages = Math.ceil(totalProducts / productsPerPage);

  function prevPage() {
    const newOffset = Math.max(0, offset - productsPerPage);
    const params = new URLSearchParams(searchParams);
    params.set('offset', newOffset.toString());
    router.push(`/?${params.toString()}`);
  }

  function nextPage() {
    const newOffset = offset + productsPerPage;
    const params = new URLSearchParams(searchParams);
    params.set('offset', newOffset.toString());
    router.push(`/?${params.toString()}`);
  }

  const startItem = offset + 1;
  const endItem = Math.min(offset + products.length, totalProducts);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Products</CardTitle>
        <CardDescription>
          Manage your products and view their sales performance.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="hidden w-[100px] sm:table-cell">
                <span className="sr-only">Image</span>
              </TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden md:table-cell">Price</TableHead>
              <TableHead className="hidden md:table-cell">
                Total Sales
              </TableHead>
              <TableHead className="hidden md:table-cell">Created at</TableHead>
              <TableHead>
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <Product key={product.id} product={product} />
            ))}
          </TableBody>
        </Table>
      </CardContent>
      <CardFooter>
        <div className="flex items-center w-full justify-between">
          <div className="text-xs text-muted-foreground">
            {totalProducts > 0 ? (
              <>
                Showing{' '}
                <strong>
                  {startItem}-{endItem}
                </strong>{' '}
                of <strong>{totalProducts}</strong> products
              </>
            ) : (
              <span>No products found</span>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              onClick={prevPage}
              variant="ghost"
              size="sm"
              disabled={offset === 0}
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Prev
            </Button>
            <Button
              onClick={nextPage}
              variant="ghost"
              size="sm"
              disabled={endItem >= totalProducts}
            >
              Next
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
