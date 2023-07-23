import { db } from "@/lib/db";
import { productsValidator } from "@/lib/validators/products";
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

    const {
      categoryId,
      colorId,
      images,
      name,
      price,
      sizeId,
      isArchived,
      isFeatured,
    } = productsValidator.parse(body);

    if (!name) return new Response("Name is required", { status: 400 });

    if (!images || !images.length)
      return new Response("Images are required", { status: 400 });

    if (!price) return new Response("Price is required", { status: 400 });

    if (!categoryId)
      return new Response("Category is required", { status: 400 });

    if (!colorId) return new Response("Color is required", { status: 400 });

    if (!sizeId) return new Response("Size is required", { status: 400 });

    if (!params.storeId)
      return new Response("Store is required", { status: 400 });

    const storeByUser = await db.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!storeByUser) return new Response("unauthorized", { status: 401 });

    await db.product.create({
      data: {
        name,
        price,
        isFeatured,
        isArchived,
        categoryId,
        colorId,
        sizeId,
        storeId: params.storeId,
        images: {
          createMany: {
            data: [...images.map((image: { url: string }) => image)],
          },
        },
      },
    });

    return new Response("Product created", { status: 201 });
  } catch (error) {
    if (error instanceof ZodError)
      return new Response("Data is not valid", { status: 400 });
    return new Response("Internal server error", { status: 500 });
  }
}

export async function GET(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { searchParams } = new URL(req.url);

    const categoryId = searchParams.get("categoryId") || undefined;

    const colorId = searchParams.get("colorId") || undefined;

    const sizeId = searchParams.get("sizeId") || undefined;

    const isFeatured = searchParams.get("isFeatured");

    if (!params.storeId)
      return new Response("Store is required", { status: 400 });

    const products = await db.product.findMany({
      where: {
        storeId: params.storeId,
        categoryId,
        colorId,
        sizeId,
        isFeatured: isFeatured ? true : undefined,
        isArchived: false,
      },
      include: {
        images: true,
        category: true,
        color: true,
        size: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return new Response(JSON.stringify(products), { status: 200 });
  } catch (error) {
    return new Response("Internal server error", { status: 500 });
  }
}
