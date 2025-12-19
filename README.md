this is a tenant based SAAS managed by the tenant management system

to run it you use pm2 for example in production

```sh
PORT=tenant-port DATABASE_HOST="localhost" DATABASE_USER="admin" DATABASE_PASSWORD="admin" DATABASE_NAME="__tenant-id__service-id"  pm2 start index.ts --name="__tenant-id__service-id" --interpreter=`which bun`
```

to preserve env and restart `pm2 restart __tenant-id__service-id`
to update env

```sh
PORT=tenant-port DATABASE_HOST="localhost" DATABASE_USER="admin" DATABASE_PASSWORD="admin" DATABASE_NAME="__tenant-id__service-id"  pm2 restart __tenant-id__service-id --update-env`
```

in development just run `bun --watch index.ts` or just `bun index.ts`
