#!/bin/bash

sleep 30
mongoimport --host database --db store --collection categories --type json --file /categories.json \
&& mongoimport --host database --db store --collection users --type json --file /users.json \
&& mongoimport --host database --db store --collection products --type json --file /products.json