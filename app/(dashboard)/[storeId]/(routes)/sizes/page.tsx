import { SizeColumms } from "@/components/columms/Columms.sizes";
import { SizesClient } from "@/components/SizesClient";
import { db } from "@/lib/db";
import { format } from "date-fns";

type Props = {
  params: {
    storeId: string;
  };
};
export default async function SizesPage({ params }: Props) {
  const sizes = await db.size.findMany({
    where: {
      storeId: params.storeId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedSize: SizeColumms[] = sizes.map((item) => {
    return {
      id: item.id,
      name: item.name,
      value: item.value,
      createdAt: format(new Date(item.createdAt), "MMMM-do-yyyy"),
    };
  });
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SizesClient data={formattedSize} />
      </div>
    </div>
  );
}
