# Geogate Server
## Host for Development
To host the FastAPI backend for development, multiple steps have to be taken. First, install the required python dependencies with the below command.
```bash
$ cd server
$ pip install -r requirements.txt
```
**Note:** You may have to use `pip3` instead of `pip` depending on your system.

Next, set up the database following the instructions in the [PostgreSQL section](#setting-up-postgresql).

Then run the server with `uvicorn`, which was previously installed, from the command line in the `server` directory.
```bash
$ uvicorn main:app --reload
```

## Setting up PostgreSQL
To set up the database, you must first install the PostgreSQL and PostGIS packages on your system:
```bash
$ sudo apt install postgresql
$ sudo apt install postgis
```
**Note:** `apt` is the Debian package manager used as example, you must use your system's appropriate package manager (e.g. `brew` for MacOS, also omit the `sudo` for MacOS).

You then must start the `postgresql` service. For systemd users, run the command:
```bash
$ sudo systemctl start postgresql
```
At this point, you may create a PostgreSQL user (preferably matching your Unix username) to be the owner of the database. This is optional and you may, alternatively, follow the subsequent commands with the PostgreSQL superuser (`postgres`) instead.

Next, open `psql` as the `postgres` superuser.
```bash
$ psql -U postgres
```
You can then add the `postgis` extension and create a database for Geogate owned by your PostgreSQL user.
```sql
CREATE EXTENSION postgis;
CREATE DATABASE geogate OWNER <your-user>;
```
Then, still as the superuser, grant the appropriate permissions to your user (skip if only using the superuser).
```sql
GRANT USAGE ON SCHEMA public TO <your-user>;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO <your-user>;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO <your-user>;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO <your-user>;
```
You can then open `psql` as your user (this happens by default if it matches your Unix username) in the Geogate database
```bash
$ psql -U <your-user> -d geogate
```
and bootstrap the database by executing the `schema.sql` file.
```sql
\ir ./server/db/schema.sql
```
Also, if you are having issues with `schema.sql`, you can try creating the extension (or running the entire script) as the `postgres` superuser.
```bash
$ psql -U postgres
```
```sql
\c geogate
CREATE EXTENSION postgis;
```
