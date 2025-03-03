import "server-only"
import prisma from "../prisma"
import { revalidatePath } from "next/cache";
import { ExecutionPhaseStatus, WorkflowExecutionStatus } from "@/types/workflow";
import { waitFor } from "../helper/waitFor";
import { ExecutionPhase } from "@prisma/client";
import { AppNode } from "@/types/appNodes";
import { TaskRegistry } from "./task/registry";
import { ExecutorRegistry } from "./executor/registry";
import { Environment, ExecutionEnvironment } from "@/types/executor";
import { TaskParamType } from "@/types/task";
import { Browser, Page } from "puppeteer";
import { Edge } from "@xyflow/react";
import { LogCollector } from "@/types/log";
import { createLogCollector } from "../log";

export async function ExecuteWorkflow(executionId: string) {
    const execution = await prisma.workflowExecution.findUnique({
        where: {
            id: executionId
        },
        include: {
            workflow: true,
            phases: true
        }
    })

    if (!execution) {
        throw new Error("Execution not found")
    }


    const edges = JSON.parse(execution.definition).edges as Edge[]

    // const environment = {
    //     phases: {
    //         launchBrowser: {
    //             inputs: {
    //                 websiteUrl: "https://google.com"
    //             },
    //             outputs: {
    //                 browser: "PuppetterInstance",
    //             }
    //         }
    //     }
    // }

    const environment: Environment = { phases: {} }

    await initializeWorkflowExecution(executionId, execution.workflowId)

    await initializePhaseStauses(execution)



    let creditsConsumed = 0
    let executionFailed = false;
    for (const phase of execution.phases) {
        const phaseExecution = await executeWorkflowPhase(phase, environment, edges)
        if (!phaseExecution.success) {
            executionFailed = true;
            break;
        }
    }

    await finalizeWorkflowExecution(executionId, execution.workflowId, executionFailed, creditsConsumed)

    await cleanupEnvironment(environment)

    revalidatePath("/workflows/runs")
}

async function initializeWorkflowExecution(executionId: string, workflowId: string) {
    await prisma.workflowExecution.update({
        where: {
            id: executionId
        },
        data: {
            startedAt: new Date(),
            status: WorkflowExecutionStatus.RUNNING
        }
    })

    await prisma.workflow.update({
        where: {
            id: workflowId,
        },
        data: {
            lastRunAt: new Date(),
            lastRunStatus: WorkflowExecutionStatus.RUNNING,
            lastRunId: executionId,
        }
    })
}

async function initializePhaseStauses(execution: any) {
    await prisma.executionPhase.updateMany({
        where: {
            id: {
                in: execution.phases.map((phase: any) => phase.id)
            }
        },
        data: {
            status: ExecutionPhaseStatus.PENDING
        }

    })
}

async function finalizeWorkflowExecution(executionId: string, workflowId: string, executionFailed: boolean, creditsConsumed: number) {
    const finalStatus = executionFailed ? WorkflowExecutionStatus.FAILED : WorkflowExecutionStatus.COMPLETED
    await prisma.workflowExecution.update({
        where: {
            id: executionId
        },
        data: {
            status: finalStatus,
            completedAt: new Date(),
            creditsConsumed
        }
    })

    await prisma.workflow.update({
        where: {
            id: workflowId,
            lastRunId: executionId
        },
        data: {
            lastRunStatus: finalStatus
        }
    }).catch((error) => console.log(error))

}

async function executeWorkflowPhase(phase: ExecutionPhase, environment: Environment, edges: Edge[]) {
    const logCollector = createLogCollector()
    const startedAt = new Date()
    const node = JSON.parse(phase.node) as AppNode
    setupEnvironmentForPhase(node, environment, edges)

    await prisma.executionPhase.update({
        where: {
            id: phase.id
        },
        data: {
            status: ExecutionPhaseStatus.RUNNING,
            startedAt,
            inputs: JSON.stringify(environment.phases[node.id].inputs)
        }
    })

    const creditsRequired = TaskRegistry[node.data.type].credits;
    console.log(`Credits required: ${creditsRequired}`);

    const success = await executedPhase(phase, node, environment, logCollector)

    const outputs = environment.phases[node.id].outputs
    await finalizePhase(phase.id, success, outputs, logCollector)
    return { success }

}

async function finalizePhase(phaseId: string, success: boolean, outputs: any, logCollector: LogCollector) {
    const finalStatus = success ? ExecutionPhaseStatus.COMPLETED : ExecutionPhaseStatus.FAILED

    await prisma.executionPhase.update({
        where: {
            id: phaseId
        },
        data: {
            status: finalStatus,
            completeAt: new Date(),
            outputs: JSON.stringify(outputs),
            logs: {
                createMany: {
                    data: logCollector.getAll().map((log) => ({
                        message: log.message,
                        timestamp: log.timestamp,
                        logLevel: log.level
                    }))
                }
            }
        }
    })
}

async function executedPhase(phase: ExecutionPhase, node: AppNode, environment: Environment, logCollector: LogCollector): Promise<boolean> {
    const runFn = ExecutorRegistry[node.data.type]
    if (!runFn) {
        return false
    }

    const executionEnvironment: ExecutionEnvironment<any> = createExecutionEnvironment(node, environment, logCollector)

    return await runFn(executionEnvironment)
}

function setupEnvironmentForPhase(node: AppNode, environment: Environment, edges: Edge[] = []) {
    environment.phases[node.id] = { inputs: {}, outputs: {} }
    const inputs = TaskRegistry[node.data.type].inputs;
    for (const input of inputs) {
        if (input.type === TaskParamType.BROWSER_INSTANCE) continue;
        const inputValue = node.data.inputs[input.name]
        if (inputValue) {
            environment.phases[node.id].inputs[input.name] = inputValue;
            continue;
        }
        const connectedEdge: any = edges.find(
            (edge) => edge.target === node.id && edge.targetHandle === input.name
        );

        if (!connectedEdge) {
            console.error(`Input ${input.name} is required but not provided`);
        }

        const outputValue = environment.phases[connectedEdge.source].outputs[connectedEdge.sourceHandle!]

        environment.phases[node.id].inputs[input.name] = outputValue
    }
}

function createExecutionEnvironment(node: AppNode, environment: Environment, logCollector: LogCollector): ExecutionEnvironment<any> {
    return {
        getInput: (inputName: string) => environment.phases[node.id]?.inputs[inputName],
        setOutput: (outputName: string, value: string) => {
            environment.phases[node.id].outputs[outputName] = value
        },
        getBrowser: () => environment.browser,
        setBrowser: (browser: Browser) => environment.browser = browser,
        getPage: () => environment.page,
        setPage: (page: Page) => environment.page = page,
        log: logCollector
    }
}

async function cleanupEnvironment(environment: Environment) {
    if (environment.browser) {
        await environment.browser.close().catch((err) => console.log(err))
    }
}