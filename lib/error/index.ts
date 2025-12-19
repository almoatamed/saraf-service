export type ApiError = {
    code: string;
    errors?: string[];
    data?: any;
    error: string;
    status: number;
    __symbol: typeof apiErrorSymbol;
};

export const apiErrorSymbol = Symbol("Api Error");
export const isApiError = (error: any) => {
    return !!error && error.__symbol === apiErrorSymbol;
};

export const throwInvalidJson = () => {
    throw createWebError({
        code: "INVALID_JSON",
        error: "invalid json expected object",
        status: 400,
        errors: [],
    });
};

export const throwIfNotValidBody = (body: any) => {
    if (!body || typeof body != "object") {
        throwInvalidJson();
    }
};

export const createWebError = (apiError: Omit<ApiError, "__symbol">) => {
    const e: ApiError = {
        ...apiError,
        __symbol: apiErrorSymbol,
    };
    return e;
};
export const createApiError = createWebError;
