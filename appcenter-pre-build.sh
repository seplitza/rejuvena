#!/usr/bin/env bash

# Creates an .env from ENV variables which are prefixed by APP
ENV_WHITELIST=${ENV_WHITELIST:-"^APP_"}

printf "Creating .env file\n"

set | egrep -e $ENV_WHITELIST | sed 's/^APP_//g' > .env

printf "\n.env created"

cat .env
