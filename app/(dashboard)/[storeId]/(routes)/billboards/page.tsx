import { BillboardClient } from "@/components/clients/BillboardClient";
import { BillboardColumms } from "@/components/columms";
import { db } from "@/lib/db";
import { format } from "date-fns";

type Props = {
  params: {
    storeId: string;
  };
};
export default async function BillboardsPage({params}: Props) {
  const billboards = await db.billboard.findMany({
    where: {
      storeId: params.storeId,
    },
    orderBy:{
      createdAt: "desc"
    }
  });

  const formattedBillboards:BillboardColumms[] = billboards.map((item) =>{
    return {
      id: item.id,
      label: item.label,
      createdAt: format(new Date(item.createdAt), "MMMM-do-yyyy")
    }
  })
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BillboardClient data={formattedBillboards} />
      </div>
    </div>
  );
}
