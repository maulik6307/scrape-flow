import { getCreditsPack, PackId } from "@/types/billing";
import "server-only"
import Stripe from "stripe";
import prisma from "../prisma";

export async function handleCheckoutSessionCompleted(event: Stripe.Checkout.Session) {
    if (!event.metadata) {
        throw new Error("metadata not found")
    }

    const { userId, packId } = event.metadata
    if (!userId || !packId) {
        throw new Error("metadata not found")
    }

    const purchasePack = getCreditsPack(packId as PackId);
    if (!purchasePack) {
        throw new Error("Pack not found")
    }

    await prisma.userBalance.upsert({
        where: {
            userId
        },
        update: {
            credits: {
                increment: purchasePack.credits
            }
        },
        create: {
            userId,
            credits: purchasePack.credits
        }
    })

    await prisma.userPurchase.create({
        data: {
            userId,
            stripeId: event.id,
            description: `${purchasePack.credits} credits`,
            amount: event.amount_total!,
            currency: event.currency!
        }
    })
}