import express from "express";
import cors from "cors";
import { router } from "./api";
import { startup } from "./startup";
import { createApiError, isApiError, type ApiError } from "./lib/error";

export const run = async () => {
    await startup();

    const app = express();

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cors());

    app.use("/api", router);

    app.use((error: any, _request: express.Request, response: express.Response, _next: express.NextFunction) => {
        console.error(error);
        if (response.headersSent) {
            return;
        }
        if (isApiError(error)) {
            const e: ApiError = error;
            response.status(e.status).json(e);
        } else {
            response.status(500).json(
                createApiError({
                    code: "SERVER_ERROR",
                    error: "server error",
                    status: 500,
                    data: error,
                    errors: [],
                })
            );
        }
    });

    return app;
};

const app = await run();
app.listen(Number(process.env.PORT));
console.log("Started Tenant Server on port", process.env.PORT);
