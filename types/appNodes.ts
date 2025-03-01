import { Node } from "@xyflow/react";
import { TaskParam, TaskType } from "./task";

export interface AppNodeData {
    type: TaskType;
    inputs: Record<string, string>;
    [key: string]: any
}

export interface AppNode extends Node {
    data: AppNodeData
}


export interface ParamProps {
    param: TaskParam
    updateNodeParamValue: (newValue: string) => void
    value: string
    disabled?: boolean
}

export type AppNodeMissingInputs = {
    nodeId: string,
    inputs: string[]
}