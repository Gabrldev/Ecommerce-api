import { ColorColumms } from "@/components/columms/Columms.colors"; 
import { ColorsClient } from "@/components/clients/ColorsClient"; 
import { db } from "@/lib/db";
import { format } from "date-fns";

const ColorsPage = async ({ params }: { params: { storeId: string } }) => {
  const colors = await db.color.findMany({
    where: {
      storeId: params.storeId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedColors: ColorColumms[] = colors.map((item) => ({
    id: item.id,
    name: item.name,
    value: item.value,
    createdAt: format(new Date(item.createdAt), "dd/MM/yyyy"),


  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ColorsClient data={formattedColors} />
      </div>
    </div>
  );
};

export default ColorsPage;
