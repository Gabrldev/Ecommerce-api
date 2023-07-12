import { db } from "@/lib/db";
import { BillboardValidator } from "@/lib/validators/billboard";
import { auth } from "@clerk/nextjs";

export async function GET(
  req: Request,
  { params }: { params: { billboardId: string } }
) {
  try {
    if (!params.billboardId)
      return new Response("Billboard id is required", { status: 400 });

    const billboard = await db.billboard.findUnique({
      where: {
        id: params.billboardId,
      },
    });

    if (!billboard) return new Response("Billboard not found", { status: 404 });

    return new Response(JSON.stringify(billboard), { status: 200 });
  } catch (error) {
    return new Response("Could not get billboard, please try again later", {
      status: 500,
    });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { billboardId: string; storeId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) return new Response("Unauthorized", { status: 401 });

    if (!params.billboardId)
      return new Response("Billboard id is required", { status: 400 });

    const storeByUser = await db.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!storeByUser) return new Response("Unauthorized", { status: 401 });

    await db.billboard.delete({
      where: {
        id: params.billboardId,
      },
    });

    return new Response("Billboard deleted", { status: 200 });
  } catch (error) {
    return new Response("Could not delete billboard, please try again later", {
      status: 500,
    });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { billboardId: string; storeId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) return new Response("Unauthorized", { status: 401 });

    const body = await req.json();

    const { imageUrl, label } = BillboardValidator.parse(body);

    if (!imageUrl) return new Response("Required imageUrl", { status: 400 });

    if (!label) return new Response("Required label", { status: 400 });

    if (!params.billboardId)
      return new Response("Billboard id is required", { status: 400 });

    const storeByUser = await db.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!storeByUser) return new Response("Unauthorized", { status: 401 });

    await db.billboard.update({
      where: {
        id: params.billboardId,
      },
      data: {
        imageUrl,
        label,
      },
    });

    return new Response("Billboard updated", { status: 200 });
  } catch (error) {
    return new Response("Could not update billboard, please try again later", {
      status: 500,
    });
  }
}
