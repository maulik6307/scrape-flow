"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import parser from "cron-parser";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function UpdateWorkflowCron({ id, cron }: { id: string, cron: string }) {
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }

  try {
    const interval = parser.parseExpression(cron, { utc: true });
    await prisma.workflow.update({
      where: {
        id,
        userId,
      },
      data: {
        cron,
        nextRunAt: interval.next().toDate(),
      },
    });
  } catch (error: any) {
    console.error("Error updating workflow cron:", error);
    throw new Error("Failed to update workflow cron");
  }

  revalidatePath("/workflows");
}
