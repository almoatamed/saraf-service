import { hash } from "../../lib/passwordHashing";
import { client } from "../../prisma/client";

const seedSuperAdmin = async () => {
    const superUser = await client.user.findFirst({
        where: {
            username: "admin",
        },
    });

    if (!superUser) {
        if (!process.env.SUPER_ADMIN_PASSWORD) {
            throw new Error("Default super admin password not defined");
        }

        await client.user.create({
            data: {
                username: "admin",
                name: "Super Admin",
                passwordHash: await hash(process.env.SUPER_ADMIN_PASSWORD),
                active: true,
            },
        });
    }
};

export const seed = async () => {
    await seedSuperAdmin();
};
