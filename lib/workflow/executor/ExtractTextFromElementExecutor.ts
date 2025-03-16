import { ExecutionEnvironment } from "@/types/executor"
import { ExtractTextFromElementTask } from "../task/ExtractTextFromElement";
import * as cheerio from "cheerio"
import { env } from "process";

export async function ExtractTextFromElementExecutor(
   environment: ExecutionEnvironment<typeof ExtractTextFromElementTask>
): Promise<boolean> {
   try {
      const selector = environment.getInput("Selector");
      if (!selector) {
         environment.log.error("Selector is required");
         return false
      }
      const html = environment.getInput("Html");
      if (!html) {
         environment.log.error("Html is required");
         return false
      }

      const $ = cheerio.load(html)
      const element = $(selector);



      if (element.length === 0) {
         environment.log.error("No elements found with the provided selector");
         return false;
      }

      const extractedText = $.text(element);
      console.log("extractedText", extractedText);

      if (!extractedText) {
         environment.log.error("Extracted text is empty");
         return false

      }

      environment.setOutput("Extracted text", extractedText)
      return true
   } catch (error: any) {
      environment.log.error(error.message)
      return false
   }
}