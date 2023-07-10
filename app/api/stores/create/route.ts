import { db } from "@/lib/db";
import { formModalValidator } from "@/lib/validators/formModal";
import { auth } from "@clerk/nextjs";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    // check if user is logged in
    const { userId } = auth();
    // if not logged in
    if (!userId) return new Response("Unauthorized", { status: 401 });
    //request body
    const body = await req.json();
    // validate request body
    const { name } = formModalValidator.parse(body);
    // if name is empty
    if (!name) return new Response("Name is required", { status: 400 });
    // check if store already exists
    const storeExists = await db.store.findFirst({
      where: {
        name,
      }
    })
    // if store already exists
    if (storeExists) return new Response("Store already exists", { status: 409 });
    // create store
    await db.store.create({
      data: {
        name,
        userId,
      },
    });
    // return response
    return new Response("ok");
  } catch (error) {
    if (error instanceof z.ZodError) return new Response("Invalid POST request data passed", { status: 422 });
    // si no es de zod
    return new Response("Could not create store, please try again later", {
      status: 500,
    });
  }
}
