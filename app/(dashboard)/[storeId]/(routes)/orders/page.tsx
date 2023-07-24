import { BillboardClient } from "@/components/clients/BillboardClient";
import { BillboardColumms } from "@/components/columms";
import { db } from "@/lib/db";
import { formatter } from "@/lib/utils";
import { format } from "date-fns";

type Props = {
  params: {
    storeId: string;
  };
};
export default async function OrderPage({ params }: Props) {
  const orders = await db.order.findMany({
    where: {
      storeId: params.storeId,
    },
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedOrders: BillboardColumms[] = orders.map((item) => {
    return {
      id: item.id,
      phone: item.phone,
      address: item.address,
      products: item.orderItems
        .map((orderItem) => orderItem.product.name)
        .join(", "),
      totalPrice: formatter.format(
        item.orderItems.reduce((total, item) => {
          return total + Number(item.product.price);
        }, 0)
      ),
      createdAt: format(new Date(item.createdAt), "MMMM-do-yyyy"),
    };
  });
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <BillboardClient data={formattedOrders} />
      </div>
    </div>
  );
}
