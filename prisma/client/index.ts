import { PrismaClient } from "../../generated/prism/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { REQUIRED_VERSION } from "../requiredVersion";

const adapter = new PrismaMariaDb({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    connectionLimit: 5,
});

const client = new PrismaClient({
    adapter: adapter,
});

await client.$connect();

const versionInfo = await client.schemaVersion.findFirstOrThrow();

if (versionInfo.version != REQUIRED_VERSION) {
    console.error(
        "Required Schema version by the binary is",
        REQUIRED_VERSION,
        "and the database schema version is",
        versionInfo.version
    );

    process.exit(1);
}



export {client}