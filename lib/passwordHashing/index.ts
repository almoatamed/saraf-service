export const hash = async (password: string) => {
    return await Bun.password.hash(password);
};
export const verify = async (password: string, hash: string) => {
    return await Bun.password.verify(password, hash);
};
