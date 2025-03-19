import { ExecutionEnvironment } from "@/types/executor";
import { ExtractDataWithAiTask } from "../task/ExtractDataWithAi";
import prisma from "@/lib/prisma";
import { symmetricDecrypted } from "@/lib/encryption";
import ModelClient, { isUnexpected } from "@azure-rest/ai-inference";
import { AzureKeyCredential } from "@azure/core-auth";

export async function ExtractDataWithAiExecutor(
   environment: ExecutionEnvironment<typeof ExtractDataWithAiTask>
): Promise<boolean> {
   try {
      const credentials = environment.getInput("Credentials");
      if (!credentials) {
         environment.log.error("Input -> credentials is not defined");
         return false;
      }

      const prompt = environment.getInput("Prompt");
      if (!prompt) {
         environment.log.error("Input -> prompt is not defined");
         return false;
      }

      const content = environment.getInput("Content");
      if (!content) {
         environment.log.error("Input -> content is not defined");
         return false;
      }

      // GET Credentials from Database
      const credential = await prisma.credential.findUnique({
         where: {
            id: credentials,
         },
      });

      if (!credential) {
         environment.log.error("Credential not found");
         return false;
      }

      const plainCredentialsValue = symmetricDecrypted(credential.value);
      if (!plainCredentialsValue) {
         environment.log.error("Failed to decrypt credentials value");
         return false;
      }

      // Initialize the DeepSeek AI model client using the decrypted token
      const client = ModelClient(
         "https://models.inference.ai.azure.com",
         new AzureKeyCredential(plainCredentialsValue)
      );

      // Send a request to the AI model using the prompt and content from inputs.
      // Here, we use the "Prompt" as the system instruction and "Content" as the user message.
      const response = await client.path("/chat/completions").post({
         body: {
            messages: [
               { role: "system", content: "You are a webscraper helper that extract data from HTML or text.You will be given a piece of text or HTML content as input and also the prompt with the data you have to extract. The response should always be only the extracted data as a JSON array or object, without any additional words or explanations. Analyze the input carefully and extract data precisely based on the prompt. If no data is found, return as empty JSON array. Work only with the provided content and ensure the output is always a valid JSON array without any surrounding text." },
               { role: "user", content: content },
               { role: "user", content: prompt },
            ],
            model: "DeepSeek-V3",
            temperature: 0.8,
            max_tokens: 2048,
            top_p: 0.1,
         },
      });

      if (isUnexpected(response)) {
         environment.log.error(`AI model error: ${response.body.error}`);
         return false;
      }

      const aiExtractedData = response.body.choices[0].message?.content;
      try {
         const parsedData = JSON.parse(aiExtractedData ?? '{}');
         environment.setOutput("Extracted data", JSON.stringify(parsedData));
      } catch (e) {
         if (aiExtractedData) {
            const compactData = aiExtractedData.replace(/\s+/g, ' ').trim();
            environment.setOutput("Extracted data", compactData);
         } else {
            environment.setOutput("Extracted data", "");
         }
      }

      return true;
   } catch (error: any) {
      environment.log.error(error.message);
      return false;
   }
}
