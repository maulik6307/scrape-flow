"use server"

import prisma from "@/lib/prisma"
import { stripe } from "@/lib/stripe/stripe"
import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

export async function DownloadInvoice(id: string) {
    const { userId } = await auth()

    if (!userId) {
        redirect("/sign-in");
    }

    const purchase = await prisma.userPurchase.findUnique({
        where: {
            id,
            userId
        }
    })

    if (!purchase) {
        throw new Error("bad request")
    }

    const session = await stripe.checkout.sessions.retrieve(purchase.stripeId);

    if (!session.invoice) {
        throw new Error("Invoice not found")
    }

    const invoice = await stripe.invoices.retrieve(session.invoice as string)

    return invoice.hosted_invoice_url
}