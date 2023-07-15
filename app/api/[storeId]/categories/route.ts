import { auth } from "@clerk/nextjs";

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { userId } = auth();

    if(!userId) return new Response("Unauthorized", { status: 401 });

    


  } catch (error) {}
}
