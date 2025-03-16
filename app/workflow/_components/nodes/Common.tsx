import { TaskParamType } from "@/types/task";

export const ColorForHandle: any = {
    [TaskParamType.BROWSER_INSTANCE]: "!bg-sky-400",
    [TaskParamType.STRING]: "!bg-amber-400",
    [TaskParamType.SELECT]: "!bg-rose-400",
    [TaskParamType.CREDENTIAL]: "!bg-teal-400"
}