#!/bin/sh
chown redis:redis /etc/redis/certs/redis.key
chmod 600 /etc/redis/certs/redis.key
exec redis-server /usr/local/etc/redis/redis.conf
