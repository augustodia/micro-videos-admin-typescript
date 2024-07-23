#!/bin/bash

yarn && yarn migrate:ts && yarn start:dev

tail -f /dev/null