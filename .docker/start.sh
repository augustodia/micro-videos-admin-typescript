#!/bin/bash

npm install && npm run migrate:ts up && npm run start:dev

tail -f /dev/null