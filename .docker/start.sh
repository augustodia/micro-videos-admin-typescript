#!/bin/bash

yarn && yarn migrate:ts up && yarn start:dev

tail -f /dev/null