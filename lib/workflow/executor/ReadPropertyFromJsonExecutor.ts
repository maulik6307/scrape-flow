import { ExecutionEnvironment } from "@/types/executor"
import { PageToHtmlTask } from "../task/PageToHtml"
import { FillInputTask } from "../task/FillInput";
import { ClickOnElementTask } from "../task/ClickOnElement.";
import { ReadProperyFromJsonTask } from "../task/ReadProperyFromJson";

export async function ReadPropertyFromJsonExecutor(
   environment: ExecutionEnvironment<typeof ReadProperyFromJsonTask>
): Promise<boolean> {
   try {
      const jsonData = environment.getInput("JSON");
      if (!jsonData) {
         environment.log.error("Input -> JSON is not defined");
      }

      const propertyName = environment.getInput("Propery name");
      if (!propertyName) {
         environment.log.error("Input -> propertyName is not defined");
      }

      const json = JSON.parse(jsonData);
      const propertyValue = json[propertyName];
      if (propertyValue === undefined) {
         environment.log.error(`Property ${propertyName} not found in JSON`);
         return false
      }

      environment.setOutput("Property value", propertyValue);
      return true
   } catch (error: any) {
      environment.log.error(error.message)
      return false
   }
}