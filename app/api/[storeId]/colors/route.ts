import { db } from "@/lib/db";
import { colorValidator } from "@/lib/validators/color";
import { auth } from "@clerk/nextjs";
import { ZodError } from "zod";

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) throw new Error("Unauthorized");

    const body = await req.json();

    const { name, value } = colorValidator.parse(body);

    if (!name || !value) return new Response("Invalid color", { status: 400 });

    await db.color.create({
      data: {
        name,
        value,
        storeId: params.storeId,
      },
    });

    return new Response("Color created", { status: 200 });
  } catch (error) {
    if (error instanceof ZodError)
      return new Response("Invalid data provided", { status: 400 });

    return new Response("Internal server error", { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    if (!params.storeId)
      return new Response("Invalid store id", { status: 400 });

    const colors = await db.color.findMany({
      where: {
        storeId: params.storeId,
      },
    });

    return new Response(JSON.stringify(colors), { status: 200 });
  } catch (error) {
    return new Response("Internal server error", { status: 500 });
  }
}
