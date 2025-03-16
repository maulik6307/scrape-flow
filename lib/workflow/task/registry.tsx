import { TaskType } from "@/types/task";
import { ExtractTextFromElementTask } from "./ExtractTextFromElement";
import { LaunchBrowserTask } from "./LaunchBrowser";
import { WorkflowTask } from "@/types/workflow";
import { PageToHtmlTask } from "./PageToHtml";
import { FillInputTask } from "./FillInput";
import { ClickOnElementTask } from "./ClickOnElement.";
import { WaitForElementTask } from "./WaitForElement";
import { DeliverViaWebhookTask } from "./DeliverViaWebhook";
import { ExtractDataWithAiTask } from "./ExtractDataWithAi";

type Registry = {
    [K in TaskType]: WorkflowTask & { type: K }
}

export const TaskRegistry: Registry = {
    LAUNCH_BROWSER: LaunchBrowserTask,
    PAGE_TO_HTML: PageToHtmlTask,
    EXTRACT_TEXT_FROM_ELEMENT: ExtractTextFromElementTask,
    FILL_INPUT: FillInputTask,
    CLICK_ON_ELEMENT: ClickOnElementTask,
    WAIT_FOR_ELEMENT: WaitForElementTask,
    DELIVER_VIA_WEBHOOK: DeliverViaWebhookTask,
    EXTRACT_DATA_WITH_AI: ExtractDataWithAiTask
}
