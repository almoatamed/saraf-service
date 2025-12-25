import express from "express";
import { createApiError } from "../../lib/error";
import { decode } from "../../lib/jwt";
import { client } from "../../prisma/client";
import type { JwtPayload } from "jsonwebtoken";

const router = express.Router();

router.use(async (request, response, next) => {
    const authorizationHeader = request.headers.authorization || request.headers.Authorization;
    if (!authorizationHeader || typeof authorizationHeader != "string") {
        throw createApiError({
            code: "AUTHENTICATION_REQUIRED",
            error: "this api set requires authentication jwt header",
            status: 401,
        });
    }

    const token = authorizationHeader.replace(/^Bearer /i, "");

    const invalidCredentialsError = createApiError({
        status: 401,
        code: "UNAUTHORIZED",
        error: "unauthorized",
    });

    let decoded: string | JwtPayload;
    try {
        decoded = decode(token) as any;
    } catch (error) {
        console.error("Error decoding jwt", token, error);
        throw invalidCredentialsError;
    }

    if (!decoded || typeof decoded == "string" || !decoded.itsYourMaster || decoded.tenantId != Number(process.env.TENANT_ID)) {
        throw invalidCredentialsError;
    }

    next();
});

router.get("/schema-version", async (request, response) => {
    return response.json({
        schemaVersion: (await client.schemaVersion.findFirstOrThrow()).version,
    });
});

export const intercomRouter = router;
