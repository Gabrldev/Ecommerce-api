import { db } from "@/lib/db";
import { productsValidator } from "@/lib/validators/products";
import { auth } from "@clerk/nextjs";
import { ZodError } from "zod";

export async function GET(
  req: Request,
  { params }: { params: { productId: string } }
) {
  try {
    if (!params.productId)
      return new Response("Product Id is required", { status: 400 });

    const product = await db.product.findUnique({
      where: { id: params.productId },
      include: {
        images: true,
        category: true,
        size: true,
        color: true,
      },
    });

    return new Response(JSON.stringify(product), { status: 200 });
  } catch (error) {
    return new Response("Internal Server Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { productId: string; storeId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) return new Response("Unauthorized", { status: 401 });

    if (!params.productId)
      return new Response("Product Id is required", { status: 400 });

    if (!params.storeId)
      return new Response("Store Id is required", { status: 400 });

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

    if (!categoryId)
      return new Response("Category Id is required", { status: 400 });

    if (!colorId) return new Response("Color Id is required", { status: 400 });

    if (!sizeId) return new Response("Size Id is required", { status: 400 });

    if (!name) return new Response("Name is required", { status: 400 });

    if (!price) return new Response("Price is required", { status: 400 });

    if (!images || !images.length)
      return new Response("Images are required", { status: 400 });

    const storeByUser = await db.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!storeByUser) return new Response("Unauthorized", { status: 401 });

    await db.product.update({
      where: {
        id: params.productId,
      },
      data: {
        name,
        price,
        categoryId,
        colorId,
        images: {
          deleteMany: {},
        },
        isFeatured,
        isArchived,
      },
    });

    await db.product.update({
      where: {
        id: params.productId,
      },
      data: {
        images: {
          createMany: {
            data: [...images.map((image: { url: string }) => image)],
          },
        },
      },
    });

    return new Response("Product updated successfully", { status: 200 });
  } catch (error) {
    if (error instanceof ZodError)
      return new Response("Invalid data", { status: 400 });

    return new Response("Internal Server Error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { productId: string; storeId: string } }
) {
  try {
    const { userId } = auth();

    if (!userId) return new Response("Unauthorized", { status: 401 });

    if (!params.storeId)
      return new Response("Store Id is required", { status: 400 });

    if (!params.productId)
      return new Response("Product Id is required", { status: 400 });

    const storeByUser = await db.store.findFirst({
      where: {
        id: params.storeId,
        userId,
      },
    });

    if (!storeByUser) return new Response("Unauthorized", { status: 401 });

    await db.product.delete({
      where: {
        id: params.productId,
      },
    });

    return new Response("Product deleted successfully", { status: 200 });
  } catch (error) {
    return new Response("Internal Server Error", { status: 500 });
  }
}
