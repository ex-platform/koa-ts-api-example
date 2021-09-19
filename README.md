# koa-ts-api-example

REST API using KOA framework, typescript, TypeORM.

## Set up in local

```sh
# Start mariadb docker container
sh db.sh

# Get a shell to a container
docker container exec -it maria-example /bin/bash

# In docker container
$ mysql -u root -p
```

```sql
CREATE DATABASE example;

USE example;
```

## Auth

HEADER (LOCAL BASED ON DEFAULT SECRET KEY)

```text
Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJuYW1lIjoiSmF2aWVyIEF2aWxlcyIsImVtYWlsIjoiYXZpbGVzbG9wZXouamF2aWVyQGdtYWlsLmNvbSJ9.rgOobROftUYSWphkdNfxoN2cgKiqNXd4Km4oz6Ex4ng
```
