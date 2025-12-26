import { cache } from "react";
import { sign } from "../jwt";

let cachedToken: string | null = null;
const getToken = async () => {
    if (cachedToken) {
        return cachedToken;
    }
    cachedToken = sign({
        tenantId: Number(process.env.TENANT_ID),
    });
    return cachedToken;
};

export async function fetchWithTimeout(path: string, token?: string, options?: RequestInit, timeoutMs = 10000) {
    const url = `http://localhost:${process.env.MASTER_PORT}/${path}`;
    const abortController = new AbortController();
    let headers: Headers | undefined = undefined;
    if (token) {
        headers = new Headers();
        headers.set("authorization", `Bearer ${token}`);
        headers.set("x-tenant-id", String(process.env.TENANT_ID));
    }

    const timer = setTimeout(() => {
        abortController.abort();
    }, timeoutMs);
    const res = await fetch(url, {
        headers,
        ...options,
        signal: abortController.signal,
    });
    clearTimeout(timer);
    if (res.ok) {
        return res; // service is up
    } else {
        throw res;
    }
}

export const isSuspended = async (): Promise<boolean> => {
    const token = await getToken();
    const result = (await (await fetchWithTimeout("api/intercom/is-suspended", token)).json()) as {
        isSuspended: boolean;
    };
    return !!result.isSuspended;
};
