#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
    CREATE DATABASE samples_development;
    GRANT ALL PRIVILEGES ON DATABASE samples_development TO "$POSTGRES_USER";
    CREATE DATABASE samples_test;
    GRANT ALL PRIVILEGES ON DATABASE samples_test TO "$POSTGRES_USER";
    CREATE DATABASE samples_production;
    GRANT ALL PRIVILEGES ON DATABASE samples_production TO "$POSTGRES_USER";
EOSQL
