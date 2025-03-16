import { ExecutionEnvironment } from "@/types/executor"
import { PageToHtmlTask } from "../task/PageToHtml"
import { FillInputTask } from "../task/FillInput";
import { ClickOnElementTask } from "../task/ClickOnElement.";

export async function ClickOnElementExecutor(
   environment: ExecutionEnvironment<typeof ClickOnElementTask>
): Promise<boolean> {
   try {
      const selector = environment.getInput("Selector");
      if (!selector) {
         environment.log.error("Input -> Selector is not defined");
      }

      await environment.getPage()!.click(selector)
      return true
   } catch (error: any) {
      environment.log.error(error.message)
      return false
   }
}