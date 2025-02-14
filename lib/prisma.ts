import { PrismaClient } from "@prisma/client"

const PrismaCLientSingleton = () => {
    return new PrismaClient()
}

declare const globalThis: {
    prismaGlobal: ReturnType<typeof PrismaCLientSingleton>
} & typeof global

const prisma = globalThis.prismaGlobal ?? PrismaCLientSingleton();

export default prisma

if (process.env.NODE_ENV !== "production")
    globalThis.prismaGlobal = prisma