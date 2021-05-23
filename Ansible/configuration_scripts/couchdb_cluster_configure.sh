#!/bin/bash

#this script is to be run on the masternode

# get nodes from file named openstack-ips.txt
# this was uploaded as part of ansible script

file="/home/ubuntu/openstack-ips.txt" #the file where you keep your string name

nodes=$(cat "$file")

masternode=`echo ${nodes} | cut -f1 -d' '`
othernodes=`echo ${nodes[@]} | sed s/${masternode}//`

echo "environment is"
printenv | cat

#configure the clustering setup for couchdb
#as per https://github.com/AURIN/comp90024/tree/master/couchdb

for node in ${othernodes} 
do
    curl -XPOST "http://${COUCHDB_USER}:${COUCHDB_PASSWORD}@${masternode}:5984/_cluster_setup" \
      --header "Content-Type: application/json"\
      --data "{\"action\": \"enable_cluster\", \"bind_address\":\"0.0.0.0\",\
             \"username\": \"${COUCHDB_USER}\", \"password\":\"${COUCHDB_PASSWORD}\", \"port\": \"5984\",\
             \"remote_node\": \"${node}\", \"node_count\": \"$(echo ${nodes[@]} | wc -w)\",\
             \"remote_current_user\":\"${COUCHDB_USER}\", \"remote_current_password\":\"${COUCHDB_PASSWORD}\"}"
done

for node in ${othernodes}
do
    curl -XPOST "http://${COUCHDB_USER}:${COUCHDB_PASSWORD}@${masternode}:5984/_cluster_setup"\
      --header "Content-Type: application/json"\
      --data "{\"action\": \"add_node\", \"host\":\"${node}\",\
             \"port\": \"5984\", \"username\": \"${COUCHDB_USER}\", \"password\":\"${COUCHDB_PASSWORD}\"}"
done

# This empty request is to avoid an error message when finishing the cluster setup

curl -XGET "http://${COUCHDB_USER}:${COUCHDB_PASSWORD}@${masternode}:5984/"

curl -XPOST "http://${COUCHDB_USER}:${COUCHDB_PASSWORD}@${masternode}:5984/_cluster_setup"\
    --header "Content-Type: application/json" --data "{\"action\": \"finish_cluster\"}"

#add a database for twitter
curl -XPUT "http://${COUCHDB_USER}:${COUCHDB_PASSWORD}@${masternode}:5984/twitter"
