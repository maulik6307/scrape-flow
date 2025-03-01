export enum TaskType {
    LAUNCH_BROWSER = "LAUNCH_BROWSER",
    PAGE_TO_HTML = "PAGE_TO_HTML",
    EXTRACT_TEXT_FROM_ELEMENT = "EXTRACT_TEXT_FROM_ELEMENT"
}

export enum TaskParamType {
    STRING = "STRING",
    BROWSER_INSTANCE = "BROWSER_INSTANCE",
    NUMBER = "NUMBER",
    BOOLEAN = "BOOLEAN"
}

export interface TaskParam {
    name: string;
    type: TaskParamType;
    helperText?: string;
    required?: boolean;
    hideHandle?: boolean;
    value?: string | number | boolean;
    [key: string]: any
}