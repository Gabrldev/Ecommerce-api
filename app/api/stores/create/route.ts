
import { db } from "@/lib/db";
import { formModalValidator } from "@/lib/validators/formModal";
import { auth } from "@clerk/nextjs";

export async function POST(req: Request) {
  try {
    const { userId } = auth();

    if (!userId) return new Response("Unauthorized", { status: 401 });

    const body = await req.json();

    const { name } = formModalValidator.parse(body);

    if (!name) return new Response("Name is required", { status: 400 });

    const store = await db.store.create({
      data: {
        name,
        userId,
      },
    });

    return new Response("ok");
  } catch (error) {
    return new Response(error.message, { status: 500 });
  }
}
