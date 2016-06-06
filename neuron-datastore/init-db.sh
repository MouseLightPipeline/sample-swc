#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" <<-EOSQL
    CREATE DATABASE neuron_development;
    GRANT ALL PRIVILEGES ON DATABASE neuron_development TO "$POSTGRES_USER";
    CREATE DATABASE neuron_test;
    GRANT ALL PRIVILEGES ON DATABASE neuron_test TO "$POSTGRES_USER";
    CREATE DATABASE neuron_production;
    GRANT ALL PRIVILEGES ON DATABASE neuron_production TO "$POSTGRES_USER";
EOSQL
