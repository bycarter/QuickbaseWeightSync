## Quickbase Weight Sync
A simple terminal app to receive and validate scale input into a database, and then push the data into a Quickbase app.

### Prerequisites
- NodeJS 
- PostgreSQL 15.6 (required version)
```bash
# Install on Mac with Homebrew
brew install postgresql@15
```

### Setup Steps

1. PostgreSQL Setup:
   - Start PostgreSQL service:
```bash
brew services start postgresql@15
```
   - Create your user database if psql doesn't work:
```bash
createdb $USER
```
   - Create the application database:
```bash
createdb carts
```
   - Connect to database and create table:
```bash
psql carts
```

2. Create Database Table:
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

3. Install Node.js Dependencies:
```bash
npm install
```

4. Environment Setup:
   - Create `.env` file in project root
   - Add required configuration values:

```bash
# PG Params
PGUSER=           # Your system username
PGPASSWORD=       # Leave blank if no password set
PGHOST=localhost
PGPORT=5432
PGDATABASE=carts

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

### Troubleshooting

1. If `psql` command doesn't work:
```bash
createdb $USER  # Create database matching your username
```

2. Check PostgreSQL version:
```bash
psql --version  # Should show 15.x
```

3. Verify database connection:
```bash
psql carts
\dt  # Should show control_records table
```

### Version Requirements
- PostgreSQL: 15.6
- Node.js: See package.json
- Required npm packages:
  - dotenv
  - json-templates
  - pg
  - readline-sync
