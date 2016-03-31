#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
    CREATE DATABASE main_development;
    GRANT ALL PRIVILEGES ON DATABASE main_development TO "$POSTGRES_USER";
    CREATE DATABASE main_test;
    GRANT ALL PRIVILEGES ON DATABASE main_test TO "$POSTGRES_USER";
    CREATE DATABASE main_production;
    GRANT ALL PRIVILEGES ON DATABASE main_production TO "$POSTGRES_USER";
EOSQL
