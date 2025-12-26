import express from "express";
import { getSchemaVersion } from "../prisma/client";
import { intercomRouter } from "./intercom";
import { appRouter } from "./app";

const router = express.Router();

router.all("/status", async (_, response) => {
    response.json({
        msg: "OK",
        schemaVersion: await getSchemaVersion(),
        env: process.env,
    });
});

router.use("/intercom", intercomRouter);
router.use("/app", appRouter);
export { router };
