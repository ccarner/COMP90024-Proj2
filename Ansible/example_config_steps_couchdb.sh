#this is just an example/temp for experimenting, can delete later
# curl -X PUT http://admin:admin@127.0.0.1:5984/_users

# curl -X PUT http://admin:admin@127.0.0.1:5984/_replicator

# curl -X PUT http://admin:admin@127.0.0.1:5984/_global_changes

# curl http://admin:admin@localhost:5984/_all_dbs


curl -XPOST "http://admin:admin@localhost:5984/_cluster_setup" \
      --header "Content-Type: application/json"\
      --data "{\"action\": \"enable_cluster\", \"bind_address\":\"0.0.0.0\",\
             \"username\": \"admin\", \"password\":\"admin\", \"port\": \"5984\",\
             \"remote_node\": \"172.26.128.207\", \"node_count\": \"2\",\
             \"remote_current_user\":\"admin\", \"remote_current_password\":\"admin\"}"

curl -XPOST "http://admin:admin@localhost:5984/_cluster_setup"\
      --header "Content-Type: application/json"\
      --data "{\"action\": \"add_node\", \"host\":\"172.26.128.207\",\
             \"port\": \"5984\", \"username\": \"admin\", \"password\":\"admin\"}"


curl http://admin:admin@localhost:5984/

curl -X POST -H "Content-Type: application/json" http://admin:admin@localhost:5984/_cluster_setup -d '{"action": "finish_cluster"}'

curl http://admin:admin@localhost:5984/_cluster_setup

curl http://admin:admin@localhost:5984/_membership


#instance 1
erl -name 'bus@172.26.133.105' -setcookie 'brumbrum' -kernel inet_dist_listen_min 9100 -kernel inet_dist_listen_max 9105
#instance 3
erl -name 'car@172.26.133.174' -setcookie 'brumbrum' -kernel inet_dist_listen_min 9100 -kernel inet_dist_listen_max 9105

#from instance 1:
net_kernel:connect_node('car@172.26.133.174').

