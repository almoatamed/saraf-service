import express from "express";
import { getSchemaVersion } from "../prisma/client";
import { intercomRouter } from "./intercom";

const router = express.Router();

router.all("/status", async (_, response) => {
    console.log("hi mom");
    response.json({
        msg: "OK",
        schemaVersion: await getSchemaVersion(),
        env: process.env,
    });
});

router.use("/intercom", intercomRouter);

export { router };
