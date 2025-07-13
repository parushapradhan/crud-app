import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { TableCell, TableRow } from '@/components/ui/table';
import { SelectProduct } from '@/lib/db';
import { EditProductForm } from './edit-product-form';
import { DeleteConfirmationDialog } from './delete-confirmation-dialog';

export function Product({ product }: { product: SelectProduct }) {
  return (
    <TableRow>
      <TableCell className="hidden sm:table-cell">
        <Image
          alt="Product image"
          className="aspect-square rounded-md object-cover"
          height="64"
          src={product.imageUrl}
          width="64"
        />
      </TableCell>
      <TableCell className="font-medium">{product.name}</TableCell>
      <TableCell>
        <Badge variant="outline" className="capitalize">
          {product.status}
        </Badge>
      </TableCell>
      <TableCell className="hidden md:table-cell">{`$${product.price}`}</TableCell>
      <TableCell className="hidden md:table-cell">{product.stock}</TableCell>
      <TableCell className="hidden md:table-cell">
        {product.availableAt.toLocaleDateString("en-US")}
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <EditProductForm product={product} />
          <DeleteConfirmationDialog 
            productId={product.id} 
            productName={product.name} 
          />
        </div>
      </TableCell>
    </TableRow>
  );
}
