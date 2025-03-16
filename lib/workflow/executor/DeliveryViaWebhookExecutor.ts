import { ExecutionEnvironment } from "@/types/executor"
import { PageToHtmlTask } from "../task/PageToHtml"
import { FillInputTask } from "../task/FillInput";
import { ClickOnElementTask } from "../task/ClickOnElement.";
import { DeliverViaWebhookTask } from "../task/DeliverViaWebhook";

export async function DeliverViaWebhookExecutor(
   environment: ExecutionEnvironment<typeof DeliverViaWebhookTask>
): Promise<boolean> {
   try {
      const targetUrl = environment.getInput("Target Url");
      if (!targetUrl) {
         environment.log.error("Input -> targetUrl is not defined");
      }

      const body = environment.getInput("Body");
      if (!body) {
         environment.log.error("Input -> body is not defined");
      }

      const response = await fetch(targetUrl, {
         method: "POST",
         headers: {
            "Content-Type": "application/json",
         },
         body: JSON.stringify(body),
      })

      const statusCode = response.status
      if (statusCode !== 200) {
         environment.log.error(`Delivery failed with status code ${statusCode}`);
         return false
      }

      const responseBody = await response.json()
      environment.log.info(`Delivery successful with response: ${JSON.stringify(responseBody, null, 4)}`)
      return true
   } catch (error: any) {
      environment.log.error(error.message)
      return false
   }
}