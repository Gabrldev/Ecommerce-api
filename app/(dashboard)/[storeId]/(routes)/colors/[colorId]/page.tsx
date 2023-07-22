import { SizeForm } from "@/components/SizeForm";
import { db } from "@/lib/db";

type BillboardPageProps = {
  params: {
    sizeId: string;
  };
};

const BillboardPage = async ({ params }: BillboardPageProps) => {
  const sizes = await db.size.findUnique({
    where: {
      id: params.sizeId,
    },
  });
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SizeForm initialData={sizes} />
      </div>
    </div>
  )
};

export default BillboardPage;
