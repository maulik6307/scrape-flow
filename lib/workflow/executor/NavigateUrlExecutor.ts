import { ExecutionEnvironment } from "@/types/executor"
import { PageToHtmlTask } from "../task/PageToHtml"
import { FillInputTask } from "../task/FillInput";
import { ClickOnElementTask } from "../task/ClickOnElement.";
import { NavigateUrlTask } from "../task/NavigateUrl";

export async function NavigateUrlExecutor(
   environment: ExecutionEnvironment<typeof NavigateUrlTask>
): Promise<boolean> {
   try {
      const url = environment.getInput("URL");
      if (!url) {
         environment.log.error("Input -> Url is not defined");
      }

      await environment.getPage()!.goto(url)
      environment.log.info(`Navigated to ${url}`)
      return true
   } catch (error: any) {
      environment.log.error(error.message)
      return false
   }
}