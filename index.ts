import { client, getSchemaVersion } from "./prisma/client";
import express from "express";
import cors from "cors";
import { router } from "./api";

const schemaVersion = await getSchemaVersion();
console.log("Schema Version: ", schemaVersion);

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/api", router);

app.listen(Number(process.env.PORT));
console.log("Started Server on port", process.env.PORT);
