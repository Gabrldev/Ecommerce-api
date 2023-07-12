import { db } from "@/lib/db";
import { ChangeNameStoreValidator } from "@/lib/validators/changeNameStore";
import { auth } from "@clerk/nextjs";

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) return new Response("Unauthorized", { status: 401 });

    const body = await req.json();

    const { name } = ChangeNameStoreValidator.parse(body);

    if (!name) return new Response("Name is required", { status: 400 });

    if (!params.storeId)
      return new Response("Store not found", { status: 404 });

    const store = await db.store.updateMany({
      where: {
        id: params.storeId,
        userId,
      },
      data: {
        name,
      },
    });

    if (!store) return new Response("Store not found", { status: 404 });

    return new Response("ok");
  } catch (error) {
    return new Response("Could not update store, please try again later", {
      status: 500,
    });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) return new Response("Unauthorized", { status: 401 });

    if (!params.storeId)
      return new Response("Store not found", { status: 404 });

    const store = await db.store.deleteMany({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!store) return new Response("Store not found", { status: 404 });

    return new Response("ok");
  } catch (error) {
    return new Response("Could not delete store, please try again later", {
      status: 500,
    });
  }
}