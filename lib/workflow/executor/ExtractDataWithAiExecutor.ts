import { ExecutionEnvironment } from "@/types/executor"
import { ClickOnElementTask } from "../task/ClickOnElement.";
import { ExtractDataWithAiTask } from "../task/ExtractDataWithAi";
import prisma from "@/lib/prisma";
import { symmetricDecrypted } from "@/lib/encryption";

export async function ExtractDataWithAiExecutor(
   environment: ExecutionEnvironment<typeof ExtractDataWithAiTask>
): Promise<boolean> {
   try {
      const credentials = environment.getInput("Credentials");
      if (!credentials) {
         environment.log.error("Input -> credentials is not defined");
      }

      const prompt = environment.getInput("Prompt");
      if (!prompt) {
         environment.log.error("Input -> prompt is not defined");
      }

      const content = environment.getInput("Content");
      if (!content) {
         environment.log.error("Input -> content is not defined");
      }

      // GET Credentials from DataBase

      const credential = await prisma.credential.findUnique({
         where: {
            id: credentials
         }
      })

      if (!credential) {
         environment.log.error("Credential not found");
         return false
      }

      const plainCredentialsValue = symmetricDecrypted(credential.value)
      if (!plainCredentialsValue) {
         environment.log.error("Failed to decrypt credentials value");
         return false
      }

      const mockExtractedData = {
         userNameSelector: "#username",
         passwordSelector: "#password",
         loginSelector: "body > div > form > input.btn.btn-primary"
      }
      environment.setOutput("Extracted data", JSON.stringify(mockExtractedData))
      return true
   } catch (error: any) {
      environment.log.error(error.message)
      return false
   }
}