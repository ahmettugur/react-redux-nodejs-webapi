FROM mongo

COPY users.json /users.json
COPY products.json /products.json
COPY categories.json /categories.json

#ADD start.sh /start.sh
#RUN chmod +x /start.sh

CMD mongoimport --host database --db store --collection categories --type json --file /categories.json \
&& mongoimport --host database --db store --collection users --type json --file /users.json \
&& mongoimport --host database --db store --collection products --type json --file /products.json