import { db } from "@/lib/db";
import { CategoryValidator } from "@/lib/validators/category";
import { auth } from "@clerk/nextjs";
import { ZodError } from "zod";

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) return new Response("Unauthorized", { status: 401 });

    const body = await req.json();

    const { billboardId, name } = CategoryValidator.parse(body);

    if (!billboardId)
      return new Response("Missing billboardId", { status: 400 });

    if (!name) return new Response("Missing name", { status: 400 });

    if (!params.storeId)
      return new Response("Missing storeId", { status: 400 });

    const StoroByUserId = await db.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!StoroByUserId) return new Response("Unauthorized", { status: 401 });

    await db.category.create({
      data: {
        billboardId,
        name,
        storeId: params.storeId,
      },
    });

    return new Response("Created", { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return new Response("Bad Request, data invalid", { status: 400 });
    }

    return new Response("Internal Server Error", { status: 500 });
  }
}
export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    if (!params.storeId) {
      return new Response("Missing storeId", { status: 400 });
    }

    const categories = await db.category.findMany({
      where: {
        storeId: params.storeId,
      },
    });

    return new Response(JSON.stringify(categories), { status: 200 });
  } catch (error) {
    return new Response("Internal Server Error", { status: 500 });
  }
}
