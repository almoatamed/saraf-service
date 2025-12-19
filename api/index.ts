import express from "express";
import { getSchemaVersion } from "../prisma/client";

const router = express.Router();

router.all("/status", async (_, response) => {
    response.json({
        msg: "OK",
        schemaVersion: await getSchemaVersion(),
    });
});

export { router };
