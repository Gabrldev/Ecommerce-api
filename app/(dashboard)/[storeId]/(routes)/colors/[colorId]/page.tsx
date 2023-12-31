import { ColorForm } from "@/components/forms/ColorForm";
import { db } from "@/lib/db";

type ColorPageProps = {
  params: {
    colorId: string;
  };
};

const BillboardPage = async ({ params }: ColorPageProps) => {
  const color = await db.color.findUnique({
    where: {
      id: params.colorId,
    },
  });
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ColorForm initialData={color} />
      </div>
    </div>
  );
};

export default BillboardPage;
