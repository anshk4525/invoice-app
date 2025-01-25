// db.ts
import { PrismaClient } from '@prisma/client';

const prismaClientSingleton = () => {
    return new PrismaClient();
}

declare global {
    var prismaGlobal: ReturnType<typeof prismaClientSingleton>;
}

export const prisma = global.prismaGlobal ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') {
    global.prismaGlobal = prisma;
}

export default prisma;
