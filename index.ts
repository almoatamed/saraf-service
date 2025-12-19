import { client } from "./prisma/client";

const version = await client.schemaVersion.findFirst();
console.log("Schema version: ", version?.version);


console.log(process.env["SERVICE_ID"])