import { seed } from "./seeders";

export const startup = async () => {
    await seed();
};
