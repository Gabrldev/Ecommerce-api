import { ProductForm } from "@/components/forms/ProductForm";
import { db } from "@/lib/db";

type ProductPageProps = {
  params: {
    billboardId: string;
  };
};

const ProductPage = async ({ params }: ProductPageProps) => {
  const product = await db.product.findUnique({
    where: {
      id: params.billboardId,
    },
  });
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductForm initialData={product} />
      </div>
    </div>
  )
};

export default ProductPage;
