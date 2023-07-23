import { CategoryClient } from "@/components/clients/CategoryClient"; 
import { CategoryColumms } from "@/components/columms/Columms.category"; 
import { db } from "@/lib/db";
import { format } from "date-fns";

type Props = {
  params: {
    storeId: string;
  };
};
export default async function BillboardsPage({ params }: Props) {
  const categories = await db.category.findMany({
    where: {
      storeId: params.storeId,
    },
    include: {
      billboard: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });


  const formattedCategory: CategoryColumms[] = categories.map((item) => {
    return {
      id: item.id,
      name: item.name,
      billboardLabel: item.billboard.label,
      createdAt: format(new Date(item.createdAt), "MMMM-do-yyyy"),
    };
  });
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CategoryClient data={formattedCategory} />
      </div>
    </div>
  );
}
