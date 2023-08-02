import Stripe from "stripe";

import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  // parse the request body
  const body = await req.text();
  // get the stripe signature from the header
  const signature = headers().get("stripe-signature") as string;
  let event: Stripe.Event;

  try {
    // verify the event against the stripe signature
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error: any) {
    return new NextResponse(`Webhook error: ${error.message}`, { status: 400 });
  }
  // get the session object from the event
  const session = event.data.object as Stripe.Checkout.Session;
  // get the address from the session object
  const address = session?.customer_details?.address;
  // convert the address object to an array of strings
  const addressComponents = [
    address?.line1,
    address?.line2,
    address?.city,
    address?.state,
    address?.postal_code,
    address?.country,
  ];
  // filter out null values and join the array into a string
  const addressString = addressComponents.filter((c) => c !== null).join(", ");
  // if the event type is checkout.session.completed
  if (event.type === "checkout.session.completed") {
    // update the order with the address and phone number
    const order = await db.order.update({
      where: {
        id: session?.metadata?.orderId,
      },
      data: {
        isPaid: true,
        address: addressString,
        phone: session?.customer_details?.phone || "",
      },
      include: {
        orderItems: true,
      },
    });
    // get the product ids from the order items
    const productIds = order.orderItems.map((item) => item.orderId);
    // archive the products
    db.product.updateMany({
      where: {
        id: {
          in: [...productIds],
        },
      },
      data: {
        isArchived: true,
      },
    });
  }
  // return a 200 response
  return new NextResponse(null, { status: 200 });
}
