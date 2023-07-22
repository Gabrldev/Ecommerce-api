import { db } from "@/lib/db";
import { colorValidator } from "@/lib/validators/color";
import { auth } from "@clerk/nextjs";
import { ZodError } from "zod";

export async function GET(
  req: Request,
  { params }: { params: { colorId: string } }
) {
  try {
    if (!params.colorId)
      return new Response("Missing colorId", { status: 400 });

    const color = await db.color.findUnique({
      where: {
        id: params.colorId,
      },
    });

    if (!color) return new Response("Not Found", { status: 404 });

    return new Response(JSON.stringify(color), { status: 200 });
  } catch (error) {
    return new Response("Internal server error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { colorId: string; storeId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) return new Response("Unauthorized", { status: 401 });

    if (!params.colorId)
      return new Response("Missing colorId", { status: 400 });

    const storeByUser = await db.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!storeByUser) return new Response("Unauthorized", { status: 401 });

    await db.color.delete({
      where: {
        id: params.colorId,
      },
    });

    return new Response("Deleted", { status: 200 });
  } catch (error) {
    return new Response("Internal server error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { colorId: string; storeId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) return new Response("Unauthorized", { status: 401 });

    const body = await req.json();

    const { name, value } = colorValidator.parse(body);

    if (!params.colorId)
      return new Response("Missing colorId", { status: 400 });

    if (!name) return new Response("Missing name", { status: 400 });

    if (!value) return new Response("Missing value", { status: 400 });

    const storeByUser = await db.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!storeByUser) return new Response("Unauthorized", { status: 401 });

    await db.color.update({
      where: {
        id: params.colorId,
      },
      data: {
        name,
        value,
      },
    });

    return new Response("Updated", { status: 200 });
  } catch (error) {
    if (error instanceof ZodError)
      return new Response("data invalid", { status: 400 });

    return new Response("Internal server error", { status: 500 });
  }
}
