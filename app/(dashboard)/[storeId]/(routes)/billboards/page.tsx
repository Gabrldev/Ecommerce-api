import { BillboardClient } from "@/components/BillboardClient";
import { db } from "@/lib/db";

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
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BillboardClient data={billboards} />
      </div>
    </div>
  );
}
