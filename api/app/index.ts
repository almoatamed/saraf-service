import express from "express";
import { isSuspended } from "../../lib/intercom";
import { createApiError } from "../../lib/error";

const router = express.Router();

router.use(async (request, response, next) => {
    const suspended = await isSuspended();
    if (suspended) {
        throw createApiError({
            code: "APP_IS_SUSPENDED",
            status: 403,
            error: "current app is suspended please contact administrators to resolve",
        });
    }
    next();
});

router.get("/status", (_, response) => {
    response.json({
        msg: "OK",
    });
});

export const appRouter = router;
