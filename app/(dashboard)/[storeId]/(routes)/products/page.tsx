import { BillboardClient } from "@/components/clients/BillboardClient";
import { ProductClient } from "@/components/clients/ProductsClient";
import { ProductsColumms } from "@/components/columms/Columms.products";
import { db } from "@/lib/db";
import { formatter } from "@/lib/utils";
import { format } from "date-fns";

type Props = {
  params: {
    storeId: string;
  };
};
export default async function ProdudctPage({ params }: Props) {
  const products = await db.product.findMany({
    where: {
      storeId: params.storeId,
    },
    include: {
      category: true,
      size: true,
      color: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedProducts: ProductsColumms[] = products.map((item) => {
    return {
      id: item.id,
      name: item.name,
      isFeatured: item.isFeatured,
      isArchived: item.isArchived,
      price: formatter.format(item.price.toNumber()),
      category: item.category.name,
      size: item.category.name,
      color: item.color.value,
      createdAt: format(new Date(item.createdAt), "MMMM-do-yyyy"),
    };
  });
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductClient data={formattedProducts} />
      </div>
    </div>
  );
}
