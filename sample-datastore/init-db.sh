#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
    CREATE DATABASE static_development;
    GRANT ALL PRIVILEGES ON DATABASE static_development TO "$POSTGRES_USER";
    CREATE DATABASE static_test;
    GRANT ALL PRIVILEGES ON DATABASE static_test TO "$POSTGRES_USER";
    CREATE DATABASE static_production;
    GRANT ALL PRIVILEGES ON DATABASE static_production TO "$POSTGRES_USER";
EOSQL
