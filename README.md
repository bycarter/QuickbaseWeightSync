## Quickbase Weight Sync
A simple terminal app to receive and validate scale input into a database, and then push the data into a Quickbase app.

### Setup
1. Be sure the following are installed locally:
   - NodeJS
   - PostgresSQL

2. Then create the database and table listed below.
3. Finally, create an `.env` and fill in appropriate values.

### Template for .env

- Create an `.env` file and fill in the 'PG Params' and 'Quickbase Auth Params'
- Use the `Quickbase variables` and `KEY...` params as needed.

```
# PG Params
PGUSER=
PGPASSWORD=
PGHOST=
PGPORT=
PGDATABASE=

# Quickbase Auth Params
QB_PAT='QB-USER-TOKEN < USER TOKEN >'
QB_HOSTNAME='< company_name >.quickbase.com'
QB_USER_AGENT=

# Quickbase variables
#QB_TABLE_ID=
#QB_PO_ID=

# KEY MMR: 0.9 == 7, 0.5 == 6, 0.3 == 8
#QB_MMR=

# KEY PROD ID: 0.9 == 272, 0.5 == 275, 0.3 == 276
#QB_PROD_ID=
#QB_NUM_CARTS=
#CART_SIZE=
```

### Database Code
- Create a database called 'carts'
- Create a table with the following code:
```SQL
CREATE TABLE control_records(
    id serial PRIMARY KEY,
    tray_n int NOT NULL,
    cell_n int NOT NULL,
    tare numeric(5, 3),
    gross numeric(5, 3),
    c_gross numeric(5, 3),
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    prod_order int NOT NULL,
    net numeric(5, 3),
    p_error numeric(5, 3),
    in_spec bool
);
```