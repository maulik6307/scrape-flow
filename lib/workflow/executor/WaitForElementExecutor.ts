import { ExecutionEnvironment } from "@/types/executor"
import { WaitForElementTask } from "../task/WaitForElement";

export async function WaitForElementExecutor(
   environment: ExecutionEnvironment<typeof WaitForElementTask>
): Promise<boolean> {
   try {
      const selector = environment.getInput("Selector");
      if (!selector) {
         environment.log.error("Input -> Selector is not defined");
      }

      const visiblity = environment.getInput("Visibility");
      if (!visiblity) {
         environment.log.error("Input -> Visibility is not defined");
      }

      await environment.getPage()!.waitForSelector(selector, { visible: visiblity === "visible", hidden: visiblity === "hidden" });

      environment.log.info(`Element ${selector} become : ${visiblity}`)
      return true
   } catch (error: any) {
      environment.log.error(error.message)
      return false
   }
}