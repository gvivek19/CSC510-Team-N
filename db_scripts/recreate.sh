#! /bin/bash

psql -U postgres -d postgres -f dbUser.sql
psql -U postgres -d postgres -c "DROP DATABASE submit;"
psql -U postgres -d postgres -c "CREATE DATABASE submit WITH owner=foo ENCODING='utf-8';"

psql -U foo -d submit -f schema.sql
