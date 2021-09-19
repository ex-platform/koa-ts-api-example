docker run --name maria-example -p 127.0.0.1:3306:3306 \
-v ${PWD}/db:/var/lib/mysql -e MARIADB_ROOT_PASSWORD=my-secret-pw \
-d mariadb:10.6