import { auth } from "@clerk/nextjs";
import { db } from "@/lib/db";

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
    
  } catch (error) {
    
  }
}
