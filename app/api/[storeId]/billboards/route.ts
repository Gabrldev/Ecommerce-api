import { db } from "@/lib/db";
import { BillboardValidator } from "@/lib/validators/billboard";
import { auth } from "@clerk/nextjs";
import { z } from "zod";

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    // check if user is logged in
    const { userId } = auth();
    // if not logged in
    if (!userId) return new Response("Unauthorized", { status: 401 });
    //request body
    const body = await req.json();
    // validate request body
    const { imageUrl, label } = BillboardValidator.parse(body);
    // if name is empty
    if (!imageUrl || !label)
      return new Response("Invalid request", { status: 400 });
    // check if store already exists
    if (!params.storeId)
      return new Response("Invalid request", { status: 400 });
    // validate storeId
    const storeByUser = await db.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });
    if (!storeByUser) return new Response("Unauthorized", { status: 401 });
    // create store
    await db.billboard.create({
      data: {
        imageUrl,
        label,
        storeId: params.storeId,
      },
    });

    return new Response("Billboard created", { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError)
      return new Response("Invalid POST request data passed", { status: 422 });

    return new Response("Could not create store, please try again later", {
      status: 500,
    });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    if (!params.storeId)
      return new Response("Store id is required", { status: 400 });

    const billboards = await db.billboard.findMany({
      where: {
        storeId: params.storeId,
      },
    });

    return new Response(JSON.stringify(billboards), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response("Could not get billboards, please try again later", {
      status: 500,
    });
  }
}
