// scripts/create_and_pump_migration.js
import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { REQUIRED_VERSION } from "./requiredVersion";

const currentDir = import.meta.dirname;

const PRISMA_ROOT = path.join(currentDir);
const MIGRATIONS_DIR = path.join(PRISMA_ROOT, "migrations");
const schemaPath = path.join(import.meta.dirname, "./schema.prisma");

// run prisma migrate dev --create-only to create the migration folder
export function createMigration(
    schemaPath: string,
    dbUrl: string
): null | string {
    const oldContent = fs.readdirSync(MIGRATIONS_DIR);
    const cmd = `DATABASE_URL="${dbUrl}"  bunx prisma migrate dev --create-only --schema="${schemaPath}"`;
    execSync(cmd, { stdio: "inherit" });
    // find the most recent folder in prisma/migrations
    const migrationDirectoryContent = fs.readdirSync(MIGRATIONS_DIR);
    for (const item of migrationDirectoryContent) {
        const fullPath = path.join(MIGRATIONS_DIR, item);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            const migrationFilePath = path.join(fullPath, "migration.sql");
            const content = fs.readFileSync(migrationFilePath, "utf-8");
            if (content.startsWith("-- This is an empty migration.")) {
                fs.rmSync(fullPath ,{
                    recursive: true, 
                    force: true,
                });
            }
        }
    }

    const folders = fs.readdirSync(MIGRATIONS_DIR);
    if (oldContent.length == folders.length) {
        let identical = true;
        for (const item of folders) {
            if (!oldContent.find((f) => f == item)) {
                identical = false;
            }
        }
        if (identical) {
            return null;
        }
    }
    const mapped = folders
        .filter((f) => {
            return fs.statSync(path.join(MIGRATIONS_DIR, f)).isDirectory();
        })
        .map((f) => ({
            name: f,
            mtime: fs.statSync(path.join(MIGRATIONS_DIR, f)).mtimeMs,
        }))
        .sort((a, b) => b.mtime - a.mtime);
    if (mapped.length === 0) {
        throw new Error("No migrations found after create-only");
    }
    return path.join(MIGRATIONS_DIR, mapped[0]?.name!);
}

// append an idempotent SQL statement to the generated migration.sql
export function appendVersionUpsertToMigration(
    migrationFolder: string,
    version: number
) {
    const migrationSqlPath = path.join(migrationFolder, "migration.sql");
    if (!fs.existsSync(migrationSqlPath))
        throw new Error("migration.sql not found: " + migrationSqlPath);

    const upsertSql = `
INSERT INTO SchemaVersion (id, version)
VALUES (1, ${version})
ON DUPLICATE KEY UPDATE version = VALUES(version);
`;

    fs.appendFileSync(migrationSqlPath, "\n" + upsertSql);
}

// Example usage (dev flow)
async function runDev() {
    const dbName = "saraf_dev_tenant";
    const username = "admin";
    const password = "admin";
    const dbUrl = `mysql://${username}:${password}@localhost:3306/${dbName}`;

    const migrationFolder = createMigration(schemaPath, dbUrl);
    if (!migrationFolder) {
        console.log("No changes");
        process.exit(0);
    }
    appendVersionUpsertToMigration(migrationFolder, REQUIRED_VERSION);

    // now, for dev/test you can deploy to the tenant DB to verify:
    execSync(
        `DATABASE_URL=${dbUrl} bunx prisma migrate deploy --schema="${schemaPath}"`,
        {
            stdio: "inherit",
        }
    );

    console.log(
        "Migration created, SQL patched with version upsert, and deployed for tenant:",
        dbName
    );
}

if (require.main === module) {
    try {
        await runDev();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}
