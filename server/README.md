# Host for Development
```sh
uvicorn main:app --reload
```

# Set up PostgreSQL
To set up the database, first ensure that the `postgresql` service is properly installed and running and that the `postgres` superuser you want to use exists. Also, ensure that the `postgis` extension is installed on your system with the appropriate package manager (example for Debian).
```
$ sudo apt install postgresql
$ sudo apt install postgis
```
For systemd users:
```
$ sudo systemctl start postgresql
```
Next, open `psql` as the `postgres` superuser
```
$ psql -U postgres
```
and create a database for Geogate owned by your postgres user.
```sql
CREATE DATABASE geogate OWNER <your-user>;
```
Then, still as the superuser, grant the appropriate permissions to your user.
```sql
GRANT USAGE ON SCHEMA public TO <your-user>;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO <your-user>;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO <your-user>;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO <your-user>;
```
You can then open `psql` as your user (this happens by default if it matches your Unix username) in the Geogate database
```
$ psql -U <your-user> -d geogate
```
and bootstrap the database by executing the `schema.sql` file.
```sql
\ir ./server/db/schema.sql
```
Also, if you are having issues with `schema.sql`, you can try creating the extension (or running the entire script) as the `postgres` superuser.
```sql
\c geogate
CREATE EXTENSION postgis;
```
