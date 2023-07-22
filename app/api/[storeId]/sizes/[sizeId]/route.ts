import { db } from "@/lib/db";
import { SizesValidator } from "@/lib/validators/sizes";
import { auth } from "@clerk/nextjs";
import { ZodError } from "zod";

export async function GET(
  req: Request,
  { params }: { params: { sizeId: string } }
) {
  try {
    if (!params.sizeId) return new Response("Missing sizeId", { status: 400 });

    const size = await db.size.findUnique({
      where: { id: params.sizeId },
    });

    if (!size) return new Response("Size not found", { status: 404 });

    return new Response(JSON.stringify(size), { status: 200 });
  } catch (error) {
    return new Response("Internal server error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { sizeId: string; storeId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) return new Response("Unauthorized", { status: 401 });

    const body = await req.json();

    const { name, value } = SizesValidator.parse(body);

    if (!name) return new Response("Missing name", { status: 400 });

    if (!value) return new Response("Missing value", { status: 400 });

    if (!params.sizeId) return new Response("Missing sizeId", { status: 400 });

    const storeByUser = await db.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!storeByUser) return new Response("Unauthorized", { status: 401 });

    await db.size.update({
      where: { id: params.sizeId },
      data: {
        name,
        value,
      },
    });

    return new Response("Size updated", { status: 200 });
  } catch (error) {
    if (error instanceof ZodError)
      return new Response("data invalid", { status: 400 });

    return new Response("Internal server error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { sizeId: string; storeId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) return new Response("Unauthorized", { status: 401 });

    if (!params.sizeId) return new Response("Missing sizeId", { status: 400 });

    const storeByUser = await db.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!storeByUser) return new Response("Unauthorized", { status: 401 });

    await db.size.delete({
      where: { id: params.sizeId },
    });

    return new Response("Size deleted", { status: 200 });
  } catch (error) {
    return new Response("Internal server error", { status: 500 });
  }
}
