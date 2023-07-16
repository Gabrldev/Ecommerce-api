import { auth } from "@clerk/nextjs";
import { db } from "@/lib/db";
import { X } from "lucide-react";
import { CategoryValidator } from "@/lib/validators/category";

export async function GET(
  req: Request,
  { params }: { params: { categoriesId: string } }
) {
  try {
    if (!params.categoriesId)
      return new Response("Missing categoriesId", { status: 400 });

    const category = await db.category.findUnique({
      where: {
        id: params.categoriesId,
      },
    });

    if (!category) return new Response("Not Found", { status: 404 });

    return new Response(JSON.stringify(category), { status: 200 });
  } catch (error) {}
}

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string; categoriesId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) return new Response("Unauthorized", { status: 401 });

    const body = await req.json();

    const { name, billboardId } = CategoryValidator.parse(body);

    if (!params.categoriesId)
      return new Response("Missing categoriesId", { status: 400 });

    if (!name) return new Response("Missing name", { status: 400 });

    if (!billboardId)
      return new Response("Missing billboardId", { status: 400 });

    const StoroByUserId = await db.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!StoroByUserId) return new Response("Unauthorized", { status: 401 });

    await db.category.update({
      where: {
        id: params.categoriesId,
      },
      data: {
        name,
        billboardId,
      },
    });

    return new Response("Updated", { status: 200 });
  } catch (error) {}
}

export async function DELETE(
  req: Request,
  { params }: { params: { categoriesId: string; storeId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) return new Response("Unauthorized", { status: 401 });

    if (!params.categoriesId)
      return new Response("Missing categoryId", { status: 400 });

    const StoroByUserId = await db.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!StoroByUserId) return new Response("Unauthorized", { status: 401 });

    await db.category.delete({
      where: {
        id: params.categoriesId,
      },
    });

    return new Response("Deleted", { status: 200 });
  } catch (error) {}
}
