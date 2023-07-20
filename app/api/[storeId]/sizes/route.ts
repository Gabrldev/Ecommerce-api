import { db } from "@/lib/db";
import { SizesValidator } from "@/lib/validators/sizes";
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

    const { name, value } = SizesValidator.parse(body);

    if (!name) return new Response("Missing name", { status: 400 });

    if (!value) return new Response("Missing value", { status: 400 });

    if (!params.storeId) return new Response("Missing sizeId", { status: 400 });

    const StoroByUserId = await db.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!StoroByUserId) return new Response("Unauthorized", { status: 401 });

    await db.size.create({
      data: {
        name,
        value,
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

    if (!params.storeId)
      return new Response("Missing storeId", { status: 400 });

    const sizes = await db.size.findMany({
      where: {
        storeId: params.storeId,
      },
    });

    return new Response(JSON.stringify(sizes), { status: 200 });
  } catch (error) {
    return new Response("Internal Server Error", { status: 500 });
  }
}
